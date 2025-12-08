class StyleRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // ID로 스타일 조회 (비밀번호 검증용)
  findStyleById = async (styleId) => {
    const style = await this.prisma.style.findUnique({
      where: { id: +styleId }, // id가 Int형이라 가정하고 변환
    });
    return style;
  };

  // 스타일 수정
  updateStyle = async (styleId, updateData) => {
    const updatedStyle = await this.prisma.style.update({
      where: { id: +styleId },
      data: updateData,
    });
    return updatedStyle;
  };

  // 스타일 삭제
  deleteStyle = async (styleId) => {
    const deletedStyle = await this.prisma.style.delete({
      where: { id: +styleId },
    });
    return deletedStyle;
  };

  // ▼ [NEW] 스타일 목록 조회 (큐레이팅 개수 포함)
  findAllStyles = async () => {
    const styles = await this.prisma.style.findMany({
      // 최신순 정렬
      orderBy: { createdAt: "desc" },
      // ★ 여기가 핵심: 연관된 curations의 개수를 세어서 가져옴
      include: {
        _count: {
          select: { curations: true },
        },
      },
    });
    return styles;
  };

  // ... (기존 코드 유지)
  findStyleById = async (styleId) => {
    /* ... */
  };
  updateStyle = async (styleId, updateData) => {
    /* ... */
  };
  deleteStyle = async (styleId) => {
    /* ... */
  };
}

module.exports = StyleRepository;
