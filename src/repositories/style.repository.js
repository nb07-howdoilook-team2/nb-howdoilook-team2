import prisma from "../../prisma/prisma.js";

//목록조회
export const getStylesList = async ({ skip, limit, orderBy }) => {
  return await prisma.style.findMany({
    skip,
    take: limit,
    orderBy,
  });
};

// 상세조희
export const getFindStyle = async (styleId) => {
  return await prisma.style.findUnique({
    where: { id: BigInt(styleId) },
  });
};

// view 수 증가
export const increaseViewCount = async (styleId) => {
  return await prisma.style.update({
    where: { id: BigInt(styleId) },
    data: {
      views: { increment: 1 }, //prisma 숫자 증가 연산자
    },
  });
};

// // 스타일 수정
// updateStyle = async (styleId, updateData) => {
//   const updatedStyle = await this.prisma.style.update({
//     where: { id: +styleId },
//     data: updateData,
//   });
//   return updatedStyle;
// };

// // 스타일 삭제
// deleteStyle = async (styleId) => {
//   const deletedStyle = await this.prisma.style.delete({
//     where: { id: +styleId },
//   });
//   return deletedStyle;
// };
