import { Router } from "express";
import curationController from "../controllers/curation.controller.js";
import prisma from "../../prisma/prisma.js";
import { ValidationError, NotFoundError } from "../utils/CustomError.js";
import { validateRegisterCuration } from "../middleware/validation.middleware.js";

// import replyRouter from "./reply.router.js";
// style.router.js에 // styleId 파라미터 경로에 curationRouter를 마운트
// styleRouter.use("/:styleId/curations", curationRouter); => 작성 필요

const curationRouter = new Router({
  mergeParams: true, // 부모 라우터에서 전달되는 styleId 등의 파라미터를 사용하기 위해 필요
});

// 종속된 답글 라우터 => 라우터 이름 수정 필요
// curationRouter.use("/:curationId/replies", replyRouter);

// 큐레이션 관련 라우팅 정의
curationRouter
  .route("/")

  // 큐레이팅 등록
  // POST /styles/:styleId/curations
  .post(validateRegisterCuration, curationController.createCurationController)

  // 큐레이팅 목록 조회
  // GET /styles/:styleId/curations
  .get(curationController.getCurationListController);

curationRouter
  // '/curations/:curationId' 경로 처리
  .route("/:curationId")

  // 큐레이팅 수정
  // PUT /curations/:curationId
  .put(curationController.updateCurationController)

  // 큐레이팅 삭제
  // DELETE /curations/:curationId
  // 큐레이팅 등록 시 입력했던 비밀번호와 일치할 경우 큐레이팅 삭제가 가능합니다.
  .delete(curationController.deleteCurationController);

export default curationRouter;
