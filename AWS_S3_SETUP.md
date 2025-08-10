# AWS S3 Setup for Image Upload

This guide will help you set up AWS S3 for image uploads in the EventTix application.

## Prerequisites

1. An AWS account
2. Access to AWS IAM and S3 services

## Step 1: Create an S3 Bucket

1. Go to the AWS S3 Console
2. Click "Create bucket"
3. Choose a unique bucket name (e.g., `eventtix-images-your-name`)
4. Select your preferred region (e.g., `us-east-1`)
5. **Important**: Under "Block Public Access settings for this bucket", uncheck "Block all public access" and acknowledge the warning (needed for public image access)
6. Click "Create bucket"

## Step 2: Configure Bucket Policy

1. Select your created bucket
2. Go to the "Permissions" tab
3. Scroll down to "Bucket policy" and click "Edit"
4. Add the following policy (replace `your-bucket-name` with your actual bucket name):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::your-bucket-name/*"
        }
    ]
}
```

## Step 3: Create IAM User for API Access

1. Go to the AWS IAM Console
2. Click "Users" → "Create user"
3. Enter username (e.g., `eventtix-s3-user`)
4. Select "Programmatic access"
5. Click "Next: Permissions"
6. Click "Attach existing policies directly"
7. Search and select `AmazonS3FullAccess` (or create a custom policy for better security)
8. Complete the user creation
9. **Important**: Save the Access Key ID and Secret Access Key

## Step 4: Environment Variables

1. Copy `.env.local.example` to `.env.local`
2. Update the values:

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id-here
AWS_SECRET_ACCESS_KEY=your-secret-access-key-here
AWS_S3_BUCKET_NAME=your-bucket-name-here
```

## Step 5: Test the Upload

1. Start your development server: `npm run dev`
2. Go to the "Create Event" page
3. Try uploading an image using the "Upload Image" button
4. The image should be uploaded to S3 and display in the preview

## Security Best Practices

For production, consider:

1. **Create a custom IAM policy** with minimal permissions:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl"
            ],
            "Resource": "arn:aws:s3:::your-bucket-name/events/*"
        }
    ]
}
```

2. **Enable CORS** on your S3 bucket if needed
3. **Use CloudFront** for better performance and security
4. **Implement file size and type validation** (already included in the API route)

## Troubleshooting

- **Upload fails**: Check your AWS credentials and bucket permissions
- **Images don't display**: Verify the bucket policy allows public read access
- **CORS errors**: Configure CORS settings in your S3 bucket
- **File too large**: Adjust the MAX_FILE_SIZE in `/api/upload/route.ts`

## File Structure

```
/api/upload/route.ts          # Upload API endpoint
/hooks/useImageUpload.ts      # Upload hook
.env.local                    # Environment variables (create from .env.local.example)
```
