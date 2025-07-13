export interface StorageDataResponse{
    file_location: string,
    signed_url: string
}

export type FolderType = 'recipe' | 'qr';

export default interface StorageService {
  saveFile(file: ArrayBufferLike | string, folder: FolderType): Promise<StorageDataResponse>;
  getFile(file_location: string): Promise<StorageDataResponse>;
}