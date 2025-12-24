import express from "express";
import StyleController from "../controllers/style.controller.js";
import {
  validateRegisterStyle,
  validateGetStylesList,
  validateFindStyle,
  validateUpdateStyle,
  validateDeleteStyle,
} from "../middleware/validation.middleware.js";
import curationRouter from "./curation.router.js";

const router = express.Router();

// style.router.js에 styleId 파라미터 경로에 curationRouter를 마운트
router.use("/:styleId/curations", curationRouter);

// GET /styles 엔드포인트: 스타일 목록 조회
router.get("/", validateGetStylesList, StyleController.getStyles);
// GET /styles/:styleId 엔드포인트: 스타일 상세 조회
router.get("/:styleId", validateFindStyle, StyleController.findStyle);

// POST /styles 엔드포인트: 미들웨어를 먼저 실행 후 컨트롤러 호출
router.post("/", validateRegisterStyle, StyleController.postStyle);

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

export default router;
