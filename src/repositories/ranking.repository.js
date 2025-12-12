import prisma from "../../prisma/prisma.js";

// 스타일 + 큐레이션 전체 조회
export const getAllStylesWithCurations = async () => {
  return prisma.style.findMany({
    include: {
      curations: true, // 큐레이션 목록 포함
    },
  });
};
