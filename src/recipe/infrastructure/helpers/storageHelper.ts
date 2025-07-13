import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import StorageService, { FolderType, StorageDataResponse } from "../../application/services/storageService";
import dotenv from "dotenv";

dotenv.config();

const {
  BUCKET_SECRET,
  BUCKET_ACCESS_KEY,
  BUCKET_REGION,
  BUCKET_NAME,
  BUCKET_ENDPOINT,
} = process.env;

const s3Client = new S3Client({
  region: BUCKET_REGION!,
  endpoint: BUCKET_ENDPOINT!,
  credentials: {
    accessKeyId: BUCKET_ACCESS_KEY!,
    secretAccessKey: BUCKET_SECRET!,
  },
  forcePathStyle: true, // Necesario para MinIO
});

export default class StorageHelper implements StorageService {
async saveFile(file: ArrayBufferLike, folder: FolderType = "recipe"): Promise<StorageDataResponse> {
    const fileKey = `${folder}/${uuidv4()}.${folder === "recipe" ? "pdf" : "jpg"}`;

    // Ensure file is a Buffer for S3
    let fileBuffer: Buffer;
    if (file instanceof Buffer) {
      fileBuffer = file;
    } else if (file instanceof ArrayBuffer) {
      fileBuffer = Buffer.from(new Uint8Array(file));
    } else {
      // Fallback for other ArrayBufferLike types
      fileBuffer = Buffer.from(file as ArrayBufferLike);
    }

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME!,
        Key: fileKey,
        Body: fileBuffer,
        ContentType: folder === "recipe" ? "application/pdf" : "image/jpeg",
      })
    );

    const signedUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: BUCKET_NAME!,
        Key: fileKey,
      }),
      { expiresIn: 60 * 60 } // 1 hora
    );

    return {
      file_location: fileKey,
      signed_url: signedUrl,
    };
  }

  async getFile(file_location: string): Promise<StorageDataResponse> {
    const signedUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: BUCKET_NAME!,
        Key: file_location,
      }),
      { expiresIn: 60 * 60 }
    );

    return {
      file_location,
      signed_url: signedUrl,
    };
  }
}
