import prisma from "../../prisma/prisma.js";
import curationRepository from "../repositories/curation.repository.js";
import bcrypt from "bcrypt"; // 비밀번호 해시 비교 라이브러리
import { ValidationError, ForbiddenError, NotFoundError } from "../utils/CustomError.js";
// DB에 비밀번호 넣어두고 그거랑 비교
// // 실제 DB 모듈을 불러온다고 가정합니다. (예: Mongoose 모델, Sequelize 모델 등)

// **큐레이팅 등록**
// - 트렌디, 개성, 실용성, 가성비 점수와 한줄 큐레이팅, 닉네임, 비밀번호를 입력하여 큐레이팅을 등록합니다.
// /styles/{styleId}/curations
const createCuration = async ({ styleId, ...curationData }) => {
   // 1. 필수 값 검증 (API 경로에 styleId가 포함되므로 필수 조건입니다.)
   // 400 error
   if (!styleId) {
      throw new ValidationError("잘못된 요청입니다.");
   }
   // 2. 비밀번호 해싱 (DB에 저장하기 전에 필수)
   const hashedPassword = await bcrypt.hash(curationData.password, 10);
   // 3. Repository를 호출하여 DB에 저장
   const newCuration = await curationRepository.create({
      ...curationData,
      styleId: styleId,
      password: hashedPassword, // 해시된 비밀번호 저장
   });

   return newCuration;
};

// 큐레이션 수정 로직 (비밀번호 검증 포함)
// /curations/{curationId}
const updateCuration = async (curationId, inputPassword, updateData) => {
   // 1. 해당 ID의 큐레이션 정보를 DB에서 조회
   // curation.repository의 findById 사용
   const curationInfo = await curationRepository.findById(curationId);
   // 컨트롤러와 서비스 양쪽에서 유사한 검증을 수행하는 것이 중복으로 보일 수 있지만, 이는 애플리케이션의 책임 분리 원칙을 지키기 위한 일반적이고 바람직한 설계 방식
   // ⚠️ 큐레이션이 DB에 실제로 존재하는지 확인
   // 404 Error
   if (!curationInfo) {
      throw new NotFoundError("존재하지 않습니다.");
   }
   // 2. 비밀번호 검증 (핵심 조건)
   // DB에 저장된 해시된 비밀번호(curation.password)와 사용자 입력 비밀번호(inputPassword) 비교
   const isPasswordMatch = await bcrypt.compare(inputPassword, curationInfo.password);

   // 비밀번호 입력했는지 검증
   if (!inputPassword) {
      // 400 Error
      throw new ValidationError("잘못된 요청입니다.");
   }

   // 2-1. 비밀번호가 일치하지 않는 경우
   if (!isPasswordMatch) {
      // 403 Forbidden
      throw new ForbiddenError("비밀번호가 틀렸습니다.");
   }

   // 3. 비밀번호가 일치하면 큐레이션 데이터 수정
   const updatedCuration = await curationRepository.update(curationId, updateData);

   return updatedCuration;
};

// 큐레이팅 삭제 ( 비밀번호 검증 포함 )
// /curations/{curationId}
const deleteCuration = async (curationId, inputPassword) => {
   // 큐레이션 정보 조회
   // 큐레이션 id 검증은 curation.controller.js
   const curationInfo = await curationRepository.findById(curationId);

   // 비밀번호를 입력하여 큐레이팅 등록 시 입력했던 비밀번호와 일치할 경우 큐레이팅 삭제가 가능합니다.
   const isPasswordMatch = await bcrypt.compare(inputPassword, curationInfo.password);

   // 비밀번호 입력했는지 검증
   if (!inputPassword) {
      // 400 Error
      throw new ValidationError("잘못된 요청입니다.");
   }

   // 비밀번호가 일치하지 않을 때
   if (!isPasswordMatch) {
      // 403 Forbidden
      throw new ForbiddenError("비밀번호가 틀렸습니다.");
   }

   // 큐레이션 삭제
   await curationRepository.delete(curationId);
   return "큐레이팅 삭제 성공";
};

// ------------------------------------
// 큐레이팅 목록 조회 (READ LIST)
// ------------------------------------

// (GET /styles/{styleId}/curations)
const getCurationList = async ({ styleId, pagination, keyword }) => {
   // API 명세 (GET /styles/{styleId}/curations)에 따라 styleId는 필수 필터
   if (!styleId) {
      // 400 Error
      throw new ValidationError("잘못된 요청입니다.");
   }

   // 2. Repository로 전달할 검색 및 필터링 조건 (where) 객체 생성
   const whereCondition = {
      styleId: Number(styleId), // ID는 숫자로 변환하여 사용
   };
   /* 2-1. 스타일 필터링 조건 추가
   스타일을 조회할 경우 그 스타일에 해당되는 큐레이팅 목록이 같이 조회됩니다.
   */
   //whereCondition.styleId = styleId;

   // 2-2. 닉네임 또는 내용 검색 조건 추가 (문제 조건: 닉네임, 내용(한줄평)으로 검색이 가능합니다.)
   if (keyword) {
      // insensitive 모드는 데이터베이스 검색 시 대소문자(Case)를 구별하지 않도록 지시하는 옵션
      whereCondition.OR = [
         { nickname: { contains: keyword, mode: "insensitive" } },
         { content: { contains: keyword, mode: "insensitive" } },
      ];
   }

   // 3. Repository 호출:
   //    a) 조건에 맞는 큐레이션 목록 조회
   //    b) 조건에 맞는 큐레이션 전체 개수 조회 (페이지네이션 계산용)
   const [list, totalItemCount] = await Promise.all([
      // findList로 API 명세 조건에 맞게 출력함 ( curation.repository.js 참조 )
      curationRepository.findList({
         where: whereCondition,
         skip: pagination.skip,
         take: pagination.take,
         orderBy: { createdAt: "desc" },
      }),
      curationRepository.count({ where: whereCondition }), // 전체 개수 조회
   ]);

   // 4. 페이지네이션 계산
   const totalPages = Math.ceil(totalItemCount / pagination.pageSize);

   // 5. 요청한 응답 형식에 맞게 데이터 반환
   return {
      currentPage: pagination.page,
      totalPages: totalPages,
      totalItemCount: totalItemCount,
      data: list, // 쉼표 구분은 JSON 표준이 자동으로 처리
   };
   // 4. 결과 반환 (Repository가 이미 답글을 포함하고, 점수/닉네임 등 필요한 필드만 반환했다고 가정)
};

export default {
   updateCuration,
   createCuration,
   getCurationList,
   deleteCuration,
};
