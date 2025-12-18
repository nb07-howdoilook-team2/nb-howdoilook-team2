import rankingService from "../services/ranking.service.js";

export const getRankingController = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, rankBy, sort, type = "all" } = req.query;

    // 허용된 rankBy 값 목록
    const allowedRankBy = [
      "total",
      "trendy",
      "personality",
      "practicality",
      "costEffectiveness",
    ];

    // rankBy와 sort 중 우선순위가 높은 것을 선택(랭킹페이지 url rankBy 우선)
    const rawOrderBy = rankBy ?? sort ?? "total";

    // 유효한 값인지 확인 후 기본값 설정
    const orderBy = allowedRankBy.includes(rawOrderBy) ? rawOrderBy : "total";

    const result = await rankingService.getRankings({
      page: Number(page),
      limit: Number(limit),
      orderBy,
      type,
    });

    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};
