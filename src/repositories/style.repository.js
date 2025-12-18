import prisma from "../../prisma/prisma.js";

class StyleRepository {
  getStylesList = async ({ where, skip, limit, orderBy }) => {
    // 검색어, 페이지네이션, 정렬기준에 따른 스타일 목록 데이터 베이스에서 가져오기
    return prisma.style.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    });
  };

  // 총 개수 조회
  countStyles = async (where) => {
    return prisma.style.count({ where }); // 조건에 맞는 스타일 총 개수 반환
  };

  // 상세조희, 조회수 상승
  findStyle = async (styleId) => {
    return prisma.style.findUnique({
      where: { id: BigInt(styleId) },
      include: {
        categories: true,
        tags: true,
        imageUrls: true,
        curations: true,
      },
    });
  };

  increaseViewCount = async (styleId) => {
    return prisma.style.update({
      where: { id: BigInt(styleId) },
      data: { viewCount: { increment: 1 } },
    });
  };

  // 스타일 수정
  updateStyle = async (styleId, updateData) => {
    // updateData에는 password가 포함되지 않아야 합니다.
    return await prisma.style.update({
      where: { id: BigInt(styleId) },
      data: updateData,
    });
  };

  // 스타일 삭제
  deleteStyle = async (styleId) => {
    return await prisma.style.delete({
      where: { id: BigInt(styleId) },
    });
  };

  // 조회 수 증가
  increaseViewCount = async (styleId) => {
    // 상세조회로 들어오면 스타일 ID에 해당하는 조회수 1 증가
    return await prisma.style.update({
      where: { id: BigInt(styleId) },
      data: {
        viewCount: { increment: 1 }, //prisma 숫자 증가 연산자
      },
    });
  };

  updateStyleRatings = async (styleId, data) => {
    return prisma.style.update({
      where: { id: BigInt(styleId) },
      data,
    });
  };

  countAll = async () => {
    return prisma.style.count();
  };

  findRankingList = async ({ skip, limit, orderBy }) => {
    return prisma.style.findMany({
      skip,
      take: limit,
      orderBy,
      select: {
        id: true,
        thumbnail: true,
        nickname: true,
        title: true,
        tags: true,
        categories: true,
        viewCount: true,
        curationCount: true,
        createdAt: true,

        // 랭킹에 필요한 점수 전부
        ratingTotal: true, // 총점
        ratingTrendy: true, // 트렌디 점수
        ratingPersonality: true, // 개성 점수
        ratingPracticality: true, // 실용성 점수
        ratingCostEffectiveness: true, // 가성비 점수
      },
    });
  };
}

export default new StyleRepository();
