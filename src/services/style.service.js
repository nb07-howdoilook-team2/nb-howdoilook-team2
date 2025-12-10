import { Style } from "../models/Style.js";
import { getStylesList, getFindStyle } from "../repositories/style.repository.js";

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
