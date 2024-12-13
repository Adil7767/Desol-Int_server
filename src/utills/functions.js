import { v4 as uuidv4 } from 'uuid';
import s3Client from '../config/aws.js';
export async function uploadFileToS3(file) {
    const key = `cars/${uuidv4()}-${file.originalname}`;
    await s3Client.upload({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype
    }).promise();
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}