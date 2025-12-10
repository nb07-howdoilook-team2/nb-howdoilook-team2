import express from "express";
import curationRouter from "./src/routes/curation.router.js";
import { BadRequestError, ForbiddenError, NotFoundError } from "./src/utils/CustomError.js";
import { errorHandler } from "./src/utils/errorHandler.js";

const app = express();
app.use(express.json());

// 큐레이션 라우터 연결 (메인 엔드포인트)
// PUT/DELETE /curations/:curationId 경로가 이 라우터를 통해 처리됩니다.
app.use("/curations", curationRouter);

app.get("/", (req, res) => {
   res.json({
      message: "RESTful API server",
      endpoints: ["/styles", "/curations"],
   });
});
app.use(errorHandler);

app.listen(3000, () => {
   console.log(`떴다`);
});
