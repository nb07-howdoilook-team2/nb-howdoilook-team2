import styleRepository from "../repositories/style.repository.js";

const orderByMap = {
  total: { ratingTotal: "desc" },
  trendy: { ratingTrendy: "desc" },
  personality: { ratingPersonality: "desc" },
  practicality: { ratingPracticality: "desc" },
  costEffectiveness: { ratingCostEffectiveness: "desc" },
};

class RankingService {
  getRankings = async ({ page, limit, orderBy = "total" }) => {
    const currentPage = Number(page);
    const take = Number(limit);
    const skip = (currentPage - 1) * take;

    const totalItemCount = await styleRepository.countAll();
    const totalPages = Math.ceil(totalItemCount / take);

    const styles = await styleRepository.findRankingList({
      skip,
      take,
      orderBy: orderByMap[orderBy] ?? orderByMap.total,
    });

    const data = styles.map((style, index) => ({
      id: style.id,
      thumbnail: style.thumbnail,
      nickname: style.nickname,
      title: style.title,
      tags: style.tags,
      categories: style.categories,
      viewCount: style.viewCount,
      curationCount: style.curationCount,
      createdAt: style.createdAt,
      ranking: skip + index + 1,
      rating:
        orderBy === "trendy"
          ? style.ratingTrendy
          : orderBy === "personality"
            ? style.ratingPersonality
            : orderBy === "practicality"
              ? style.ratingPracticality
              : orderBy === "costEffectiveness"
                ? style.ratingCostEffectiveness
                : style.ratingTotal,
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
