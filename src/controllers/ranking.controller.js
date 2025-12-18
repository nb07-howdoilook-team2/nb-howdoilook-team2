import rankingService from "../services/ranking.service.js";

export const getRankingController = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, rankBy, sort, type = "all" } = req.query;

    const orderBy = rankBy ?? sort ?? "total";

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
