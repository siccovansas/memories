import Dexie from 'dexie';
import { getBuilder } from '@nextcloud/browser-storage';
import { localSyncIter } from '.';

import type { IDay, IPhoto } from '../types';
import { ISystemImage, LocalFolderConfig } from './types';

class MemoriesDatabase extends Dexie {
  local!: Dexie.Table<ILocalFile, number>;

  constructor() {
    super('MemoriesDatabase');
    this.version(1).stores({
      local: '++id, fileid, auid, dayid, flag, [bucket_id+dayid]',
    });
  }
}

/** Table for a locally stored file. */
interface ILocalFile extends ISystemImage {
  id?: number;
  dayid: number;
  flag: number;
}

/** Open database */
const db = new MemoriesDatabase();

/** Preferences database */
const storage = getBuilder('memories_sync').clearOnLogout(false).persist().build();
const STORAGE_LOCAL_FOLDERS = 'local_folders';

// Cache for preferences
let _enabledBucketIds: number[] | null = null;

/**
 * Trigger the synchronization process at the local database.
 */
export async function go() {
  // Clear local database
  // await db.local.clear();

  for await (const sysImg of localSyncIter(0)) {
    // Check if file already exists with same mtime
    if (await db.local.where({ fileid: sysImg.fileid, mtime: sysImg.mtime }).first()) continue;

    // Insert new file
    await db.transaction('rw', db.local, async () => {
      await db.local.where({ fileid: sysImg.fileid }).delete();
      await db.local.add({
        ...sysImg,
        dayid: Math.floor(sysImg.datetaken / 86400),
        flag: 0,
      });
    });
  }
}

/**
 * Get the local days list.
 * @param dayid Day ID
 */
export async function getDaysLocal(): Promise<IDay[]> {
  if (!_enabledBucketIds?.length) return [];

  const days: IDay[] = [];

  // Get all day IDs
  const dayIds = await db.local.orderBy('dayid').uniqueKeys();

  // For each unique username, call usePostCountSince():
  await Promise.all(
    dayIds.map(async (dayid: number) => {
      days.push({
        dayid: dayid,
        count: await db.local
          .where(['bucket_id', 'dayid'])
          .anyOf(getEnabledBucketIds().map((bucket_id) => [bucket_id, dayid]))
          .count(),
      });
    })
  );

  return days.filter((d) => d.count > 0);
}

/**
 * Get the local photos for a given day.
 * @param dayid Day ID
 */
export async function getDayLocal(dayid: number): Promise<IPhoto[]> {
  if (!_enabledBucketIds?.length) return [];

  return (
    await db.local
      .where(['bucket_id', 'dayid'])
      .anyOf(getEnabledBucketIds().map((bucket_id) => [bucket_id, dayid]))
      .toArray()
  ).map((file) => ({
    ...file,
    bucket_id: undefined,
    bucket_name: undefined,
    flag: undefined as unknown as number,
  }));
}

/** Get the enabled bucket ids list */
export function getEnabledBucketIds(): number[] {
  if (_enabledBucketIds) return _enabledBucketIds;

  try {
    _enabledBucketIds = JSON.parse(storage.getItem(STORAGE_LOCAL_FOLDERS) || '[]') as number[];
  } catch (e) {
    _enabledBucketIds = [];
  }

  return _enabledBucketIds;
}

/** Get the active bucket list. */
export async function getLocalFolders(): Promise<LocalFolderConfig[]> {
  const bucketIds = await db.local.orderBy('bucket_id').uniqueKeys();
  const enabledIds = getEnabledBucketIds();

  const buckets = await Promise.all(
    bucketIds.map(async (bucket_id: number) => {
      const file = await db.local.where({ bucket_id }).first();
      if (!file) return null;

      return {
        id: file.bucket_id,
        name: file.bucket_name,
        enabled: enabledIds.includes(file.bucket_id),
      };
    })
  );

  return buckets.filter((b) => b !== null) as LocalFolderConfig[];
}

export async function setLocalFolders(config: LocalFolderConfig[]) {
  _enabledBucketIds = config.filter((f) => f.enabled).map((f) => f.id);
  storage.setItem(STORAGE_LOCAL_FOLDERS, JSON.stringify(_enabledBucketIds));
}
