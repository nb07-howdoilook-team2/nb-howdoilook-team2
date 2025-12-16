import { getRankingList } from "../services/ranking.service.js";

// BigInt를 안전하게 JSON으로 변환하는 함수
function convertBigInt(obj) {
  if (obj instanceof Date) {
    return obj.toISOString();
  }

  if (Array.isArray(obj)) {
    return obj.map(convertBigInt);
  }

  if (obj !== null && typeof obj === "object") {
    const newObj = {};
    for (const key in obj) {
      newObj[key] = convertBigInt(obj[key]);
    }
    return newObj;
  }

  if (typeof obj === "bigint") {
    return obj.toString();
  }

  return obj;
}

export const rankingController = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = "total" } = req.query;

    const data = await getRankingList({
      page: Number(page),
      limit: Number(limit),
      sort,
    });

    const safeData = convertBigInt(data);

    res.status(200).json(safeData);
  } catch (e) {
    next(e);
  }
};
