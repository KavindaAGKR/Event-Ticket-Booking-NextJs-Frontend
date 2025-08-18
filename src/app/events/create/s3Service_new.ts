import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

interface UploadResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export const uploadImageToS3 = async (file: File): Promise<UploadResult> => {
  try {
    const region = process.env.NEXT_PUBLIC_AWS_REGION || "ap-southeast-1";
    const accessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;
    const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME;

    if (!accessKeyId || !secretAccessKey || !bucketName) {
      console.error("Missing AWS environment variables:");
      console.error("- NEXT_PUBLIC_AWS_ACCESS_KEY_ID:", !!accessKeyId);
      console.error("- NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY:", !!secretAccessKey);
      console.error("- NEXT_PUBLIC_AWS_S3_BUCKET_NAME:", !!bucketName);
      return {
        success: false,
        error:
          "AWS credentials not configured. Please check your environment variables.",
      };
    }

    const s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: "Invalid file type. Only JPEG, PNG, and WebP are allowed.",
      };
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: "File too large. Maximum size is 5MB.",
      };
    }

    const fileExtension = file.name.split(".").pop();
    const fileName = `events/${uuidv4()}.${fileExtension}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
      ACL: "public-read",
    });

    await s3Client.send(command);

    const imageUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;

    return { success: true, imageUrl };
  } catch (error) {
    console.error("S3 upload error:", error);
    return { success: false, error: "Failed to upload image" };
  }
};
