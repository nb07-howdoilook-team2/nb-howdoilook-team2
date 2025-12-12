import prisma from "../../prisma/prisma.js";
import { Style, StyleDetail } from "../models/Style.js";
import {
  getStylesList,
  getFindStyle,
  increaseViewCount,
  countStyles,
} from "../repositories/style.repository.js";

//목록조회, 오프셋페이지네이션, 검색, 정렬기준
export const getStylesService = async ({ page, limit, sort, search, tag }) => {
  const skip = (page - 1) * limit;

  let orderByOption = { createdAt: "desc" };
  if (sort === "views") orderByOption = { views: "desc" };
  if (sort === "curatedCount") orderByOption = { curatedCount: "desc" };

  const where = {};
  // 검색어가 들어오면 검색 들어왔을때 빈 문자열("")이면 모두 조회되도록 처리
  if (search && search.trim() !== "") {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { nickname: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
      { tags: { has: search } },
    ];
  }

  if (tag) {
    where.tags = { has: tag };
  }

  const totalItemCount = await countStyles(where);

  const styles = await getStylesList({
    where,
    skip,
    limit,
    orderBy: orderByOption,
  });

  return {
    currentPage: page,
    totalPages: Math.ceil(totalItemCount / limit),
    totalItemCount,
    data: styles.map((s) => Style.fromEntity(s)),
  };
};

//상세조회
export const findStyleService = async (styleId) => {
  const style = await getFindStyle(styleId);
  if (!style) return null;

  // 조회수 증가
  await increaseViewCount(styleId);

  // API 명세서 형식에 맞추기
  return {
    id: style.id.toString(),
    nickname: style.nickname,
    title: style.title,
    content: style.content,
    viewCount: style.viewCount,
    curationCount: style.curationCount,
    createdAt: style.createdAt,
    tags: style.tags,
    imageUrls: style.imageUrls ?? [],

    categories: style.categories
      ? {
          top: style.categories.top,
          bottom: style.categories.bottom,
        }
      : null,
  };
};

export class StyleService {
  postStyle = async ({
    nickname,
    title,
    content,
    password,
    categories,
    tags,
    imageUrls,
  }) => {
    // 1. thumbnail 필드 처리: imageUrls 배열의 첫 번째 요소를 thumbnail로 사용
    const thumbnail = imageUrls && imageUrls.length > 0 ? imageUrls[0] : null;

    const newStyle = await prisma.style.create({
      data: {
        nickname,
        title,
        content,
        password,
        thumbnail,
        categories,
        tags,
        imageUrls,
      },
      select: {
        id: true,
        nickname: true,
        title: true,
        content: true,
        thumbnail: true,
        viewCount: true,
        curationCount: true,
        createdAt: true,
        categories: true,
        tags: true,
        imageUrls: true,
      },
    });
    return newStyle;
  };
}

// // 스타일 수정 로직
// updateStyle = async (styleId, password, updateData) => {
//   // 1. 해당 스타일 존재 여부 확인
//   const style = await this.styleRepository.findStyleById(styleId);
//   if (!style) {
//     throw new CustomError(404, "존재하지 않는 스타일입니다.");
//   }

//   // 2. 비밀번호 검증 (단순 문자열 비교 예시, 실제 서비스에선 해시 비교 권장)
//   if (style.password !== password) {
//     throw new CustomError(403, "비밀번호가 일치하지 않습니다.");
//   }

//   // 3. 수정 진행
//   const updatedStyle = await this.styleRepository.updateStyle(
//     styleId,
//     updateData
//   );

//   return updatedStyle;
// };

// // 스타일 삭제 로직
// deleteStyle = async (styleId, password) => {
//   // 1. 해당 스타일 존재 여부 확인
//   const style = await this.styleRepository.findStyleById(styleId);
//   if (!style) {
//     throw new CustomError(404, "존재하지 않는 스타일입니다.");
//   }

//   // 2. 비밀번호 검증
//   if (style.password !== password) {
//     throw new CustomError(403, "비밀번호가 일치하지 않습니다.");
//   }

//   // 3. 삭제 진행
//   const deletedStyle = await this.styleRepository.deleteStyle(styleId);

//   return deletedStyle;
// };

// updateStyle = async (styleId, password, updateData) => {
//   /* ... */
// };
// deleteStyle = async (styleId, password) => {
//   /* ... */
// };
