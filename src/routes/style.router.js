import express from "express";
import curationRouter from "./curation.router.js";
import {
  getStylesController,
  findStyleController,
  updateStyleController,
  deleteStyleController,
  createStyleController, // POST 요청 처리를 위해 사용
} from "../controllers/style.controller.js";
import { popularTagsController } from "../controllers/tag.controller.js";

import { Router } from "express";
import StyleController from "../controllers/style.controller.js";

// ✅ 아래 import 목록에 validateFindStyle을 추가합니다.
import {
  validateGetStylesList,
  validateRegisterStyle,
  validateUpdateStyle,
  validateDeleteStyle,
  validateFindStyle, // 👈 이 부분을 추가하세요!
} from "../middleware/validation.middleware.js";

const router = Router();

// style.router.js에 styleId 파라미터 경로에 curationRouter를 마운트
// router.use("/:styleId/curations", curationRouter);

// GET /styles 엔드포인트: 스타일 목록 조회
router.get("/", validateGetStylesList, StyleController.getStyles);
// GET /styles/:styleId 엔드포인트: 스타일 상세 조회
router.get("/:styleId", validateFindStyle, StyleController.findStyle);

// POST /styles 엔드포인트: 미들웨어를 먼저 실행 후 컨트롤러 호출
router.post("/", validateRegisterStyle, StyleController.createStyle);

// PUT /styles/:styleId 엔드포인트: 스타일 수정 (validateFindStyle로 ID 형식 검증)
router.put(
  "/:styleId",
  validateFindStyle,
  validateUpdateStyle,
  StyleController.updateStyle
);
// DELETE /styles/:styleId 엔드포인트: 스타일 삭제
router.delete(
  "/:styleId",
  validateFindStyle,
  validateDeleteStyle,
  StyleController.deleteStyle
);

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
