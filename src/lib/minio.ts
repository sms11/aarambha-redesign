import * as Minio from 'minio';

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});

const BUCKET_NAME = process.env.MINIO_BUCKET || 'aarambha-uploads';

export async function ensureBucket() {
  const exists = await minioClient.bucketExists(BUCKET_NAME);
  if (!exists) {
    await minioClient.makeBucket(BUCKET_NAME);
    // Set public read policy so uploaded images are accessible via URL
    const policy = JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
        },
      ],
    });
    await minioClient.setBucketPolicy(BUCKET_NAME, policy);
  }
}

export async function uploadFile(
  fileName: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  await ensureBucket();
  await minioClient.putObject(BUCKET_NAME, fileName, buffer, buffer.length, {
    'Content-Type': contentType,
  });
  // Use MINIO_PUBLIC_URL for browser-accessible URLs (production),
  // fall back to constructing from endpoint/port (local dev)
  if (process.env.MINIO_PUBLIC_URL) {
    return `${process.env.MINIO_PUBLIC_URL}/${BUCKET_NAME}/${fileName}`;
  }
  const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
  const port = process.env.MINIO_PORT || '9000';
  const endpoint = process.env.MINIO_ENDPOINT || 'localhost';
  return `${protocol}://${endpoint}:${port}/${BUCKET_NAME}/${fileName}`;
}

export { minioClient, BUCKET_NAME };
