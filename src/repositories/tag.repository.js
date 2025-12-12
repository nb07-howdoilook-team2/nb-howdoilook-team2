import prisma from "../../prisma/prisma.js";

export const popularTags = async () => {
  const styles = await prisma.style.findMany({ select: { tags: true } });

  const tagCount = {};

  styles.forEach((style) => {
    style.tags.forEach((tag) => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCount)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
};
