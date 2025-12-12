import prisma from "../../prisma/prisma.js";
import { Style, StyleDetail } from "../models/Style.js";
import {
  getStylesList,
  // 💡 Alias 적용: getFindStyle 함수를 가져와서 findStyleById 라는 이름으로 사용
  getFindStyle as findStyleById,
  increaseViewCount,
  updateStyle, // 추가
  deleteStyle, // 추가
  createStyle, // 추가
  // 💡 [수정됨] countStyles 함수를 Repository에서 가져옵니다.
  countStyles,
} from "../repositories/style.repository.js";
import { ForbiddenError, NotFoundError } from "../utils/CustomError.js"; // 커스텀 에러

//목록조회, 오프셋페이지네이션, 검색, 정렬기준
export const getStylesService = async ({ page, limit, sort, search }) => {
  const skip = (page - 1) * limit;

  let orderByOption = { createdAt: "desc" };
  if (sort === "viewCount") orderByOption = { viewCount: "desc" };
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
  // 🔽 [수정됨] findStyleById (별칭)을 사용하여 조회
  const style = await findStyleById(styleId);
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
export const updateStyleService = async (styleId, password, updateData) => {
  // 1. 해당 스타일 존재 여부 확인 (비밀번호 검증을 위해 findStyleById 사용)
  const style = await findStyleById(styleId);
  if (!style) {
    throw new NotFoundError("존재하지 않습니다."); // 404
  }
  // 2. 비밀번호 검증 (실제 서비스에서는 해싱된 비밀번호 비교 권장)
  if (style.password !== password) {
    throw new ForbiddenError("비밀번호가 틀렸습니다"); // 403
  }

  // 3. 수정 진행
  const updatedStyle = await updateStyle(styleId, updateData);

  // 응답 명세에 맞게 StyleDetail 모델로 변환하여 반환
  // TODO: StyleDetail.fromEntity 구현 필요
  // 🔽 [최종 수정] API 명세 형식에 맞춰 반환 값을 구성합니다.
  return {
    id: updatedStyle.id.toString(), // BigInt -> String
    nickname: updatedStyle.nickname,
    title: updatedStyle.title,
    content: updatedStyle.content,
    viewCount: updatedStyle.viewCount,
    curationCount: updatedStyle.curationCount,
    createdAt: updatedStyle.createdAt,
    tags: updatedStyle.tags,
    imageUrls: updatedStyle.imageUrls ?? [],
    categories: updatedStyle.categories
      ? {
          top: updatedStyle.categories.top,
          bottom: updatedStyle.categories.bottom,
        }
      : null,
  };
};

// 💡 스타일 삭제 로직 (추가)
export const deleteStyleService = async (styleId, password) => {
  // 1. 해당 스타일 존재 여부 확인
  const style = await findStyleById(styleId);
  if (!style) {
    throw new NotFoundError("존재하지 않습니다."); // 404
  }

  // 2. 비밀번호 검증
  if (style.password !== password) {
    throw new ForbiddenError("비밀번호가 틀렸습니다"); // 403
  }

  // 3. 삭제 진행
  await deleteStyle(styleId);

  return { message: "스타일 삭제 성공" };
};

// ▼ 스타일 등록 로직 함수 추가 (export const)
export const createStyleService = async (styleData) => {
  // 1. 비밀번호 해싱 등 필요한 비즈니스 로직 수행 (여기서는 생략)

  // 2. Repository 레이어에 생성 요청
  const newStyle = await createStyle(styleData);

  return newStyle;
};
