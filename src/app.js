import express from "express";
import styleRouter from "./src/routes/style.router.js";
// src/app.js
import dotenv from "dotenv";
import { errorHandler } from "./utils/errorHandler.js";
// ▼ 추가된 부분 1: 라이브러리 불러오기
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

dotenv.config();

const app = express();

app.use(express.json());

// ▼ 추가된 부분 2: Swagger 페이지 라우터 등록
// 주소창에 /api-docs 라고 치면 문서가 나옵니다.
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/styles", styleRouter);
app.use("/styles", styleRouter);

const apiPort = process.env.API_PORT || 3000;

app.use(errorHandler);

app.listen(apiPort, () => {
  console.log(`Server running on port ${apiPort}`);
});

//export default app;
