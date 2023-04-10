<?php

declare(strict_types=1);

namespace OCA\Memories;

use OC\Files\Search\SearchBinaryOperator;
use OC\Files\Search\SearchComparison;
use OC\Files\Search\SearchQuery;
use OCP\App\IAppManager;
use OCP\Files\Node;
use OCP\Files\Search\ISearchBinaryOperator;
use OCP\Files\Search\ISearchComparison;
use OCP\IAppConfig;
use OCP\IConfig;

class Util
{
    use UtilController;

    public static $ARCHIVE_FOLDER = '.archive';

    /**
     * Get host CPU architecture (amd64 or aarch64).
     */
    public static function getArch()
    {
        $uname = php_uname('m');
        if (false !== stripos($uname, 'aarch64') || false !== stripos($uname, 'arm64')) {
            return 'aarch64';
        }
        if (false !== stripos($uname, 'x86_64') || false !== stripos($uname, 'amd64')) {
            return 'amd64';
        }

        return null;
    }

    /**
     * Get the libc type for host (glibc or musl).
     */
    public static function getLibc()
    {
        if ($ldd = shell_exec('ldd --version 2>&1')) {
            if (false !== stripos($ldd, 'musl')) {
                return 'musl';
            }
            if (false !== stripos($ldd, 'glibc')) {
                return 'glibc';
            }
        }

        return null;
    }

    /**
     * Check if albums are enabled for this user.
     */
    public static function albumsIsEnabled(): bool
    {
        $appManager = \OC::$server->get(IAppManager::class);

        if (!$appManager->isEnabledForUser('photos')) {
            return false;
        }

        $v = $appManager->getAppVersion('photos');

        return version_compare($v, '1.7.0', '>=');
    }

    /**
     * Check if tags is enabled for this user.
     */
    public static function tagsIsEnabled(): bool
    {
        $appManager = \OC::$server->get(IAppManager::class);

        return $appManager->isEnabledForUser('systemtags');
    }

    /**
     * Check if recognize is enabled for this user.
     */
    public static function recognizeIsEnabled(): bool
    {
        $appManager = \OC::$server->get(IAppManager::class);

        if (!$appManager->isEnabledForUser('recognize')) {
            return false;
        }

        $v = $appManager->getAppVersion('recognize');
        if (!version_compare($v, '3.0.0-alpha', '>=')) {
            return false;
        }

        $c = \OC::$server->get(IAppConfig::class);
        if ('true' !== $c->getValue('recognize', 'faces.enabled', 'false')) {
            return false;
        }

        return true;
    }

    /**
     * Check if Face Recognition is enabled by the user.
     */
    public static function facerecognitionIsEnabled(): bool
    {
        try {
            $uid = self::getUID();
        } catch (\Exception $e) {
            return false;
        }

        $config = \OC::$server->get(IConfig::class);
        $e = $config->getUserValue($uid, 'facerecognition', 'enabled', 'false');

        return 'true' === $e;
    }

    /**
     * Check if Face Recognition is installed and enabled for this user.
     */
    public static function facerecognitionIsInstalled(): bool
    {
        $appManager = \OC::$server->get(IAppManager::class);

        if (!$appManager->isEnabledForUser('facerecognition')) {
            return false;
        }

        $v = $appManager->getAppInfo('facerecognition')['version'];

        return version_compare($v, '0.9.10-beta.2', '>=');
    }

    /**
     * Check if link sharing is allowed.
     */
    public static function isLinkSharingEnabled(): bool
    {
        $config = \OC::$server->get(IConfig::class);

        // Check if the shareAPI is enabled
        if ('yes' !== $config->getAppValue('core', 'shareapi_enabled', 'yes')) {
            return false;
        }

        // Check whether public sharing is enabled
        if ('yes' !== $config->getAppValue('core', 'shareapi_allow_links', 'yes')) {
            return false;
        }

        return true;
    }

    /**
     * Force a fileinfo value on a node.
     * This is a hack to avoid subclassing everything.
     *
     * @param mixed $node  File to patch
     * @param mixed $key   Key to set
     * @param mixed $value Value to set
     */
    public static function forceFileInfo(Node &$node, $key, $value)
    {
        /** @var \OC\Files\Node\Node */
        $node = $node;
        $node->getFileInfo()[$key] = $value;
    }

    /**
     * Force permissions on a node.
     *
     * @param mixed $node        File to patch
     * @param mixed $permissions Permissions to set
     */
    public static function forcePermissions(Node &$node, int $permissions)
    {
        self::forceFileInfo($node, 'permissions', $permissions);
    }

    /**
     * Convert permissions to string.
     */
    public static function permissionsToStr(int $permissions): string
    {
        $str = '';
        if ($permissions & \OCP\Constants::PERMISSION_CREATE) {
            $str .= 'C';
        }
        if ($permissions & \OCP\Constants::PERMISSION_READ) {
            $str .= 'R';
        }
        if ($permissions & \OCP\Constants::PERMISSION_UPDATE) {
            $str .= 'U';
        }
        if ($permissions & \OCP\Constants::PERMISSION_DELETE) {
            $str .= 'D';
        }
        if ($permissions & \OCP\Constants::PERMISSION_SHARE) {
            $str .= 'S';
        }

        return $str;
    }

    /**
     * Add OG metadata to a page for a node.
     *
     * @param mixed $node        Node to get metadata from
     * @param mixed $title       Title of the page
     * @param mixed $url         URL of the page
     * @param mixed $previewArgs Preview arguments (e.g. token)
     */
    public static function addOgMetadata(Node $node, string $title, string $url, array $previewArgs)
    {
        // Add title
        \OCP\Util::addHeader('meta', ['property' => 'og:title', 'content' => $title]);

        // Get first node if folder
        if ($node instanceof \OCP\Files\Folder) {
            $query = new SearchBinaryOperator(ISearchBinaryOperator::OPERATOR_OR, [
                new SearchComparison(ISearchComparison::COMPARE_LIKE, 'mimetype', 'image/%'),
                new SearchComparison(ISearchComparison::COMPARE_LIKE, 'mimetype', 'video/%'),
            ]);
            $query = new SearchQuery($query, 1, 0, [], null);
            $nodes = $node->search($query);
            if (0 === \count($nodes)) {
                return;
            }
            $node = $nodes[0];
        }

        // Add file type
        $mimeType = $node->getMimeType();
        if (str_starts_with($mimeType, 'image/')) {
            \OCP\Util::addHeader('meta', ['property' => 'og:type', 'content' => 'image']);
        } elseif (str_starts_with($mimeType, 'video/')) {
            \OCP\Util::addHeader('meta', ['property' => 'og:type', 'content' => 'video']);
        }

        // Add OG url
        \OCP\Util::addHeader('meta', ['property' => 'og:url', 'content' => $url]);

        // Get URL generator
        $urlGenerator = \OC::$server->get(\OCP\IURLGenerator::class);

        // Add OG image
        $preview = $urlGenerator->linkToRouteAbsolute('memories.Image.preview', array_merge($previewArgs, [
            'id' => $node->getId(),
            'x' => 1024,
            'y' => 1024,
            'a' => true,
        ]));
        \OCP\Util::addHeader('meta', ['property' => 'og:image', 'content' => $preview]);
    }

    /**
     * Check if any encryption is enabled that we can not cope with
     * such as end-to-end encryption.
     */
    public static function isEncryptionEnabled(): bool
    {
        $encryptionManager = \OC::$server->get(\OCP\Encryption\IManager::class);
        if ($encryptionManager->isEnabled()) {
            // Server-side encryption (OC_DEFAULT_MODULE) is okay, others like e2e are not
            return 'OC_DEFAULT_MODULE' !== $encryptionManager->getDefaultEncryptionModuleId();
        }

        return false;
    }

    /**
     * Check if geolocation (places) is enabled and available.
     * Returns the type of the GIS.
     */
    public static function placesGISType(): int
    {
        return self::getSystemConfig('memories.gis_type');
    }

    /**
     * Get a system config key with the correct default.
     *
     * @param null|mixed $default
     */
    public static function getSystemConfig(string $key, $default = null)
    {
        $config = \OC::$server->get(\OCP\IConfig::class);

        return $config->getSystemValue($key, $default ?? self::systemConfigDefaults()[$key]);
    }

    /** Get list of defaults for all system config keys. */
    public static function systemConfigDefaults(): array
    {
        return [
            // Places database type identifier
            'memories.gis_type' => -1,

            // Disable transcoding
            'memories.vod.disable' => true,

            // VA-API configuration options
            'memories.vod.vaapi' => false,  // Transcode with VA-API
            'memories.vod.vaapi.low_power' => false, // Use low_power mode for VA-API

            // NVENC configuration options
            'memories.vod.nvenc' => false,  // Transcode with NVIDIA NVENC
            'memories.vod.nvenc.temporal_aq' => false,
            'memories.vod.nvenc.scale' => 'npp', // npp or cuda

            // Paths to ffmpeg and ffprobe binaries
            'memories.vod.ffmpeg' => '',
            'memories.vod.ffprobe' => '',

            // Path to go-vod binary
            'memories.vod.path' => '',

            // Path to use for transcoded files (/tmp/go-vod/instanceid)
            // Make sure this has plenty of space
            'memories.vod.tempdir' => '',

            // Bind address to use when starting the transcoding server
            'memories.vod.bind' => '127.0.0.1:47788',

            // Address used to connect to the transcoding server
            // If not specified, the bind address above will be used
            'memories.vod.connect' => '127.0.0.1:47788',

            // Mark go-vod as external. If true, Memories will not attempt to
            // start go-vod if it is not running already.
            'memories.vod.external' => false,

            // Set the default video quality for a first time user
            //    0 => Auto (default)
            //   -1 => Original (max quality with transcoding)
            //   -2 => Direct (disable transcoding)
            // 1080 => 1080p (and so on)
            'memories.video_default_quality' => '0',
        ];
    }

    /**
     * Kill all instances of a process by name.
     * Similar to pkill, which may not be available on all systems.
     */
    public static function pkill(string $name): void
    {
        // don't kill everything
        if (empty($name)) {
            return;
        }

        // get pids using ps as array
        $pids = shell_exec("ps -ef | grep {$name} | grep -v grep | awk '{print $2}'");
        if (null === $pids || empty($pids)) {
            return;
        }
        $pids = array_filter(explode("\n", $pids));

        // kill all pids
        foreach ($pids as $pid) {
            posix_kill((int) $pid, 9); // SIGKILL
        }
    }
}
