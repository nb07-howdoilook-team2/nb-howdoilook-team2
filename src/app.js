const express = require("express");
// ▼ 추가된 부분 1: 라이브러리 불러오기
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger.js");

const app = express();
const PORT = 3000;

const styleRouter = require("./routes/style.router");
const errorHandler = require("./utils/errorHandler");

app.use(express.json());

// ▼ 추가된 부분 2: Swagger 페이지 라우터 등록
// 주소창에 /api-docs 라고 치면 문서가 나옵니다.
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/styles", styleRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`${PORT}번 포트에서 서버가 열렸습니다!`);
});
