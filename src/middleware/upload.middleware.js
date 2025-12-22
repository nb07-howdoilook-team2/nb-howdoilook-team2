// src/middleware/upload.middleware.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "howdoilook", // Cloudinary 안 폴더명
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
});

export default upload;
