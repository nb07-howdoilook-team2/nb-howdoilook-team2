import { Style } from "../models/Style.js";
import {
  getStylesList,
  getFindStyle,
} from "../repositories/style.repository.js";

export const getStylesService = async ({ page, limit, sort }) => {
  const skip = (page - 1) * limit; //페이지네이션

  // 기본 정렬 조건(생성 시간 순)
  let orderByOption = { created_at: "desc" };

  if (sort === "views") {
    orderByOption = { views: "desc" }; // view 오름차순
  } else if (sort === "curatedCount") {
    orderByOption = { curatedCount: "desc" }; // curatedCount 오름차순
  }
  const styles = await getStylesList({
    skip, //몇 페이지
    limit, //한 페이지당 게시글 갯수
    orderBy: orderByOption, // 무슨 기준으로 데이터를 불러올건지
  });

  return styles.map((style) => Style.fromEntity(style));
};

export const findStyleService = async (styleId) => {
  const findStyle = await getFindStyle(styleId);
  if (!findStyle) return null; //데이터 없을경우 null 반환

  return Style.fromEntity(findStyle);
};
// 스타일 수정 로직
updateStyle = async (styleId, password, updateData) => {
  // 1. 해당 스타일 존재 여부 확인
  const style = await this.styleRepository.findStyleById(styleId);
  if (!style) {
    throw new CustomError(404, "존재하지 않는 스타일입니다.");
  }

  // 2. 비밀번호 검증 (단순 문자열 비교 예시, 실제 서비스에선 해시 비교 권장)
  if (style.password !== password) {
    throw new CustomError(403, "비밀번호가 일치하지 않습니다.");
  }

  // 3. 수정 진행
  const updatedStyle = await this.styleRepository.updateStyle(
    styleId,
    updateData
  );

  return updatedStyle;
};

// 스타일 삭제 로직
deleteStyle = async (styleId, password) => {
  // 1. 해당 스타일 존재 여부 확인
  const style = await this.styleRepository.findStyleById(styleId);
  if (!style) {
    throw new CustomError(404, "존재하지 않는 스타일입니다.");
  }

  // 2. 비밀번호 검증
  if (style.password !== password) {
    throw new CustomError(403, "비밀번호가 일치하지 않습니다.");
  }

  // 3. 삭제 진행
  const deletedStyle = await this.styleRepository.deleteStyle(styleId);

  return deletedStyle;
};

updateStyle = async (styleId, password, updateData) => {
  /* ... */
};
deleteStyle = async (styleId, password) => {
  /* ... */
};
