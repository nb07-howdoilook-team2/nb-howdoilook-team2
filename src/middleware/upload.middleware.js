// src/middleware/upload.middleware.js

import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// 프로젝트 루트의 'uploads' 폴더 경로 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, "../../uploads");

// Multer Disk Storage 설정
const storage = multer.diskStorage({
  // 파일을 저장할 경로 지정
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  // 저장될 파일 이름 설정: 타임스탬프 + 원본 확장자 사용
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = Date.now() + ext;
    cb(null, fileName);
  },
});

// Multer 미들웨어 인스턴스
const upload = multer({
  storage: storage,
  // 파일 크기 제한: 5MB
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const isValid =
      allowedTypes.test(file.mimetype) &&
      allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (isValid) {
      return cb(null, true);
    }
    cb(
      new Error("지원하지 않는 이미지 형식입니다. (jpeg, jpg, png, gif만 허용)")
    );
  },
});

export default upload;
