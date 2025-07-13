import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import StorageService, {
  FolderType,
  StorageDataResponse,
} from "../../application/services/storageService";
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
  async saveFile(
    file: ArrayBufferLike | string,
    folder: FolderType = "recipe"
  ): Promise<StorageDataResponse> {
    const fileKey = `${folder}/${uuidv4()}.${
      folder === "recipe" ? "pdf" : "jpg"
    }`;
    const contentType = folder === "recipe" ? "application/pdf" : "image/jpeg";

    // Manejar diferentes tipos de entrada incluyendo base64
    let fileBuffer: Buffer;

    if (typeof file === "string") {
      // Es un string - podría ser base64
      console.log("🔍 Detectado string, verificando si es base64...");

      // Verificar si es base64 válido
      if (this.isBase64(file)) {
        console.log("✅ String es base64 válido");
        // Remover el prefijo data:image/png;base64, si existe
        const base64Data = file.replace(/^data:image\/[a-z]+;base64,/, "");
        fileBuffer = Buffer.from(base64Data, "base64");
        console.log("🔄 Convertido de base64 a Buffer");
        console.log(
          "📏 Tamaño después de conversión:",
          fileBuffer.length,
          "bytes"
        );
      } else {
        // Si no es base64, asumir que es texto plano
        console.log("📝 String no es base64, tratando como texto");
        fileBuffer = Buffer.from(file, "utf8");
      }
    } else if (Buffer.isBuffer(file)) {
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

    // Validación adicional para archivos de imagen
    if (folder !== "recipe" && typeof file === "string") {
      console.log("🖼️ Validando imagen...");
      if (!this.validateImageBuffer(fileBuffer)) {
        console.warn(
          "⚠️ Advertencia: El buffer podría no ser una imagen válida"
        );
      }
    }

    console.log("📤 Subiendo a S3 con ContentType:", contentType);
    console.log("📏 Tamaño final del buffer:", fileBuffer.length, "bytes");

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

    console.log("🔗 URL firmada generada:", signedUrl);

    return {
      file_location: fileKey,
      signed_url: signedUrl,
    };
  }

  /**
   * Verifica si un string es base64 válido
   */
  private isBase64(str: string): boolean {
    try {
      // Remover prefijo data: si existe
      const base64String = str.replace(/^data:image\/[a-z]+;base64,/, "");

      // Verificar que solo contenga caracteres base64 válidos
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      if (!base64Regex.test(base64String)) {
        return false;
      }

      // Intentar decodificar
      const decoded = Buffer.from(base64String, "base64");

      // Verificar que la decodificación produzca al menos algunos bytes
      return decoded.length > 0;
    } catch (error: any) {
      console.log("❌ Error validando base64:", error);
      return false;
    }
  }

  /**
   * Validación básica para verificar si un buffer podría ser una imagen
   */
  private validateImageBuffer(buffer: Buffer): boolean {
    if (buffer.length < 8) {
      return false;
    }

    // Verificar firmas de archivos de imagen comunes
    const signatures = {
      png: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
      jpg: [0xff, 0xd8, 0xff],
      jpeg: [0xff, 0xd8, 0xff],
      gif: [0x47, 0x49, 0x46, 0x38],
      bmp: [0x42, 0x4d],
      webp: [0x52, 0x49, 0x46, 0x46], // seguido de WEBP en el offset 8
    };

    for (const [format, signature] of Object.entries(signatures)) {
      if (buffer.subarray(0, signature.length).equals(Buffer.from(signature))) {
        console.log(`✅ Detectado formato de imagen: ${format.toUpperCase()}`);
        return true;
      }
    }

    console.log("⚠️ No se detectó firma de imagen conocida");
    return false;
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
