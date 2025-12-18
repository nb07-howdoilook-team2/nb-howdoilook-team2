import { popularTags } from "../repositories/tag.repository.js";

export const popularTagsService = async () => {
  const tagWithCount = await popularTags();

  return {
    // 상위 10개 태그만 반환
    tags: tagWithCount.slice(0, 10).map((t) => t.tag),
  };
};
