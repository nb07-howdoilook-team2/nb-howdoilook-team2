// src/middleware/validation.middleware.js
import { ValidationError } from "../utils/CustomError.js";

const ALLOWED_ITEM_TYOES = [
  "상의",
  "하의",
  "아우터",
  "원피스",
  "신발",
  "가방",
  "패션잡화",
];

export const validateRegisterStyle = (req, res, next) => {
  const { title, nickname, password, photos, tags, styleItems } = req.body;

  try {
    if (
      !title ||
      !nickname ||
      !password ||
      !photos ||
      photos.length === 0 ||
      !styleItems
    ) {
      throw new ValidationError(
        "제목, 닉네임, 비밀번호, 사진(최소1장), 스타일 구성은 필수 입력 항목입니다."
      );
    }

    if (tags && tags.length > 3) {
      throw new ValidationError("태그는 최대 3개까지만 등록할 수 있습니다.");
    }

    for (const item of styleItems) {
      if (
        !item.type ||
        !ALLOWED_ITEM_TYOES.includes(item.type) ||
        !item.clothing_name ||
        item.price === undefined ||
        typeof item.price !== "number"
      ) {
        throw new ValidationError(
          `유효하지 않은 스타일 구성 요소입니다. (type: ${item.type}, clothing_name: ${item.clothing_name}, price: ${item.price})`
        );
      }
      if (item.price < 0) {
        throw new ValidationError("가격은 0 이상이어야 합니다.");
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
