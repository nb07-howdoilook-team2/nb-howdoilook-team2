// src/utils/errorHandler.js
import { CustomError } from "./CustomError.js";

// Express 에러 처리 미들웨어
// 에러 핸들러는 반드시 (err, req, res, next) 4개의 인자를 받습니다.
export const errorHandler = (err, req, res, next) => {
  // 커스텀 에러 검증
  if (err instanceof CustomError) {
    // 에러를 콘솔에 로그 (개발 및 디버깅 용도)
    console.error(`[${statusCode} - ${err.name}] ${message}`);

    // 클라이언트에게 에러 응답 전송
    return res.status(err.status).json({
      message: err.message,
      name: err.name,
      errors: err.errors,
    });
  }

  // 예상치 못한 서버 에러인 경우
  console.error("Critical Server Error:", err.stack);

  // 클라이언트에게는 일반적인 500 에러 메시지만 전송
  return res.status(500).json({
    message: "내부 서버 오류가 발생했습니다.",
    name: "InternalServerError",
  });
};
