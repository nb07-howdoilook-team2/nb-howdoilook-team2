// src/controllers/image.controller.js
import { CustomError } from "../utils/CustomError.js";

export const uploadImageController = (req, res, next) => {
  try {
    const file = req.file;

    if (!file) {
      throw new CustomError(400, "업로드할 이미지를 찾을 수 없습니다.");
    }

    const imageUrl = file.path;

    return res.status(200).json({
      imageUrl,
    });
  } catch (error) {
    next(error);
  }
};
