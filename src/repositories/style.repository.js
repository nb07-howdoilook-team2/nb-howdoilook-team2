import prisma from "../prisma/prisma.js";

export const getStylesList = async () => {
  return await prisma.styles.findMany({
    skip,
    take: limit,
    orderBy,
  });
};

// 스타일 수정
updateStyle = async (styleId, updateData) => {
  const updatedStyle = await this.prisma.style.update({
    where: { id: +styleId },
    data: updateData,
  });
  return updatedStyle;
};

// 스타일 삭제
deleteStyle = async (styleId) => {
  const deletedStyle = await this.prisma.style.delete({
    where: { id: +styleId },
  });
  return deletedStyle;
};

export const getFindStyle = async (styleId) => {
  return await prisma.styles.findUnique({
    where: { id: BigInt(styleId) },
  });
};
