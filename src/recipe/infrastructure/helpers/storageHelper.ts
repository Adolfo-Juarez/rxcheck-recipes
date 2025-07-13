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
    const contentType = folder === "recipe" ? "application/pdf" : "image/jpeg";

    // Ensure file is a Buffer for S3 with better type handling
    let fileBuffer: Buffer;
    
    console.log("📁 Guardando archivo:", fileKey);
    console.log("📊 Tipo de archivo recibido:", file.constructor.name);
    console.log("📏 Tamaño del archivo:", file.byteLength || (file as any).length, "bytes");
    
    if (Buffer.isBuffer(file)) {
      // Ya es un Buffer de Node.js
      fileBuffer = file;
      console.log("✅ Archivo ya es Buffer de Node.js");
    } else if (file instanceof ArrayBuffer) {
      // Es un ArrayBuffer, convertir a Buffer
      fileBuffer = Buffer.from(new Uint8Array(file));
      console.log("🔄 Convertido de ArrayBuffer a Buffer");
    } else if (file instanceof Uint8Array) {
      // Es un Uint8Array, convertir a Buffer
      fileBuffer = Buffer.from(file);
      console.log("🔄 Convertido de Uint8Array a Buffer");
    } else {
      // Fallback para otros tipos ArrayBufferLike
      fileBuffer = Buffer.from(file as ArrayBufferLike);
      console.log("🔄 Convertido usando fallback a Buffer");
    }

    console.log("📤 Subiendo a S3 con ContentType:", contentType);

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME!,
        Key: fileKey,
        Body: fileBuffer,
        ContentType: contentType,
      })
    );

    console.log("✅ Archivo subido exitosamente a S3");

    const signedUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: BUCKET_NAME!,
        Key: fileKey,
      }),
      { expiresIn: 60 * 60 } // 1 hora
    );
    console.log(fileBuffer);

    console.log("🔗 URL firmada generada:", signedUrl);

    return {
      file_location: fileKey,
      signed_url: signedUrl,
    };
  }

  async getFile(file_location: string): Promise<StorageDataResponse> {
    console.log("📥 Obteniendo archivo:", file_location);
    
    const signedUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: BUCKET_NAME!,
        Key: file_location,
      }),
      { expiresIn: 60 * 60 }
    );

    console.log("🔗 URL firmada generada para descarga:", signedUrl);

    return {
      file_location,
      signed_url: signedUrl,
    };
  }
}