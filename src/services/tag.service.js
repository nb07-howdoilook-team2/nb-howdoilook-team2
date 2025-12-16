import { popularTags } from "../repositories/tag.repository.js";

export const popularTagsService = async () => {
  return await popularTags();
};
