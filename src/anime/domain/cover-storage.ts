export const COVER_STORAGE = Symbol('COVER_STORAGE');

export interface CoverFile {
  animeId: string;
  filename: string;
  contentType: string;
  body: Buffer;
}

export interface CoverStorage {
  upload(file: CoverFile): Promise<string>;
}
