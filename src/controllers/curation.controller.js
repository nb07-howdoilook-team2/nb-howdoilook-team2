import curationService from "../services/curation.service.js";
import { BadRequestError, ForbiddenError, NotFoundError } from "../utils/CustomError.js";
// 서비스 계층 임포트
// 필요한 경우, 커스텀 에러 클래스 임포트 (여기서는 서비스에서 던지므로 생략 가능)

// 헬퍼 함수: 페이지네이션 쿼리 파싱
const parsePagination = (query) => {
   const page = parseInt(query.page) || 1;
   const pageSize = parseInt(query.pageSize) || 10;
   const skip = (page - 1) * pageSize;
   const take = pageSize;
   return { skip, take, page, pageSize };
};

// ------------------------------------
// 1. 큐레이팅 등록 (POST)
// ------------------------------------
const createCurationController = async (req, res, next) => {
   try {
      // 스타일 ID는 경로에서, 나머지 데이터는 본문에서 추출
      const { styleId } = req.params;
      const curationData = req.body;

      // 서비스 호출
      const newCuration = await curationService.createCuration({
         styleId: styleId,
         ...curationData,
      });

      // 성공 응답 (201 Created)
      // 비밀번호 해시 값 등 민감 정보는 응답에서 제외하는 것이 좋습니다.
      const { password, ...safeCurationData } = newCuration;

      return res.status(201).json({
         message: "큐레이팅이 성공적으로 등록되었습니다.",
         data: safeCurationData,
      });
   } catch (error) {
      // 서비스에서 발생한 에러를 다음 미들웨어(에러 핸들러)로 전달
      next(error);
   }
};

// ------------------------------------
// 2. 큐레이팅 수정 (PUT)
// ------------------------------------
const updateCurationController = async (req, res, next) => {
   try {
      // 큐레이션 ID는 경로에서 추출
      const { curationId } = req.params;
      // 비밀번호와 수정할 데이터는 본문에서 추출
      const { password: inputPassword, ...updateData } = req.body;

      // 필수 값 검증 (비밀번호는 수정/삭제의 핵심 검증 값입니다.)
      // 입력한 비밀번호가 없을 때
      if (!inputPassword) {
         // 400 Not Found
         throw new BadRequestError("비밀번호를 입력해 주세요.");
      }

      // 서비스 호출
      const updatedCuration = await curationService.updateCuration(curationId, inputPassword, updateData);

      // 성공 응답 (200 OK)
      // 비밀번호 해시 값은 제외하고 응답
      const { password, ...safeCurationData } = updatedCuration;

      return res.status(200).json({
         message: "큐레이팅이 성공적으로 수정되었습니다.",
         data: safeCurationData,
      });
   } catch (error) {
      next(error);
   }
};

// ------------------------------------
// 3. 큐레이팅 삭제 (DELETE)
// ------------------------------------
const deleteCurationController = async (req, res, next) => {
   try {
      // 큐레이션 ID는 경로에서, 비밀번호는 본문에서 추출
      const { curationId } = req.params;
      const { password: inputPassword } = req.body;

      // 필수 값 검증 (비밀번호는 수정/삭제의 핵심 검증 값입니다.)
      // 입력한 비밀번호가 없을 때
      if (!inputPassword) {
         // 400 Not Found
         throw new BadRequestError("비밀번호를 입력해 주세요.");
      }

      // 서비스 호출
      const message = await curationService.deleteCuration(curationId, inputPassword);

      // 성공 응답 (204 No Content - 내용 없이 성공)
      return res.status(204).json({ message });
   } catch (error) {
      next(error);
   }
};

// ------------------------------------
// 4. 큐레이팅 목록 조회 (GET)
// ------------------------------------
const getCurationListController = async (req, res, next) => {
   try {
      // 경로, 쿼리 파라미터에서 값 추출
      const { styleId } = req.params;
      const { keyword } = req.query; // 닉네임, 내용 검색 키워드

      // 페이지네이션 값 파싱 (기본값: page=1, pageSize=10)
      const pagination = parsePagination(req.query);

      // 서비스 호출
      const curationList = await curationService.getCurationList({
         styleId,
         keyword,
         pagination,
      });

      // 성공 응답 (200 OK)
      return res.status(200).json({
         message: "큐레이팅 목록 조회가 완료되었습니다.",
         data: curationList,
         pagination: {
            page: pagination.page,
            pageSize: pagination.pageSize,
         },
      });
   } catch (error) {
      next(error);
   }
};

// ------------------------------------
// 컨트롤러 모듈 내보내기
// ------------------------------------
export default {
   createCurationController,
   updateCurationController,
   deleteCurationController,
   getCurationListController,
};
