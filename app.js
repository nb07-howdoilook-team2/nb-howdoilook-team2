import express from "express";
import dotenv from "dotenv";
import curationRouter from "./src/routes/curation.router.js";
import {
  ValidationError,
  ForbiddenError,
  NotFoundError,
} from "./src/utils/CustomError.js";
import { errorHandler } from "./src/utils/errorHandler.js";
import router from "./src/routes/style.router.js";
import tagRouter from "./src/routes/tag.router.js";

dotenv.config();

const app = express();
app.use(express.json());

// 큐레이션 라우터 연결 (메인 엔드포인트)
// PUT/DELETE /curations/:curationId 경로가 이 라우터를 통해 처리됩니다.
app.use("/curations", curationRouter);
app.use("/styles", router);
app.use("/tags", tagRouter);

app.get("/", (req, res) => {
  res.json({
    message: "RESTful API server",
    endpoints: ["/styles", "/curations"],
  });
});
app.use(errorHandler);

// const apiPort = process.env.API_PORT || 3000;

app.listen(3000, () => {
  console.log(`떴다`);
});
