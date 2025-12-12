import { CustomError } from "./CustomError.js";

// Express 에러 처리 미들웨어
export const errorHandler = (error, req, res, next) => {
  // 1. 상태 코드를 error.statusCode 또는 error.status 또는 500 중에서 결정합니다.
  const status = error.statusCode || error.status || 500;

  const message = error.message || "내부 서버 오류가 발생했습니다.";
  const name = error.name || "InternalServerError";

  return res.status(status).json({
    message: message,
    name: name,
    // ...
  });
};
