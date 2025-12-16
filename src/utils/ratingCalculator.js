export const calculateRatings = (curations) => {
  if (curations.length === 0) {
    return {
      ratingTrendy: 0,
      ratingPersonality: 0,
      ratingPracticality: 0,
      ratingCostEffectiveness: 0,
      ratingTotal: 0,
    };
  }

  const sum = curations.reduce(
    (acc, c) => {
      acc.trendy += c.trendy;
      acc.personality += c.personality;
      acc.practicality += c.practicality;
      acc.costEffectiveness += c.costEffectiveness;
      return acc;
    },
    { trendy: 0, personality: 0, practicality: 0, costEffectiveness: 0 }
  );

  const count = curations.length;

  const ratingTrendy = sum.trendy / count;
  const ratingPersonality = sum.personality / count;
  const ratingPracticality = sum.practicality / count;
  const ratingCostEffectiveness = sum.costEffectiveness / count;

  return {
    ratingTrendy,
    ratingPersonality,
    ratingPracticality,
    ratingCostEffectiveness,
    ratingTotal:
      (ratingTrendy +
        ratingPersonality +
        ratingPracticality +
        ratingCostEffectiveness) /
      4,
  };
};
