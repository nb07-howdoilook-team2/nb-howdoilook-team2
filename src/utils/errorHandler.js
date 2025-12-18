// src/utils/errorHandler.js
import { CustomError } from "./CustomError.js";

export const errorHandler = (err, req, res, next) => {
  // 1. 기본 상태 및 메시지 정의 (예상치 못한 500 에러용)
  let statusCode = 500;
  let message = "내부 서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
  let name = "InternalServerError";
  let errors = undefined;

  // 2. 🚨 운영 에러 (CustomError) 처리
  if (err instanceof CustomError) {
    statusCode = err.status;
    message = err.message;
    name = err.name;
    errors = err.errors;

    // 💡 콘솔에는 상세 정보를 기록
    console.error(
      `[${statusCode} - ${name}] ${message}`,
      errors ? "\nErrors:" : "",
      errors || ""
    );
  }
  // 💡 기타 예상치 못한 에러 (Prisma, ReferenceError 등)는 500으로 처리
  else {
    // 🚨 프로그래밍 에러는 클라이언트에게 상세 정보를 숨기고, 서버 콘솔에만 기록
    console.error("❌ CRITICAL SERVER ERROR:", err);
    console.error("Stack Trace:", err.stack);
  }

  // 3. 🛡️ 클라이언트에게 에러 응답 전송
  // (CustomError는 이미 위에서 return 되었으므로, 여기는 500 에러 응답 전용으로 사용 가능)

  // CustomError를 분리하여 처리했으므로, 이 코드를 모든 에러 응답에 사용하도록 통일할 수 있습니다.
  // 하지만 CustomError 블록에서 이미 return 했으므로, 여기서는 500 에러의 응답을 최종적으로 정의합니다.
  if (res.headersSent) {
    return next(err);
  }

  // 최종 응답 객체 생성
  const responseBody = {
    success: false,
    message: message,
    name: name,
  };

  // CustomError이면서 errors 필드가 있다면 추가
  if (errors) {
    responseBody.errors = errors;
  }

  return res.status(statusCode).json(responseBody);
};
