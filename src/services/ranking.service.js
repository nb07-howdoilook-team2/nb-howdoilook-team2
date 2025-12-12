import { getAllStylesWithCurations } from "../repositories/ranking.repository.js";

export const getRankingList = async ({ page, limit, sort }) => {
  const skip = (page - 1) * limit;

  // 1. 스타일 + 큐레이션 불러오기
  const styles = await getAllStylesWithCurations();

  // 2. rating 계산
  const ranked = styles.map((style) => {
    const ratingDetail = calculateRating(style.curations);

    return {
      id: style.id.toString(),
      thumbnail: style.thumbnail,
      nickname: style.nickname,
      title: style.title,
      tags: style.tags,
      categories: style.categories,
      viewCount: style.viewCount,
      curationCount: style.curationCount,
      createdAt: style.createdAt,
      rating: ratingDetail.total,
    };
  });

  // 3. sort 기준에 따른 정렬
  switch (sort) {
    case "trendy":
      ranked.sort((a, b) => b.ratingDetail.trendy - a.ratingDetail.trendy);
      break;
    case "personality":
      ranked.sort(
        (a, b) => b.ratingDetail.personality - a.ratingDetail.personality
      );
      break;
    case "practicality":
      ranked.sort(
        (a, b) => b.ratingDetail.practicality - a.ratingDetail.practicality
      );
      break;
    case "cost":
      ranked.sort(
        (a, b) =>
          b.ratingDetail.costEffectiveness - a.ratingDetail.costEffectiveness
      );
      break;
    default: // total
      ranked.sort((a, b) => b.rating - a.rating);
      break;
  }
  // 4. pagination
  const paginated = ranked.slice(skip, skip + limit);

  // 5. ranking 번호 부여
  paginated.forEach((item, idx) => {
    item.ranking = skip + idx + 1;
  });

  return {
    currentPage: page,
    totalPages: Math.ceil(ranked.length / limit),
    totalItemCount: ranked.length,
    data: paginated,
  };
};

function calculateRating(curations) {
  if (!curations || curations.length === 0) {
    return {
      trendy: 0,
      personality: 0,
      practicality: 0,
      costEffectiveness: 0,
      total: 0,
    };
  }

  const count = curations.length;

  const trendy = curations.reduce((sum, c) => sum + c.trendy, 0) / count;
  const personality =
    curations.reduce((sum, c) => sum + c.personality, 0) / count;
  const practicality =
    curations.reduce((sum, c) => sum + c.practicality, 0) / count;
  const costEffectiveness =
    curations.reduce((sum, c) => sum + c.costEffectiveness, 0) / count;

  const total = (trendy + personality + practicality + costEffectiveness) / 4;

  return {
    trendy: Number(trendy.toFixed(1)),
    personality: Number(personality.toFixed(1)),
    practicality: Number(practicality.toFixed(1)),
    costEffectiveness: Number(costEffectiveness.toFixed(1)),
    total: Number(total.toFixed(1)),
  };
}
