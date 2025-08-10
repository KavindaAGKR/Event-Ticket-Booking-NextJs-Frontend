import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

// S3 Client configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface UploadResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export class ImageUploadService {
  static async uploadImage(file: File): Promise<UploadResult> {
    try {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg",
      ];
      if (!allowedTypes.includes(file.type)) {
        return {
          success: false,
          error: "Invalid file type. Only JPEG, PNG, and WebP are allowed.",
        };
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return {
          success: false,
          error: "File too large. Maximum size is 5MB.",
        };
      }

      // Generate unique filename
      const fileExtension = file.name.split(".").pop();
      const fileName = `events/${uuidv4()}.${fileExtension}`;

      // Convert file to buffer
      const buffer = Buffer.from(await file.arrayBuffer());

      // Upload to S3
      const uploadCommand = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
        ACL: "public-read",
      });

      await s3Client.send(uploadCommand);

      // Generate the public URL
      const imageUrl = `https://${BUCKET_NAME}.s3.${
        process.env.AWS_REGION || "ap-southeast-1"
      }.amazonaws.com/${fileName}`;

      return {
        success: true,
        imageUrl,
      };
    } catch (error) {
      console.error("S3 Upload Error:", error);
      return {
        success: false,
        error: "Failed to upload image to S3",
      };
    }
  }
}
