// src/middleware/validation.middleware.js
import { ValidationError } from "../utils/CustomError.js";

const ALLOWED_ITEM_TYOES = ["상의", "하의", "아우터", "원피스", "신발", "가방", "패션잡화"];

export const validateRegisterStyle = (req, res, next) => {
   const { title, nickname, password, photos, tags, styleItems } = req.body;

   try {
      if (!title || !nickname || !password || !photos || photos.length === 0 || !styleItems) {
         throw new ValidationError("제목, 닉네임, 비밀번호, 사진(최소1장), 스타일 구성은 필수 입력 항목입니다.");
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
         trndyScore,
         individualityScore,
         practicalityScore,
         costEffectivenessScore,
         oneLineReview,
         postNickname,
         password,
      } = req.body;
      // 1. 필수 필드 존재 여부 검사
      const requiredFields = {
         trndyScore: "트렌디 점수",
         individualityScore: "개성 점수",
         practicalityScore: "실용성 점수",
         costEffectivenessScore: "가성비 점수",
         oneLineReview: "한줄 큐레이팅",
         postNickname: "닉네임",
         password: "비밀번호",
      };

      for (const [field, name] of Object.entries(requiredFields)) {
         if (req.body[field] === undefined || req.body[field] === null || req.body[field] === "") {
            throw new ValidationError(`${name}을(를) 입력해 주세요.`); // 400 Bad Request
         }
      }
      // 2. 데이터 타입 및 형식 검사
      // 2-1. 점수 필드 검사 (숫자형, 0~10 범위)
      const scoreFields = [
         { value: trndyScore, name: "트렌디 점수" },
         { value: individualityScore, name: "개성 점수" },
         { value: practicalityScore, name: "실용성 점수" },
         { value: costEffectivenessScore, name: "가성비 점수" },
      ];
      for (const { value, name } of scoreFields) {
         const score = Number(value);
         if (isNaN(score) || score < 0 || score > 10) {
            throw new ValidationError(`${name}는 0부터 10 사이의 유효한 숫자여야 합니다.`);
         }
      }
      // 2-2. 문자열 필드 검사
      if (typeof oneLineReview !== "string" || oneLineReview.trim().length === 0) {
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
