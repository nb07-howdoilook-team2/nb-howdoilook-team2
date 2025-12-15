import StyleService from "../services/style.service.js";

// 스타일 목록 조회
// 갤러리 상단에 인기 태그가 표시됩니다. 해당 태그를 클릭하면 그 태그에 해당하는 스타일 목록이 표시됩니다.
// 최신순, 조회순, 큐레이팅순(큐레이팅 많은 순)으로 정렬 가능합니다.
// 닉네임, 제목, 상세, 태그로 검색이 가능합니다.
class StyleController {
  getStyles = async (req, res, next) => {
    try {
      // 쿼리 파라미터에서 페이지, 한 페이지당 아이템 수, 정렬기준, 검색어 추출
      const { page = 1, limit = 10, sort = "latest", search } = req.query;

      // 서비스 레이어의 getStylesService 함수 호출
      const styles = await StyleService.getStyles({
        page: Number(page),
        limit: Number(limit),
        sort,
        search,
      });

      // response로 스타일 목록 반환
      return res.status(200).json(styles);
    } catch (e) {
      next(e);
    }
  };

  // 스타일 상세 조회
  // 갤러리, 랭킹에서 스타일을 클릭할 경우 스타일 상세 조회가 가능합니다.
  // 이미지(여러장 가능), 제목, 닉네임, 태그, 스타일 구성, 스타일 설명, 조회수, 큐레이팅수가 표시됩니다.
  // 해당 스타일의 큐레이팅 목록이 표시됩니다.
  findStyle = async (req, res, next) => {
    try {
      // 경로 파라미터에서 스타일 ID 추출
      const styleId = req.params.styleId;

      const findStyle = await StyleService.findStyle(styleId);
      return res.status(200).json(findStyle);
    } catch (e) {
      next(e);
    }
  };

  // POST /style: 새로운 스타일 게시물을 등록합니다.
  postStyle = async (req, res, next) => {
    try {
      // 유효성 검사 미들웨어를 통과한 데이터
      const {
        nickname,
        title,
        content,
        password,
        categories,
        tags,
        imageUrls,
      } = req.body;

      // 인스턴스를 통해 POST 메서드를 호출
      const createdStyle = await StyleService.postStyle({
        nickname,
        title,
        content,
        password,
        categories,
        tags,
        imageUrls,
      });

      // 응답 데이터에서 비밀번호 필드 제거 (보안)
      const { password: _, ...responseStyle } = createdStyle;

      return res.status(201).json(responseStyle);
    } catch (error) {
      next(error);
    }
  };
}

export default new StyleController();

// // 스타일 수정 API
// updateStyle = async (req, res, next) => {
//    try {
//       const { id } = req.params;
//       const { password, ...updateData } = req.body; // password와 나머지 수정 데이터 분리

//       if (!password) {
//          throw new Error("비밀번호를 입력해주세요."); // 혹은 CustomError 사용
//       }

//       const updatedStyle = await this.styleService.updateStyle(id, password, updateData);

//       return res.status(200).json({ data: updatedStyle });
//    } catch (error) {
//       next(error); // Global Error Handler로 전달
//    }
// };

// // 스타일 삭제 API
// deleteStyle = async (req, res, next) => {
//    try {
//       const { id } = req.params;
//       const { password } = req.body;

//       if (!password) {
//          throw new Error("비밀번호를 입력해주세요.");
//       }

//       const deletedStyle = await this.styleService.deleteStyle(id, password);

//       return res.status(200).json({
//          message: "스타일이 삭제되었습니다.",
//          id: deletedStyle.id,
//       });
//    } catch (error) {
//       next(error); // Global Error Handler로 전달
//    }
// };

// updateStyle = async (req, res, next) => {
//    /* ... */
// };
// deleteStyle = async (req, res, next) => {
//    /* ... */
// };
