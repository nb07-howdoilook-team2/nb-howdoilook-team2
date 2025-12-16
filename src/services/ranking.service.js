import styleRepository from "../repositories/style.repository.js";

const orderByMap = {
  all: { ratingTotal: "desc" },
  trendy: { ratingTrendy: "desc" },
  personality: { ratingPersonality: "desc" },
  practicality: { ratingPracticality: "desc" },
  costEffectiveness: { ratingCostEffectiveness: "desc" },
};

class RankingService {
  getRankings = async ({ page, limit, type }) => {
    const currentPage = Number(page);
    const take = Number(limit);
    const skip = (currentPage - 1) * take;

    const totalItemCount = await styleRepository.countAll();
    const totalPages = Math.ceil(totalItemCount / take);

    const styles = await styleRepository.findRankingList({
      skip,
      take,
      orderBy: orderByMap[type] ?? orderByMap.all,
    });

    const data = styles.map((style, index) => ({
      ...style,
      ranking: skip + index + 1,
      rating: style.ratingTotal,
    }));

    return {
      currentPage,
      totalPages,
      totalItemCount,
      data,
    };
  };
}

export default new RankingService();
