import {
  getStylesService,
  findStyleService,
  //StyleService,
} from "../services/style.service.js";

// 스타일 목록 조회
// 갤러리 상단에 인기 태그가 표시됩니다. 해당 태그를 클릭하면 그 태그에 해당하는 스타일 목록이 표시됩니다.
// 최신순, 조회순, 큐레이팅순(큐레이팅 많은 순)으로 정렬 가능합니다.
// 닉네임, 제목, 상세, 태그로 검색이 가능합니다.
export const getStylesController = async (req, res, next) => {
  try {
    //페이지네이션
    const { page = 1, limit = 10, sort = "latest" } = req.query;

    const styles = await getStylesService({
      page: Number(page),
      limit: Number(limit),
      sort,
    });

    return res.status(200).json(styles);
  } catch (e) {
    next(e);
  }
};

// 스타일 상세 조회
// 갤러리, 랭킹에서 스타일을 클릭할 경우 스타일 상세 조회가 가능합니다.
// 이미지(여러장 가능), 제목, 닉네임, 태그, 스타일 구성, 스타일 설명, 조회수, 큐레이팅수가 표시됩니다.
// 해당 스타일의 큐레이팅 목록이 표시됩니다.
export const findStyleController = async (req, res, next) => {
  try {
    const styleId = req.params.id;
    const findStyle = await findStyleService(styleId);
    return res.status(200).json(findStyle);
  } catch (e) {
    next(e);
  }
};

// 에러때문에 주석 처리
// class StyleController {
//   static async createStyle(req, res, next) {
//     const data = req.body;

//     try {
//       const newStyle = await StyleService.register(data);

//       return res.status(201).json({
//         message: "스타일 등록 성공",
//         data: newStyle,
//       });
//     } catch (error) {
//       next(error);
//     }
//   }
// }

// export default StyleController;
