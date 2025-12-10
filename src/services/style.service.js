import { Style, StyleDetail } from "../models/Style.js";
import {
  getStylesList,
  getFindStyle,
  increaseViewCount,
} from "../repositories/style.repository.js";

export const getStylesService = async ({ page, limit, sort }) => {
  console.log("getStylesService called!");
  const skip = (page - 1) * limit; //페이지네이션

  // 기본 정렬 조건(생성 시간 순)
  let orderByOption = { createdAt: "desc" };

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

  const updatedEntity = await increaseViewCount(styleId); //DB에서 조회하면 view 1 증가
  return StyleDetail.fromEntity(findStyle); //나중에 큐레이팅 목록 받아오는것도 작성할것
};
