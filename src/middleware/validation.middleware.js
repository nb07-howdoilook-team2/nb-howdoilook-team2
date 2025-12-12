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
    }
    // 2. 데이터 타입 및 형식 검사
    // 2-1. 점수 필드 검사 (숫자형, 0~10 범위)
    const scoreFields = [
      // score는 FE에서 순수한 숫자로만 옴
      { value: trndyScore, name: "트렌디 점수" },
      { value: individualityScore, name: "개성 점수" },
      { value: practicalityScore, name: "실용성 점수" },
      { value: costEffectivenessScore, name: "가성비 점수" },
    ];
    for (const { value, name } of scoreFields) {
      const score = Number(value);
      if (isNaN(score) || score < 0 || score > 10) {
        throw new ValidationError(
          `${name}는 0부터 10 사이의 유효한 숫자여야 합니다.`
        );
      }
    }
    // 2-2. 문자열 필드 검사
    if (
      typeof oneLineReview !== "string" ||
      oneLineReview.trim().length === 0
    ) {
      throw new ValidationError("한줄 큐레이팅은 빈 문자열일 수 없습니다.");
    }
    if (typeof postNickname !== "string" || postNickname.trim().length === 0) {
      throw new ValidationError("게시자 닉네임은 빈 문자열일 수 없습니다.");
    }
    // 모든 검증 통과
    next();
  } catch (error) {
    // 에러 발생 시 Express의 Global Error Handler로 전달
    next(error);
  }
};

/**
 * 💡 스타일 수정 (PUT /styles/:id) 요청 데이터 유효성 검사
 * - 비밀번호 (password) 필수 검사
 * - 수정 데이터 (password 제외) 최소 하나는 포함되어야 함
 */
export const validateUpdateStyle = (req, res, next) => {
  try {
    const { password } = req.body;
    // 비밀번호를 제외한 나머지 키를 가져옴
    const updateDataKeys = Object.keys(req.body).filter(
      (key) => key !== "password"
    );

    // 1. 비밀번호 필수 검사 (비밀번호는 반드시 문자열이며 공백이 아님)
    if (
      !password ||
      typeof password !== "string" ||
      password.trim().length === 0
    ) {
      throw new ValidationError("비밀번호(password)는 필수 입력 항목입니다.");
    }

    // 2. 최소 하나 이상의 수정 항목 포함 검사
    if (updateDataKeys.length === 0) {
      throw new ValidationError(
        "수정할 내용을 최소 하나 이상 입력해야 합니다."
      );
    }

    // TODO: (선택적) tags나 categories 필드가 있을 경우 상세 구조 검사 추가 가능

    next();
  } catch (error) {
    // 400 Bad Request로 에러 핸들러에 전달
    next(error);
  }
};

/**
 * 💡 스타일 삭제 (DELETE /styles/:id) 요청 데이터 유효성 검사
 * - 비밀번호 (password) 필수 검사
 */
export const validateDeleteStyle = (req, res, next) => {
  try {
    const { password } = req.body;

    // 1. 비밀번호 필수 검사
    if (
      !password ||
      typeof password !== "string" ||
      password.trim().length === 0
    ) {
      throw new ValidationError("비밀번호(password)는 필수 입력 항목입니다.");
    }

    // (선택적) 삭제 시에는 비밀번호 외의 데이터는 받지 않는다는 규칙을 강제할 수도 있습니다.

    next();
  } catch (error) {
    next(error);
  }
};
