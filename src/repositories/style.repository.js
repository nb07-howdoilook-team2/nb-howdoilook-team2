import prisma from "../../prisma/prisma.js";

// 목록조회
export const getStylesList = async ({ skip, limit, orderBy }) => {
  // 💡 심화 요구 사항: 큐레이팅 개수 포함 (ORM 고급 활용)
  return await prisma.style.findMany({
    skip,
    take: limit,
    orderBy,
    select: {
      id: true,
      nickname: true,
      title: true,
      content: true,
      // ... 필요한 모든 필드
      viewCount: true,
      createdAt: true,
      thumbnail: true,
      categories: true,
      tags: true,
      imageUrls: true,
      // ORM 고급 활용: 큐레이션 개수 조회
      _count: {
        select: {
          curations: true,
        },
      },
    },
  });
};

export const createStyle = async (styleData) => {
  const newStyle = await prisma.style.create({
    data: styleData,
  });
  return newStyle;
};

// 총 개수 조회
export const countStyles = async (where) => {
  return prisma.style.count({ where }); // 조건에 맞는 스타일 총 개수 반환
};

// 상세조희
export const getFindStyle = async (styleId) => {
  return await prisma.style.findUnique({
    where: { id: BigInt(styleId) }, // ID BIGINT 변환
  });
};

// 조회 수 증가
export const increaseViewCount = async (styleId) => {
  // 상세조회로 들어오면 스타일 ID에 해당하는 조회수 1 증가
  return await prisma.style.update({
    where: { id: BigInt(styleId) },
    data: {
      viewCount: { increment: 1 }, //prisma 숫자 증가 연산자
    },
  });
};

export const updateStyleRatings = async (styleId, data) => {
  return prisma.style.update({
    where: { id: BigInt(styleId) },
    data,
  });
};

export const countAll = async () => {
  return prisma.style.count();
};

export const findRankingList = async ({ skip, limit, orderBy }) => {
  return prisma.style.findMany({
    skip,
    take: limit,
    orderBy,
    select: {
      id: true,
      thumbnail: true,
      nickname: true,
      title: true,
      tags: true,
      categories: true,
      viewCount: true,
      curationCount: true,
      createdAt: true,
      ratingTotal: true,
    },
  });
};

// 💡 스타일 수정 (추가)
export const updateStyle = async (styleId, updateData) => {
  return await prisma.style.update({
    where: { id: BigInt(styleId) },
    data: updateData,
  });
};

// 💡 스타일 삭제 (추가)
export const deleteStyle = async (styleId) => {
  return await prisma.style.delete({
    where: { id: BigInt(styleId) },
  });
};

export default { getStylesList, createStyle, updateStyle, deleteStyle };
