function errorHandler(err, req, res, next) {
  console.error(err); // 서버 로그용

  // CustomError인 경우 해당 status 사용, 아니면 500
  const status = err.status || 500;
  const message = err.message || "서버 내부 에러가 발생했습니다.";

  res.status(status).json({ errorMessage: message });
}

module.exports = errorHandler;
