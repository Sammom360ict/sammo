import { S3Client } from '@aws-sdk/client-s3';
import config from '../../../config/config';

const allowed_file_types = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

abstract class CommonAbstractStorage {
  protected allowed_file_types: string[];
  protected error_message: string;

  constructor() {
    this.allowed_file_types = allowed_file_types;
    this.error_message = 'Only .jpg, .jpeg, .webp or .png format allowed!';
  }

  // aws s3 connect
  protected s3Client: S3Client = new S3Client({
    region: 'ap-south-1',
    credentials: {
      accessKeyId: config.AWS_S3_ACCESS_KEY,
      secretAccessKey: config.AWS_S3_SECRET_KEY,
    },
  });
}

export default CommonAbstractStorage;
