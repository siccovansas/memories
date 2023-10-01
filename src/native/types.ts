/** Local file type */
export type ISystemImage = {
  fileid: number;
  basename: string;
  mimetype: string;
  h: number;
  w: number;
  size: number;
  etag: string;
  mtime: number;
  epoch: number;
  auid: number;
  bucket_id: number;
  bucket_name: string;
  datetaken: number;
};

/** Setting of whether a local folder is enabled */
export type LocalFolderConfig = {
  id: number;
  name: string;
  enabled: boolean;
};
