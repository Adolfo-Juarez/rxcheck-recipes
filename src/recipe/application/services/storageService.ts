export interface StorageDataResponse{
    file_location: string,
    signed_url: string
}

export default interface StorageService {
  saveFile(file: ArrayBufferLike): Promise<StorageDataResponse>;
  getPdf(file_location: string): Promise<StorageDataResponse>;
}