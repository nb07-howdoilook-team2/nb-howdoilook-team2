class StyleController {
  constructor(styleService) {
    this.styleService = styleService;
  }

  // ▼ [NEW] 목록 조회 API
  getStyles = async (req, res, next) => {
    try {
      const styles = await this.styleService.getStyles();
      return res.status(200).json({ data: styles });
    } catch (error) {
      next(error);
    }
  };

  // 스타일 수정 API
  updateStyle = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { password, ...updateData } = req.body; // password와 나머지 수정 데이터 분리

      if (!password) {
        throw new Error("비밀번호를 입력해주세요."); // 혹은 CustomError 사용
      }

      const updatedStyle = await this.styleService.updateStyle(
        id,
        password,
        updateData
      );

      return res.status(200).json({ data: updatedStyle });
    } catch (error) {
      next(error); // Global Error Handler로 전달
    }
  };

  // 스타일 삭제 API
  deleteStyle = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { password } = req.body;

      if (!password) {
        throw new Error("비밀번호를 입력해주세요.");
      }

      const deletedStyle = await this.styleService.deleteStyle(id, password);

      return res.status(200).json({
        message: "스타일이 삭제되었습니다.",
        id: deletedStyle.id,
      });
    } catch (error) {
      next(error); // Global Error Handler로 전달
    }
  };

  updateStyle = async (req, res, next) => {
    /* ... */
  };
  deleteStyle = async (req, res, next) => {
    /* ... */
  };
}

module.exports = StyleController;
