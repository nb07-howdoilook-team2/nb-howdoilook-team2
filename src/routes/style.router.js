import express from "express";
// import StyleRepository from "../repositories/style.repository.js";
// import StyleService from "../services/style.service.js";
// import StyleController from "../controllers/style.controller.js";

import {
  getStylesController,
  findStyleController,
  // StyleController,
} from "../controllers/style.controller.js";
import { validateRegisterStyle } from "../middleware/validation.middleware.js";

const router = express.Router();

router.get("/", getStylesController);

router.get("/:id", findStyleController);

// // POST /styles 엔드포인트: 미들웨어를 먼저 실행 후 컨트롤러 호출
// router.post(
//   "/",
//   validateRegisterStyle, // 💡 유효성 검사 미들웨어 적용
//   StyleController.createStyle
// );

// const styleRepository = new StyleRepository(prisma);
// const styleService = new StyleService(styleRepository);
// const styleController = new StyleController(styleService);

/**
 * @swagger
 * tags:
 * name: Styles
 * description: 스타일 관리 API
 */

/**
 * @swagger
 * /api/styles:
 * get:
 * summary: 스타일 목록 조회 (큐레이팅 개수 포함)
 * tags: [Styles]
 * responses:
 * 200:
 * description: 조회 성공
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * data:
 * type: array
 * items:
 * type: object
 * properties:
 * id:
 * type: integer
 * name:
 * type: string
 * curationCount:
 * type: integer
 * description: 연결된 큐레이팅 개수
 */

/**
 * @swagger
 * /api/styles/{id}:
 * put:
 * summary: 스타일 수정
 * tags: [Styles]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * password:
 * type: string
 * name:
 * type: string
 * responses:
 * 200:
 * description: 수정 성공
 * 403:
 * description: 비밀번호 불일치
 * delete:
 * summary: 스타일 삭제
 * tags: [Styles]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * password:
 * type: string
 * responses:
 * 200:
 * description: 삭제 성공
 * 403:
 * description: 비밀번호 불일치
 */

// ▼ API 라우트 정의
// router.get("/", styleController.getStyles); // 목록 조회
// router.put("/:id", styleController.updateStyle); // 수정
// router.delete("/:id", styleController.deleteStyle); // 삭제

export default router;
