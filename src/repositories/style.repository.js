import prisma from "../../prisma/prisma.js";

//목록조회
export const getStylesList = async ({ skip, limit, orderBy }) => {
  return await prisma.style.findMany({
    skip,
    take: limit,
    orderBy,
  });
};
//상세조회
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
