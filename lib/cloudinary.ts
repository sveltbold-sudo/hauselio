import { v2 as cloudinary } from "cloudinary";

let _configured = false;

function ensureConfigured() {
  if (!_configured && process.env.CLOUDINARY_CLOUD_NAME) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    _configured = true;
  }
}

export function getCloudinary() {
  ensureConfigured();
  return cloudinary;
}

export default cloudinary;
