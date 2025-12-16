import prisma from "../../prisma/prisma.js";

export class Curation {
  constructor(
    id,
    nickname,
    content,
    trendy,
    personality,
    practicality,
    costEffectiveness,

    password,
    createdAt
  ) {
    this.id = id;
    this.nickname = nickname;
    this.content = content;
    this.trndyScore = trendy;
    this.personality = personality;
    this.practicality = practicality;
    this.costEffectiveness = costEffectiveness;

    this.password = password;
    this.createdAt = createdAt;
  }
}

const curationRepository = {
  // ------------------------------------
  // 큐레이션 생성 (CREATE)
  // ------------------------------------
  create: async (curationData) => {
    // Prisma의 create 메서드를 사용하여 데이터를 삽입합니다.
    return prisma.curation.create({
      data: curationData,
    });
  },
  // ------------------------------------
  // 큐레이션 id 찾기
  // ------------------------------------
  findById: async (curationId) => {
    return prisma.curation.findUnique({
      where: { id: curationId },
    });
  },

  // ------------------------------------
  // 큐레이션 수정 (UPDATE)
  // ------------------------------------
  update: async (curationId, updateData) => {
    // updateData에서 비밀번호 필드는 제외되어야 합니다 (수정 시 변경되면 안됨)
    // ... 실제 수정 로직 (Prisma update)
    return prisma.curation.update({
      where: { id: curationId },
      data: updateData,
    });
  },
  // ------------------------------------
  // 큐레이션 삭제 (DELETE)
  // ------------------------------------
  delete: async (curationId) => {
    // 비밀번호 검증 후 Service에서 호출되므로, 여기서는 바로 삭제합니다.
    // 큐레이션 삭제 시 연결된 답글도 같이 삭제되도록 DB 스키마에 CASCADE 옵션을 설정해야 합니다.
    return prisma.curation.delete({
      where: { id: curationId },
    });
  },
  // ------------------------------------
  // 큐레이션 개수 조회 (COUNT)
  // ------------------------------------
  count: async ({ where }) => {
    return prisma.curation.count({
      where: where,
    });
  },
  // ------------------------------------
  // 큐레이팅 목록 조회 (READ LIST)
  // ------------------------------------
  findList: async ({
    where,
    skip = 0,
    take = 10,
    orderBy = { createdAt: "desc" },
  }) => {
    // 큐레이션 목록 요구사항: 점수 4가지, 한줄 큐레이팅, 닉네임, 답글 포함
    return prisma.curation.findMany({
      // 1. 필터링 및 검색 조건 적용
      where: where,

      // 2. 필요한 필드만 선택 (비밀번호 제외 및 답글 포함)
      select: {
        id: true,
        nickname: true,
        content: true, // 한줄평
        trendy: true, // 트렌디 점수
        personality: true, // 개성 점수
        practicality: true, // 실용성 점수
        costEffectiveness: true, // 가성비 점수
        createdAt: true,

        // 큐레이팅에 남겨진 답글도 같이 조회됩니다.
        reply: {
          // 관계 이름이 'comment'라고 가정
          select: {
            id: true,
            nickname: true, // 답글 목록 조회 요구사항
            content: true, // 답글 목록 조회 요구사항
            createdAt: true,
          },
        },
        // 비밀번호(password)는 민감 정보이므로 제외
      },

      // 3. 페이지네이션 및 정렬 적용
      skip: skip,
      take: take,
      orderBy: orderBy,
    });
  },

  findByStyleId: async (styleId) => {
    return prisma.curation.findMany({
      where: { styleId: BigInt(styleId) },
      select: {
        trendy: true,
        personality: true,
        practicality: true,
        costEffectiveness: true,
      },
    });
  },
  // ... create, delete 등의 다른 DB 접근 함수
};

export default curationRepository;
