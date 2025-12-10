import prisma from "../../prisma/prisma.js";
import curationRepository from "../repositories/curation.repository.js";
import bcrypt from "bcrypt"; // 비밀번호 해시 비교 라이브러리
import {
  ValidationError,
  ForbiddenError,
  NotFoundError,
} from "../utils/CustomError.js";
// DB에 비밀번호 넣어두고 그거랑 비교
// // 실제 DB 모듈을 불러온다고 가정합니다. (예: Mongoose 모델, Sequelize 모델 등)

// **큐레이팅 등록**
// - 트렌디, 개성, 실용성, 가성비 점수와 한줄 큐레이팅, 닉네임, 비밀번호를 입력하여 큐레이팅을 등록합니다.
// /styles/{styleId}/curations
const createCuration = async ({ styleId, ...curationData }) => {
  // 1. 필수 값 검증 (API 경로에 styleId가 포함되므로 필수 조건입니다.)
  if (!styleId) {
    throw new CustomError("등록될 스타일 ID가 잘못 되었습니다.", 400);
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

  //   // 1-1. 큐레이션이 존재하지 않는 경우
  if (!curationInfo) {
    // 404 Not Found
    throw new NotFoundError();
  }

  // 2. 비밀번호 검증 (핵심 조건)
  // DB에 저장된 해시된 비밀번호(curation.password)와 사용자 입력 비밀번호(inputPassword) 비교
  const isPasswordMatch = await bcrypt.compare(
    inputPassword,
    curationInfo.password
  );

  // 2-1. 비밀번호가 일치하지 않는 경우
  if (!isPasswordMatch) {
    // 403 Forbidden
    throw new ForbiddenError();
  }

  // 3. 비밀번호가 일치하면 큐레이션 데이터 수정
  const updatedCuration = await curationRepository.update(
    curationId,
    updateData
  );

  return updatedCuration;
};

// 큐레이팅 삭제 ( 비밀번호 검증 포함 )
// /curations/{curationId}
const deleteCuration = async (curationId, inputPassword) => {
  // 비밀번호를 입력하여 큐레이팅 등록 시 입력했던 비밀번호와 일치할 경우 큐레이팅 삭제가 가능합니다.
  const curationInfo = await curationRepository.findById(curationId);

  if (!curationInfo) {
    // 404 Not Found
    throw new NotFoundError();
  }
  const isPasswordMatch = await bcrypt.compare(
    inputPassword,
    curationInfo.password
  );

  // 비밀번호가 일치하지 않을 때
  if (!isPasswordMatch) {
    // 403 Forbidden
    throw new ForbiddenError();
  }
  await curationRepository.delete(curationId);
  return `curationID ${curationId}이 삭제되었습니다.`;
};

// ------------------------------------
// 큐레이팅 목록 조회 (READ LIST)
// ------------------------------------

// (GET /styles/{styleId}/curations)
const getCurationList = async ({ styleId, keyword, pagination = {} }) => {
  // ★ 형식은 조금 더 고민
  // 1. 필수 값 검증 (API 경로에 styleId가 포함되므로 필수 조건.)
  if (!styleId) {
    // 400 Error
    throw new ValidationError("스타일 ID는 필수 입력 값입니다.");
  }

  // 2. Repository로 전달할 검색 및 필터링 조건 (where) 객체 생성
  const whereCondition = {
    styleId: Number(styleId), // ID는 숫자로 변환하여 사용
  };
  /* 2-1. 스타일 필터링 조건 추가
   스타일을 조회할 경우 그 스타일에 해당되는 큐레이팅 목록이 같이 조회됩니다.
   */
  whereCondition.styleId = styleId;
  // API 명세 (GET /styles/{styleId}/curations)에 따라 styleId는 필수 필터입니다.

  // 2-2. 닉네임 또는 내용 검색 조건 추가 (문제 조건: 닉네임, 내용으로 검색이 가능합니다.)
  // Prisma의 OR 쿼리를 사용하여 닉네임 또는 내용으로 검색
  // 닉네임 검색 ( 입력받은 키워드로 내용이나 닉네임 검색 )
  if (keyword) {
    // insensitive 모드는 데이터베이스 검색 시 대소문자(Case)를 구별하지 않도록 지시하는 옵션
    whereCondition.OR = [
      { postNickname: { contains: keyword, mode: "insensitive" } },
      { curationContent: { contains: keyword, mode: "insensitive" } },
      { oneLineReview: { contains: keyword, mode: "insensitive" } },
    ];
  }

  // 3. Repository 호출 (목록 조회 및 답글 포함 요청)
  const curationList = await curationRepository.findList({
    where: whereCondition,
    skip: pagination.skip,
    take: pagination.take,
    orderBy: { createdAt: "desc" }, // orderBy: [{ created_at: "desc" }, { id: "asc" }],
  });

  // 4. 결과 반환 (Repository가 이미 답글을 포함하고, 점수/닉네임 등 필요한 필드만 반환했다고 가정)
  return curationList;
};

export default {
  updateCuration,
  createCuration,
  getCurationList,
  deleteCuration,
};
