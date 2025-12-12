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

// 💡 [수정] 미들웨어 import: 누락된 validateRegisterStyle을 추가합니다.
import {
  validateRegisterStyle, // 🚨 추가: POST 요청 유효성 검사 미들웨어
  validateUpdateStyle,
  validateDeleteStyle,
} from "../middleware/validation.middleware.js";

const router = express.Router();

// style.router.js에 styleId 파라미터 경로에 curationRouter를 마운트
// router.use("/:styleId/curations", curationRouter);

router.get("/", getStylesController);
router.get("/:id", findStyleController);

// 🚨 [수정] POST 라우트 통합:
// validateRegisterStyle 미들웨어와 createStyleController 컨트롤러를 사용해 하나의 POST 라우트로 통합합니다.
router.post("/", validateRegisterStyle, createStyleController);

// 💡 PUT /styles/:id (수정) 라우트 연결
router.put("/:id", validateUpdateStyle, updateStyleController);

// 💡 DELETE /styles/:id (삭제) 라우트 연결
router.delete("/:id", validateDeleteStyle, deleteStyleController);

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
