import styleRepository from "../repositories/style.repository.js";

// 정렬 기준 매핑
const orderByMap = {
  total: { ratingTotal: "desc" },
  trendy: { ratingTrendy: "desc" },
  personality: { ratingPersonality: "desc" },
  practicality: { ratingPracticality: "desc" },
  costEffectiveness: { ratingCostEffectiveness: "desc" },
};

class RankingService {
  //랭킹조회 페이지네이션
  getRankings = async ({ page, limit, orderBy = "total" }) => {
    const currentPage = Number(page);
    const take = Number(limit);
    const skip = (currentPage - 1) * take;

    // 총 아이템 수와 총 페이지 수 계산
    const totalItemCount = await styleRepository.countAll();
    const totalPages = Math.ceil(totalItemCount / take);

    const styles = await styleRepository.findRankingList({
      skip,
      take,
      orderBy: orderByMap[orderBy] ?? orderByMap.total,
    });

    // 랭킹 데이터 매핑
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

    // 결과 반환
    return {
      currentPage, // 현재 페이지
      totalPages, // 총 페이지 수
      totalItemCount, // 총 아이템 수
      data, // 랭킹 데이터
    };
  };
}

export default new RankingService();
