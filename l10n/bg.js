OC.L10N.register(
    "memories",
    {
    "Memories" : "Спомени",
    "Yet another photo management app" : "Вече е на разположение още едно приложение за управление на снимки",
    "# Memories\n\n* **📸 Photo and Video Timeline**: Sorts photos by date taken, parsed from Exif data.\n* **🤔 Quick Recap**: Jump to anywhere in the timeline instantly.\n* **🖼️ Folders**: Browse your and shared folders with a similar, efficient timeline.\n* **🤖 AI Tagging**: Group photos by people and objects using AI, powered by the [recognize](https://github.com/nextcloud/recognize) app.\n* **🎦 Slideshow**: View photos from your timeline and folders easily.\n* **📱 Mobile Support**: Relive your memories on devices of any shape and size through the web app.\n* **✏️ Edit Metadata**: Edit Exif dates on photos quickly and easily.\n* **📦 Archive**: Store photos you don't want to see in your timeline in a separate folder.\n* **⚡️ Fast**: Memories is extremely fast. Period.\n\n## 🚀 Installation\n\n1. Install the app from the Nextcloud app store\n1. ⚒️ Install `exiftool` (see below).\n1. Run `php ./occ memories:index` to generate metadata indices for existing photos.\n1. Open the 📷 Memories app in Nextcloud and set the directory containing your photos. Photos from this directory will be displayed in the timeline, including any photos in nested subdirectories.\n1. Installing the [preview generator](https://github.com/rullzer/previewgenerator) for pre-generating thumbnails is strongly recommended.\n\n## 🔨 Installing Dependencies\nThe exact steps depend on your Nextcloud platform. If you use Docker for your Nextcloud instance, you can install Exiftool by using a custom docker image.\n- **Ubuntu/Debian**: `sudo apt install libimage-exiftool-perl`\n- **Fedora**: `sudo dnf install perl-Image-ExifTool`\n- **Arch Linux**: `sudo pacman -S perl-image-exiftool`\n- **Alpine**: `apk add --no-cache exiftool`\n- **MacOS**: `brew install exiftool`\n- **FreeBSD**: `sudo pkg install p5-Image-ExifTool`" : "# Спомени\n\n* **📸 Снимки и видео хронология**: Подреждане на снимките по дата на заснемане, обработени от данните Exif.\n* **🤔 Кратък и бърз преглед**: Незабавно преминаване към всяка точка от времевата линия.\n* **🖼️ Папки**: Преглед на вашите и споделените папки с подобна, ефективна времева линия.\n* **🤖 AI Tagging**: Групиране на снимки по хора и обекти с помощта на изкуствен интелект, задвижван от приложението [разпознаване](https://github.com/nextcloud/recognize).\n* **🎦 Слайдшоу**:  Лесен преглед на снимки от хронологията и папките ви.\n* **📱 Поддръжка за мобилни устройства**: Преживейте спомените си на устройства с всякаква форма и размер чрез уеб приложението.\n* **✏️ Редактиране на метаданни**: Редактирайте Exif датите на снимките бързо и лесно.\n* **📦 Архив**: Съхранявайте снимките, които не искате да виждате в хронологията си, в отделна папка.\n* **⚡️ Бързо**: Приложението Спомени е изключително бързо. Период.\n\n## 🚀 Инсталиране\n\n1. Инсталирайте приложението от магазина за приложения Nextcloud\n1. ⚒️ Инсталирайте `exiftool` (вж. по-долу).\n1. Стартирайте `php ./occ memories:index`, за да генерирате индекси на метаданните за съществуващи снимки.\n1. Отворете приложението 📷 Спомени в Nextcloud и задайте директорията, която съдържа вашите снимки. Снимките от тази директория ще се показват на времевата линия, включително всички снимки във вложени поддиректории.\n1. Силно препоръчително е инсталирането на [Preview generator](https://github.com/rullzer/previewgenerator) за предварително генериране на миниатюри.\n\n## 🔨 Зависимости при инсталиране\nТочните стъпки зависят от вашата платформа Nextcloud. Ако използвате Docker за вашият екземпляр на Nextcloud, можете да инсталирате Exiftool, като използвате персонализиран образ на Docker.\n- **Ubuntu/Debian**: `sudo apt install libimage-exiftool-perl`\n- **Fedora**: `sudo dnf install perl-Image-ExifTool`\n- **Arch Linux**: `sudo pacman -S perl-image-exiftool`\n- **Alpine**: `apk add --no-cache exiftool`\n- **MacOS**: `brew install exiftool`\n- **FreeBSD**: `sudo pkg install p5-Image-ExifTool`",
    "Timeline" : "Времева линия",
    "Folders" : "Папки",
    "Favorites" : "Любими",
    "Videos" : "Видеа",
    "People" : "Хора",
    "Archive" : "Архив",
    "On this day" : "На този ден",
    "Tags" : "Етикети",
    "Settings" : "Настройки",
    "Cancel" : "Отказ",
    "Delete" : "Изтриване",
    "Download" : "Изтегляне",
    "Favorite" : "Любими",
    "Unarchive" : "Разархивиране",
    "Edit Date/Time" : "Редактиране на Дата/Час",
    "View in folder" : "Преглед в папката",
    "Remove from person" : "Премахване от лице",
    "You are about to download a large number of files. Are you sure?" : "Предстои ви да изтеглите голям брой файлове. Сигурни ли сте?",
    "You are about to delete a large number of files. Are you sure?" : "Предстои ви да изтриете голям брой файлове. Сигурни ли сте?",
    "You are about to touch a large number of files. Are you sure?" : "Вие сте на път да засегнете голям брой файлове. Сигурни ли сте?",
    "_{n} selected_::_{n} selected_" : ["{n} избрани","{n} избрани"],
    "Timeline Path" : "Път на времева линия/хронология/",
    "Show hidden folders" : "Показване на скрити папки",
    "Update" : "Обновяване",
    "Error updating settings" : "Грешка при актуализиране на настройки",
    "Your Timeline" : "Вашата времева линия",
    "Failed to load some photos" : "Неуспешно зареждане на някои снимки",
    "Update Exif" : "Актуализиране на Exif",
    "Newest" : "Най-новият",
    "Year" : "Година",
    "Month" : "Месец",
    "Day" : "Ден",
    "Time" : "Час",
    "Hour" : "Час",
    "Minute" : "Минута",
    "Oldest" : "Най-старият",
    "Processing … {n}/{m}" : "Обработва се ... {n}/{m}",
    "This feature modifies files in your storage to update Exif data." : "Тази функция модифицира файловете във вашето хранилище, за да актуализира Exif данните.",
    "Exercise caution and make sure you have backups." : "Внимавайте и се уверете, че имате резервни копия.",
    "Loading data … {n}/{m}" : "Зареждане на данни ... {n}/{m}",
    "Remove person" : "Премахване на лице",
    "Are you sure you want to remove {name}" : "Сигурни ли сте, че искате премахване на {name}",
    "Failed to delete {name}." : "Неуспешно изтриване на {name}.",
    "Rename person" : "Преименуване на лице",
    "Name" : "Име",
    "Failed to rename {oldName} to {name}." : "Неуспешно преименуване от {oldName} на {name}.",
    "Merge {name} with person" : "Обединяване на {name} с лице",
    "Are you sure you want to merge {name} with {newName}?" : "Сигурни ли сте, че искате да обедините {name} с {newName}?",
    "Too many failures, aborting" : "Твърде много грешки от общ характер, прекъсване",
    "Error while moving {basename}" : "Грешка при преместване на {basename}",
    "Failed to move {name}." : "Неуспешно преместване на {name}.",
    "Back" : "Назад",
    "Merge with different person" : "Обединяване с различно лице",
    "Failed to delete files." : "Неуспешно изтриване на файлове.",
    "Failed to delete {fileName}." : "Неуспешно изтриване на {fileName}.",
    "General Failure" : "Грешка от общ характер",
    "Error: {msg}" : "Грешка: {msg}",
    "Failed to favorite {fileName}." : "Неуспешно добавяне на {fileName} в любими.",
    "Failed to favorite files." : "Неуспешно добавяне на файлове в любими.",
    "Cannot find this photo anymore!" : "Вече не мога да открия тази снимка!"
},
"nplurals=2; plural=(n != 1);");
