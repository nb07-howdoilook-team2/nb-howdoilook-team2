import prisma from "../../prisma/prisma.js";

export const getStylesList = async () => {
  return await prisma.styles.findMany({
    skip,
    take: limit,
    orderBy,
  });
};

export const getFindStyle = async (styleId) => {
  return await prisma.styles.findUnique({
    where: { id: BigInt(styleId) },
  });
};
