import { v2 as cloudinary } from 'cloudinary';

import environments from '../config/environments.js'

cloudinary.config({
  cloud_name: environments.cloudinary.cloud_name,
  api_key: environments.cloudinary.api_key,
  api_secret: environments.cloudinary.api_secret,
  secure: true,
});

export const uploadImage = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'autoservicio_api',
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error);
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
    uploadStream.end(buffer);
  });
}