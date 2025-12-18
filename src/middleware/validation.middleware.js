// src/middleware/validation.middleware.js
import { ValidationError } from "../utils/CustomError.js";

const ALLOWED_ITEM_TYPES = [
  "top", // 상의
  "bottom", // 하의
  "outer", // 아우터
  "dress", // 원피스
  "shoes", // 신발
  "bag", // 가방
  "accessory", // 패션잡화
];

// 스타일 구성 요소의 유효성 검사를 위한 헬퍼 함수
const validateCategoryItem = (item, typeName) => {
  if (
    !item.name || // 의상명
    !item.brand || // 브랜드명
    item.price === undefined || // 가격 필수
    typeof item.price !== "number" // 가격 타입
  ) {
    throw new ValidationError(
      `스타일 구성 요소 '${typeName}'의 정보가 부족하거나 유효하지 않습니다. (name, brand, price 필수)`
    );
  }
  if (item.price < 0) {
    throw new ValidationError(
      `스타일 구성 요소 '${typeName}'의 가격은 0 이상이어야 합니다.`
    );
  }
};

export const validateRegisterStyle = (req, res, next) => {
  const { title, nickname, content, password, imageUrls, tags, categories } =
    req.body;

  try {
    // 1. 필수 항목 검증 (content 추가)
    if (
      !title ||
      !nickname ||
      !content ||
      !password ||
      !imageUrls ||
      imageUrls.length === 0 ||
      !categories
    ) {
      throw new ValidationError(
        "제목, 닉네임, 내용, 비밀번호, 사진(최소1장), 스타일 구성은 필수 입력 항목입니다."
      );
    }

    // 2. 태그 개수 검증
    if (tags && tags.length > 3) {
      throw new ValidationError("태그는 최대 3개까지만 등록할 수 있습니다.");
    }

    // 3. Categories (스타일 구성) 구조 검증
    // 최소 하나 이상의 ALLOWED_ITEM_TYPES를 포함합니다.
    if (typeof categories !== "object" || Array.isArray(categories)) {
      throw new ValidationError("categories는 객체 형태로 전달되어야 합니다.");
    }

    // categories 객체의 모든 키(top, bottom 등)를 순회하며 검증
    const categoryKeys = Object.keys(categories);
    let hasValidCategory = false;

    for (const key of categoryKeys) {
      if (ALLOWED_ITEM_TYPES.includes(key)) {
        hasValidCategory = true;
        const item = categories[key];

        // 해당 아이템이 존재하면 (예: top: { ... }) 내부 필드 검증 수행
        if (item) {
          validateCategoryItem(item, key);
        }
      } else {
        // 정의되지 않은 카테고리 타입이 들어왔을 경우
        throw new ValidationError(
          `허용되지 않은 스타일 구성 타입입니다: ${key}`
        );
      }
    }

    // 최소한 하나 이상의 스타일 구성 요소가 전달되었는지 확인 (선택적 검증)
    if (!hasValidCategory) {
      throw new ValidationError(
        "스타일 구성(categories)에는 최소한 하나의 유효한 아이템 타입이 포함되어야 합니다."
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

// /src/middleware/validation.middleware.js 검증
/**
 * 큐레이팅 등록 (POST /styles/:styleId/curations) 요청 데이터 유효성 검사
 * * - 트렌디, 개성, 실용성, 가성비 점수 (숫자, 0~10)
 * - 한줄 큐레이팅 (문자열)
 * - 닉네임 (문자열)
 * - 비밀번호 (문자열, 보안을 위해 최소 길이 요구)
 */
export const validateRegisterCuration = (req, res, next) => {
  try {
    // 요청 본문 (Body)에서 데이터 추출
    const {
      trendy,
      personality,
      practicality,
      costEffectiveness,
      content,
      nickname,
      password,
    } = req.body;
    // 1. 필수 필드 존재 여부 검사
    const requiredFields = {
      nickname: "닉네임",
      content: "한줄 큐레이팅",
      password: "비밀번호",
      trendy: "트렌디 점수",
      personality: "개성 점수",
      practicality: "실용성 점수",
      costEffectiveness: "가성비 점수",
    };

    for (const [field, name] of Object.entries(requiredFields)) {
      if (
        req.body[field] === undefined ||
        req.body[field] === null ||
        req.body[field] === ""
      ) {
        throw new ValidationError(`${name}을(를) 입력해 주세요.`); // 400 Bad Request
      }
      // 2. 데이터 타입 및 형식 검사
      // 2-1. 점수 필드 검사 (숫자형, 0~10 범위)
      const scoreFields = [
        // score는 FE에서 순수한 숫자로만 옴
        { value: trendy, name: "트렌디 점수" },
        { value: personality, name: "개성 점수" },
        { value: practicality, name: "실용성 점수" },
        { value: costEffectiveness, name: "가성비 점수" },
      ];
      for (const { value, name } of scoreFields) {
        const score = Number(value);
        if (isNaN(score) || score < 0 || score > 10) {
          throw new ValidationError(
            `${name}는 0부터 10 사이의 유효한 숫자여야 합니다.`
          );
        }
      }
    }

    // 2-2. 문자열 필드 검사
    if (typeof content !== "string" || content.trim().length === 0) {
      throw new ValidationError("한줄 큐레이팅은 빈 문자열일 수 없습니다.");
    }
    if (typeof nickname !== "string" || nickname.trim().length === 0) {
      throw new ValidationError("게시자 닉네임은 빈 문자열일 수 없습니다.");
    }
    // 모든 검증 통과
    next();
  } catch (error) {
    // 에러 발생 시 Express의 Global Error Handler로 전달
    next(error);
  }
};

export const validateGetStylesList = (req, res, next) => {
  const { page, limit, sort, search } = req.query;
  const maxLimit = 50; //한페이지 최대 허용 개수
  const allowedSort = ["latest", "viewCount", "curationCount"]; //허용 정렬기준
  const maxSearchLength = 50; //검색어 최대 길이

  // 페이지 검사: 숫자이면서 1 이상의 수인지 검사
  if (page && (!/^\d+$/.test(page) || Number(page) <= 0)) {
    throw new ValidationError("page는 1 이상의 숫자여야 합니다.");
  }

  // limit이 숫자이면서 0보다 큰수인지 검사
  if (limit && (!/^\d+$/.test(limit) || Number(limit) <= 0)) {
    throw new ValidationError("limit는 1 이상의 숫자여야 합니다.");
  }

  // 한페이지 최대 허용 개수 검사
  if (limit && Number(limit) > maxLimit) {
    throw new ValidationError(`limit은 최대 ${maxLimit}까지 허용됩니다.`);
  }

  // 정렬기준 검사
  if (sort && !allowedSort.includes(sort)) {
    throw new ValidationError(
      `sort는 ${allowedSort.join(", ")}중 하나여야 합니다.`
    );
  }

  // 검색어 검사
  if (search !== undefined) {
    // 검색어 타입 검사
    if (typeof search !== "string") {
      throw new ValidationError("search는 문자열이어야 합니다.");
    }

    // 검색어 최대 길이 검사
    if (search.length > maxSearchLength) {
      throw new ValidationError(
        `search는 최대 ${maxSearchLength}자까지 허용됩니다.`
      );
    }
  }
  next();
};

export const validateFindStyle = (req, res, next) => {
  const { styleId } = req.params;

  // styleId가 숫자인지 검사
  if (!/^\d+$/.test(styleId)) {
    throw new ValidationError("styleId는 숫자여야 합니다.");
  }
  next();
};

// 스타일 수정 요청 본문 유효성 검사
export const validateUpdateStyle = (req, res, next) => {
  const { title, nickname, content, password, imageUrls, tags, categories } =
    req.body;

  try {
    // 1. 비밀번호 검증
    if (!password) {
      throw new ValidationError("비밀번호는 필수 입력 항목입니다.");
    }

    // 2. 최소한 하나의 수정 데이터가 있는지 검사
    const updateFields = {
      title,
      nickname,
      content,
      imageUrls,
      tags,
      categories,
    };
    const hasUpdateData = Object.values(updateFields).some(
      (value) => value !== undefined
    );

    if (!hasUpdateData) {
      throw new ValidationError("수정할 내용을 하나 이상 입력해야 합니다.");
    }

    // 3. 태그 개수 검증
    if (tags && tags.length > 3) {
      throw new ValidationError("태그는 최대 3개까지만 등록할 수 있습니다.");
    }

    // 4. Categories (스타일 구성) 구조 검증
    if (categories !== undefined) {
      if (typeof categories !== "object" || Array.isArray(categories)) {
        throw new ValidationError(
          "categories는 객체 형태로 전달되어야 합니다."
        );
      }

      const categoryKeys = Object.keys(categories);
      if (categoryKeys.length === 0) {
        throw new ValidationError("categories에 유효한 아이템이 없습니다.");
      }

      for (const key of categoryKeys) {
        if (ALLOWED_ITEM_TYPES.includes(key)) {
          const item = categories[key];
          if (item) {
            validateCategoryItem(item, key);
          }
        } else {
          throw new ValidationError(
            `허용되지 않은 스타일 구성 타입입니다: ${key}`
          );
        }
      }
    }

    // 5. imageUrls 검증
    if (
      imageUrls !== undefined &&
      (imageUrls.length === 0 || !Array.isArray(imageUrls))
    ) {
      throw new ValidationError(
        "imageUrls는 빈 배열일 수 없으며 배열 형태여야 합니다."
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

// 스타일 삭제 요청 본문 유효성 검사
export const validateDeleteStyle = (req, res, next) => {
  const { password } = req.body;
  try {
    if (!password) {
      throw new ValidationError("비밀번호는 필수 입력 항목입니다.");
    }
    if (typeof password !== "string" || password.trim().length === 0) {
      throw new ValidationError("비밀번호는 유효한 문자열이어야 합니다.");
    }
    next();
  } catch (error) {
    next(error);
  }
};
