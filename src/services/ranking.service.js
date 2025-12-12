import {
  getTotalRanking,
  getMetricRanking,
} from "../repositories/ranking.repository.js";

export const getRankingList = async ({ page, limit, sort }) => {
  const skip = (page - 1) * limit;

  if (sort === "total") {
    const { styles, count } = await getTotalRanking(skip, limit);

    return {
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalItemCount: count,
      data: styles.map((style, index) => ({
        ...style,
        ranking: skip + index + 1,
      })),
    };
  }

  const validMetrics = {
    trendy: "trendy",
    personality: "persomality",
    practicality: "practicality",
    cost: "costEffectiveness",
  };

  const metric = validMetrics[sort];
  if (!metric) throw new Error("Invalid sort type");

  const styles = await getMetricRanking(metric, skip, limit);

  return {
    currentPage: page,
    totalPages: 1,
    totalItemCount: styles.length,
    data: styles.map((style, index) => ({
      ...style,
      ranking: skip + index + 1,
    })),
  };
};
