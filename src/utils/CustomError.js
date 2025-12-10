// src/utils/CustomError.js
export class CustomError extends Error {
   constructor(message, status = 500) {
      super(message);
      this.name = this.constructor.name;
      this.status = status;
      // 스택 트레이스를 캡처 (Node.js 환경에서 유용)
      Error.captureStackTrace(this, this.constructor);
   }
}

// 커스텀 에러 베이스 클래스
export class HttpError extends CustomError {
   constructor(statusCode, message) {
      super(message);
      this.statusCode = statusCode;
      this.name = this.constructor.name;
      Error.captureStackTrace(this, this.constructor);
   }
}

// 400 Bad Request
export class BadRequestError extends HttpError {
   constructor(message = "잘못된 요청입니다.") {
      super(400, message);
   }
}

// 401 인증 실패 에러
export class UnauthorizedError extends HttpError {
   constructor(message = "인증에 실패했습니다.") {
      super(message, 401);
      this.name = "UnauthorizedError";
   }
}

// 403
export class ForbiddenError extends HttpError {
   constructor(message = "접근할 권한이 없어 요청이 거부 되었습니다.") {
      super(403, message);
   }
}

// 404 Not Found
export class NotFoundError extends HttpError {
   constructor(message = "요청한 리소스를 찾을 수 없습니다.") {
      super(404, message);
   }
}

// 500 Internal Server Error
export class InternalServerError extends HttpError {
   constructor(message = "서버 내부 오류가 발생했습니다.") {
      super(500, message);
   }
}
