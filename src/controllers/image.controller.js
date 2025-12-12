// src/controllers/image.controller.js

import { CustomError } from "../utils/CustomError.js";

/**
 * 이미지 업로드 및 URL 반환 컨트롤러 (POST /images)
 * @description Multer를 통해 저장된 파일 정보를 기반으로 접근 URL을 생성하여 반환합니다.
 */
export const uploadImageController = (req, res, next) => {
  try {
    const file = req.file;

    // Multer가 파일을 처리했는지 확인
    if (!file) {
      throw new CustomError(400, "업로드할 이미지를 찾을 수 없습니다.");
    }

    // 정적 파일 경로(/uploads)를 포함한 최종 접근 URL 생성
    const imageUrl = `/uploads/${file.filename}`;

    return res.status(200).json({
      imageUrl: imageUrl,
    });
  } catch (error) {
    next(error);
  }
};
