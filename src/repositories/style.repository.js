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

  // 상세조희
  getFindStyle = async (styleId) => {
    return await prisma.style.findUnique({
      where: { id: BigInt(styleId) }, // ID BIGINT 변환
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
        ratingTotal: true,
      },
    });
  };
}

export default new StyleRepository();
