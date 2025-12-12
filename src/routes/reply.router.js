import { Router } from "express";

// Express 라우터 인스턴스 생성
const router = Router({
  mergeParams: true, // 상위 라우터에서 curationId를 받을 수 있도록 설정
});

// 이 라우터에 대한 API 정의는 여기에 추가됩니다.
// 현재는 빈 상태로 Default Export 합니다.

export default router;
