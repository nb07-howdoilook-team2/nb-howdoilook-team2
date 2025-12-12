import { popularTagsService } from "../services/tag.service.js";

export const popularTagsController = async (req, res, next) => {
  try {
    const tags = await popularTagsService();
    return res.status(200).json(tags);
  } catch (e) {
    next(e);
  }
};
