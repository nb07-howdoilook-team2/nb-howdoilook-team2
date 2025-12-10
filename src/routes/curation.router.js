import { Router } from "express";
import curationController from "../controllers/curation.controller.js";
import prisma from "../../prisma/prisma.js";
import { BadRequestError, NotFoundError } from "../utils/CustomError.js";
// import error
// import curation 클래스, 검증
// import 답글

const curationRouter = new Router({
   mergeParams: true, // 부모 라우터에서 전달되는 styleId 등의 파라미터를 사용하기 위해 필요
});
/**
 * 큐레이션 관련 라우팅 정의
 * * 부모 라우터(예: styles.router.js)에서 '/styles/:styleId/curations'로 연결될 것을 가정합니다.
 * * 1. POST /styles/:styleId/curations (등록)
 * 2. GET /styles/:styleId/curations (목록 조회)
 * * 3. PUT /curations/:curationId (수정)
 * 4. DELETE /curations/:curationId (삭제)
 */
//curationRouter.use( // 답글 );
curationRouter
   .route("/")
   // POST /styles/:styleId/curations: 큐레이팅 등록
   // - 트렌디, 개성, 실용성, 가성비 점수와 한줄 큐레이팅, 닉네임, 비밀번호를 입력하여 큐레이팅을 등록합니다.
   .post(curationController.createCurationController)
   // GET /styles/:styleId/curations: 큐레이팅 목록 조회
   .get(curationController.getCurationListController);
// ------------------------------------
// '/curations/:curationId' 경로 처리
// (보통 앱의 루트 라우터에서 직접 연결)
// ------------------------------------

// NOTE: 이 라우트들은 일반적으로 app.js에서 '/curations'와 같은 별도의 엔드포인트로 연결됩니다.
// 예: app.use('/curations', curationRouter);
curationRouter
   .route("/:curationId")
   .put(curationController.updateCurationController)
   // **큐레이팅 수정** - validation 추가해야 됨
   // - 비밀번호를 입력하여 큐레이팅 등록 시 입력했던 비밀번호와 일치할 경우 큐레이팅 수정이 가능합니다.
   // 유효성 검사
   // curationController
   //      .put(
   //     up.single('image'), // 단일 이미지 업로드 가정
   //     validation, // 요청 데이터 유효성 검사
   //     curationController.updateCuration // 실제 수정 로직을 컨트롤러로 분리
   //  );

   .delete(curationController.deleteCurationController);

// - 비밀번호를 입력하여 큐레이팅 등록 시 입력했던 비밀번호와 일치할 경우 큐레이팅 삭제가 가능합니다.
//     validation, // 요청 데이터 유효성 검사
//     curationController.updateCuration // 실제 수정 로직을

// **큐레이팅 삭제**

// - 비밀번호를 입력하여 큐레이팅 등록 시 입력했던 비밀번호와 일치할 경우 큐레이팅 삭제가 가능합니다.

// **큐레이팅 목록 조회**

// - 스타일을 조회할 경우 그 스타일에 해당되는 큐레이팅 목록이 같이 조회됩니다.
// - 각 큐레이팅의 트렌디, 개성, 실용성, 가성비 점수와 한줄 큐레이팅, 닉네임이 표시됩니다.
// - 닉네임, 내용으로 검색이 가능합니다.
// - 큐레이팅에 남겨진 답글도 같이 조회됩니다
export default curationRouter;
