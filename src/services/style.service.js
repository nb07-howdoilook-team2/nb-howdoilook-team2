const CustomError = require("../utils/CustomError");

class StyleService {
  constructor(styleRepository) {
    this.styleRepository = styleRepository;
  }

  // ▼ [NEW] 목록 조회
  getStyles = async () => {
    const styles = await this.styleRepository.findAllStyles();

    // (선택 사항) 프론트엔드가 쓰기 편하게 데이터 가공
    // _count: { curations: 3 } -> curationCount: 3 형태로 변환
    return styles.map((style) => ({
      id: style.id,
      name: style.name,
      description: style.description,
      createdAt: style.createdAt,
      curationCount: style._count.curations, // 개수만 뽑아서 깔끔하게 전달
    }));
  };

  // 스타일 수정 로직
  updateStyle = async (styleId, password, updateData) => {
    // 1. 해당 스타일 존재 여부 확인
    const style = await this.styleRepository.findStyleById(styleId);
    if (!style) {
      throw new CustomError(404, "존재하지 않는 스타일입니다.");
    }

    // 2. 비밀번호 검증 (단순 문자열 비교 예시, 실제 서비스에선 해시 비교 권장)
    if (style.password !== password) {
      throw new CustomError(403, "비밀번호가 일치하지 않습니다.");
    }

    // 3. 수정 진행
    const updatedStyle = await this.styleRepository.updateStyle(
      styleId,
      updateData
    );

    return updatedStyle;
  };

  // 스타일 삭제 로직
  deleteStyle = async (styleId, password) => {
    // 1. 해당 스타일 존재 여부 확인
    const style = await this.styleRepository.findStyleById(styleId);
    if (!style) {
      throw new CustomError(404, "존재하지 않는 스타일입니다.");
    }

    // 2. 비밀번호 검증
    if (style.password !== password) {
      throw new CustomError(403, "비밀번호가 일치하지 않습니다.");
    }

    // 3. 삭제 진행
    const deletedStyle = await this.styleRepository.deleteStyle(styleId);

    return deletedStyle;
  };

  updateStyle = async (styleId, password, updateData) => {
    /* ... */
  };
  deleteStyle = async (styleId, password) => {
    /* ... */
  };
}

module.exports = StyleService;
