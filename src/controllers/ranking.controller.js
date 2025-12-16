import rankingService from "../services/ranking.service.js";

export const getRankingController = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, type = "all" } = req.query;

    const result = await rankingService.getRankings({
      page,
      limit,
      type,
    });

    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};
