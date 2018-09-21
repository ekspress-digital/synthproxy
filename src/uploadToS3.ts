import * as path from 'path';

import { Client } from 'minio';

import { filesDir } from './synth';

const S3_BUCKET = String(process.env.S3_BUCKET);
const S3_ENDPOINT = String(process.env.S3_END_POINT);
const S3_PORT = parseInt(process.env.S3_PORT as any, 10);
const S3_USE_SSL = S3_PORT === 443;
const S3_ACCESS_KEY = String(process.env.S3_ACCESS_KEY);
const S3_SECRET_KEY = String(process.env.S3_SECRET_KEY);

let client: Client;

export default async (fileName: any) => {
  if (!client) {
    client = new Client({
      endPoint: S3_ENDPOINT,
      port: S3_PORT,
      useSSL: S3_USE_SSL,
      accessKey: S3_ACCESS_KEY,
      secretKey: S3_SECRET_KEY,
    });
  }

  const fileToUpload = path.join(filesDir, fileName);
  const metaData = {
    'Content-Type': 'audio/mp3',
  };

  await new Promise((resolve, reject) => {
    client.fPutObject(
      S3_BUCKET,
      fileName,
      fileToUpload,
      metaData,
      (err: any) => {
        if (!err) {
          resolve();
        }
        console.log('upload error', err);
        reject(err);
      },
    );
  });

  return new Promise((resolve, reject) => {
    client.presignedUrl('GET', S3_BUCKET, fileName, (err, presignedUrl) => {
      if (err) reject(err);
      resolve(presignedUrl);
    });
  });
};