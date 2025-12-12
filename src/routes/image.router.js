// src/routes/image.router.js
import express from "express";
import upload from "../middleware/upload.middleware.js"; // Multer 미들웨어
import { uploadImageController } from "../controllers/image.controller.js"; // 컨트롤러

const router = express.Router();

router.post(
  "/",
  upload.single("image"), // 파일 이름 필드는 'image'
  uploadImageController
);

export default router;
