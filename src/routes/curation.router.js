import { Router } from "express";
import {
  createCurationController,
  getCurationListController,
  updateCurationController,
  deleteCurationController,
} from "../controllers/curation.controller.js";

// 3. 필요한 라우터 및 미들웨어를 Import 합니다.
import replyRouter from "./reply.router.js";
import { validateRegisterCuration } from "../middleware/validation.middleware.js";

// CustomError는 라우터에서 직접 throw하지 않으므로, 이 파일에서는 제거합니다.
// import { ValidationError, NotFoundError } from "../utils/CustomError.js";
// prisma는 컨트롤러/서비스에서 사용하므로, 이 파일에서는 제거합니다.
// import prisma from "../../prisma/prisma.js";

// Router 인스턴스 생성 (const router = new Router(...) 대신 const router = Router(...) 사용)
const curationRouter = Router({
  mergeParams: true, // 부모 라우터에서 전달되는 styleId 등의 파라미터를 사용하기 위해 필요
});

// 종속된 답글 라우터 => 라우터 이름 수정 필요
// curationRouter.use("/:curationId/replies", replyRouter);

// 큐레이션 관련 라우팅 정의
curationRouter
  .route("/")

  // 큐레이팅 등록 (Controller 함수 직접 연결)
  // POST /styles/:styleId/curations
  .post(validateRegisterCuration, createCurationController)

  // 큐레이팅 목록 조회 (Controller 함수 직접 연결)
  // GET /styles/:styleId/curations
  .get(getCurationListController);

curationRouter
  // '/curations/:curationId' 경로 처리
  .route("/:curationId")

  // 큐레이팅 수정 (Controller 함수 직접 연결)
  // PUT /curations/:curationId
  .put(updateCurationController)

  // 큐레이팅 삭제 (Controller 함수 직접 연결)
  // DELETE /curations/:curationId
  .delete(deleteCurationController);

// Default Export로 router 객체를 내보냅니다.
export default curationRouter;
