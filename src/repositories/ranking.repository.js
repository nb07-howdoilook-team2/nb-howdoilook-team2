import prisma from "../../prisma/prisma.js";

//전체 랭킹 조회
export const getTotalRanking = async (skip, limit) => {
  const styles = await prisma.style.findMany({
    orderBy: { rating: "desc" },
    skip,
    take: limit,
  });

  const count = await prisma.style.count();
  return { styles, count };
};

export const getMetricRanking = async (metric, skip, limit) => {
  const grouped = await prisma.curating.groupBy({
    by: ["styleId"],
    _avg: {
      [metric]: true,
    },
    orderBy: {
      _avg: { [metric]: "desc" },
    },
    skip,
    take: limit,
  });

  const styleIds = grouped.map((p) => g.styleId);

  const styles = await prisma.style.findMany({
    where: { id: { in: styleIds } },
  });

  return styles;
};
