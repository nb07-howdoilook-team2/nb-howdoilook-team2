// prisma/db/seed/seed.js
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";

const { Pool } = pkg;

// PostgreSQL 연결 풀 생성
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// PrismaPg 어댑터 생성
const adapter = new PrismaPg(pool);

// PrismaClient 생성 (Prisma 7에서는 adapter 필수)
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.style.createMany({
    data: [
      {
        nickname: "user01",
        title: "캐주얼 룩",
        content: "편안하고 데일리하게 입을 수 있는 캐주얼 스타일입니다.",
        password: "1234",
        thumbnail: "https://example.com/thumb1.jpg",
        categories: ["casual", "daily"], // Json 필드
        tags: ["데일리", "캐주얼"],
        imageUrls: [
          "https://example.com/style1-1.jpg",
          "https://example.com/style1-2.jpg",
        ],
      },
      {
        nickname: "user02",
        title: "스트릿 감성 코디",
        content: "오버핏과 레이어드로 멋을 낸 스트릿 패션.",
        password: "abcd",
        thumbnail: "https://example.com/thumb2.jpg",
        categories: ["street", "hiphop"],
        tags: ["스트릿", "오버핏"],
        imageUrls: ["https://example.com/style2-1.jpg"],
      },
      {
        nickname: "user03",
        title: "미니멀 모던 스타일",
        content: "심플하고 단정한 미니멀 감성의 패션.",
        password: "pass123",
        categories: ["minimal"],
        tags: ["미니멀", "모던"],
        thumbnail: null,
        imageUrls: [],
      },
    ],
  });
  console.log("🌱 Seed data inserted successfully!");
}

// 2. Curation 등록을 위해 Style ID 가져오기
// '캐주얼 기본 코디' 스타일의 ID를 조회합니다.
const casualStyle = await prisma.style.findFirst({
  where: { title: "스트릿 감성 코디" },
  select: { id: true },
});

if (casualStyle) {
  const styleId = casualStyle.id;

  // 3. Curation 데이터 삽입
  await prisma.curation.createMany({
    data: [
      {
        styleId: styleId, // 위에서 찾은 Style ID 사용
        nickname: "Curator1",
        content: "데일리룩으로 만점입니다!",
        trendy: 5, // BigInt 타입 (숫자로 입력)
        personality: 3,
        practicality: 4,
        costEffectiveness: 5,
        createdAt: new Date(),
        password: "curate_pass1",
      },
      {
        styleId: styleId, // 같은 Style ID 사용
        nickname: "Curator2",
        content: "개성이 돋보이지만 가격은 조금 아쉽네요.",
        trendy: 4,
        personality: 5,
        practicality: 3,
        costEffectiveness: 4,
        createdAt: new Date(),
        password: "curate_pass2",
      },
    ],
  });
  console.log(`✅ Curation added for Style ID: ${styleId}`);
} else {
  console.log("⚠️ Target Style not found for Curation.");
}

main()
  .catch((err) => {
    console.error("❌ Seed failed:");
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
