import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// __dirname 구성 (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 프로젝트 루트의 'uploads' 폴더 경로
const uploadDir = path.resolve(__dirname, "../../uploads");

// Multer Disk Storage 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      // uploads 폴더 없으면 생성
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `${Date.now()}${ext}`;
    cb(null, fileName);
  },
});

// Multer 미들웨어
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
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
