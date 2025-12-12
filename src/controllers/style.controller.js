import {
  getStylesService,
  findStyleService,
  updateStyleService, // 추가
  deleteStyleService, // 추가
  createStyleService, // 💡 추가: POST 요청 처리를 위한 서비스 함수
} from "../services/style.service.js";

const serializeBigInt = (data) => {
  return JSON.parse(
    JSON.stringify(data, (_, value) =>
      // 값이 BigInt 타입이면 문자열로 변환
      typeof value === "bigint" ? value.toString() : value
    )
  );
};

// 스타일 목록 조회
// 갤러리 상단에 인기 태그가 표시됩니다. 해당 태그를 클릭하면 그 태그에 해당하는 스타일 목록이 표시됩니다.
// 최신순, 조회순, 큐레이팅순(큐레이팅 많은 순)으로 정렬 가능합니다.
// 닉네임, 제목, 상세, 태그로 검색이 가능합니다.
export const getStylesController = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = "latest", search, tag } = req.query;

    const styles = await getStylesService({
      page: Number(page),
      limit: Number(limit),
      sort,
      search,
      tag,
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
    const style = await findStyleService(styleId);
    if (!styleId) {
      return res.status(404).json({ message: "스타일을 찾을 수 없습니다." });
    }
    return res.status(200).json(style);
  } catch (e) {
    next(e);
  }
};

// 💡 스타일 수정 API Handler (추가)
export const updateStyleController = async (req, res, next) => {
  try {
    // styleId는 BigInt로 변환하기 위해 문자열로 받음
    const styleId = req.params.id;
    const { password, ...updateData } = req.body;

    // 비밀번호 필수 입력 체크 (400 Bad Request)
    if (!password || typeof password !== "string") {
      throw new ValidationError("비밀번호는 필수 입력 항목입니다.");
    }
    // TODO: PUT 요청의 updateData에 대한 유효성 검사 미들웨어 추가 필요

    // Service 레이어 호출
    const updatedStyle = await updateStyleService(
      styleId,
      password,
      updateData
    );

    // 응답 명세: 200 OK와 수정된 스타일 정보 반환
    return res.status(200).json(updatedStyle);
  } catch (error) {
    next(error); // Global Error Handler로 전달 (403, 404, 500)
  }
};

// 💡 스타일 삭제 API Handler (추가)
export const deleteStyleController = async (req, res, next) => {
  try {
    const styleId = req.params.id;
    const { password } = req.body;

    // 비밀번호 필수 입력 체크 (400 Bad Request)
    if (!password || typeof password !== "string") {
      throw new ValidationError("비밀번호는 필수 입력 항목입니다.");
    }

    // Service 레이어 호출
    await deleteStyleService(styleId, password);

    // 응답 명세: 200 OK와 메시지 반환
    return res.status(200).json({
      message: "스타일 삭제 성공",
    });
  } catch (error) {
    next(error); // Global Error Handler로 전달 (403, 404, 500)
  }
};

// createStyleController 함수 내부 수정
export const createStyleController = async (req, res, next) => {
  try {
    const styleData = req.body;
    // ...
    const newStyle = await createStyleService(styleData);

    // 🚨 새로 생성된 객체의 BigInt (ID)를 JSON 직렬화 가능하도록 변환
    const safeStyle = serializeBigInt(newStyle);

    return res.status(201).json({
      message: "스타일 등록 성공",
      data: safeStyle, // 💡 변환된 객체 사용
    });
  } catch (error) {
    next(error);
  }
};
