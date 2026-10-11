import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function optimizeCloudinaryImage(url: string, width = 1920) {
  return url.replace(
    "/image/upload/",
    `/image/upload/f_auto,q_auto:best,w_${width},c_limit/`,
  );
}

export { cloudinary };
