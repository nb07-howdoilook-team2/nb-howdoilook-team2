import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";

const { Pool } = pkg;

// PostgreSQL 연결 풀
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// PrismaPg 어댑터 생성
const adapter = new PrismaPg(pool);

// PrismaClient 생성
const prisma = new PrismaClient({ adapter });

async function main() {
  //   console.log("🔄 기존 데이터 삭제 중...");
  //   await prisma.reply.deleteMany();
  //   await prisma.curation.deleteMany();
  //   await prisma.style.deleteMany();

  console.log("🌱 스타일 데이터 생성 중...");

  await prisma.style.createMany({
    data: [
      // ⭐ STYLE 1 ─ 캐주얼
      {
        nickname: "user01",
        title: "캐주얼 데일리 룩",
        content: "편안하게 입을 수 있는 데일리 패션입니다.",
        password: "1234",
        thumbnail: "https://example.com/style1-thumb.jpg",
        tags: ["데일리", "캐주얼"],
        imageUrls: [
          "https://example.com/style1-1.jpg",
          "https://example.com/style1-2.jpg",
        ],
        categories: {
          top: { name: "나이키 후드티", brand: "Nike", price: 45000 },
          bottom: { name: "조거팬츠", brand: "Uniqlo", price: 39000 },
        },
      },

      // ⭐ STYLE 2 ─ 스트릿
      {
        nickname: "user02",
        title: "스트릿 감성 코디",
        content: "오버핏과 레이어드로 완성한 스트릿 스타일입니다.",
        password: "abcd",
        thumbnail: "https://example.com/style2-thumb.jpg",
        tags: ["스트릿", "오버핏"],
        imageUrls: ["https://example.com/style2-1.jpg"],
        categories: {
          top: { name: "오버핏 후드티", brand: "Stussy", price: 78000 },
          bottom: { name: "와이드 카고팬츠", brand: "Carhartt", price: 89000 },
        },
      },

      // ⭐ STYLE 3 ─ 미니멀
      {
        nickname: "user03",
        title: "미니멀 모던 스타일",
        content: "깔끔하고 세련된 미니멀 패션입니다.",
        password: "pass123",
        thumbnail: "https://example.com/style3-thumb.jpg",
        tags: ["미니멀", "모던"],
        imageUrls: ["https://example.com/style3-1.jpg"],
        categories: {
          top: { name: "라운드 니트", brand: "Cos", price: 65000 },
          bottom: {
            name: "투턱 슬랙스",
            brand: "Studio Nicholson",
            price: 129000,
          },
        },
      },

      // ⭐ STYLE 4 ─ 페미닌 룩
      {
        nickname: "user04",
        title: "페미닌 데이트 룩",
        content: "데이트에 어울리는 여성스러운 스타일입니다.",
        password: "qwer1234",
        thumbnail: "https://example.com/style4-thumb.jpg",
        tags: ["페미닌", "데이트룩"],
        imageUrls: [
          "https://example.com/style4-1.jpg",
          "https://example.com/style4-2.jpg",
        ],
        categories: {
          top: { name: "플라워 블라우스", brand: "Zara", price: 55000 },
          bottom: { name: "롱 스커트", brand: "H&M", price: 49000 },
        },
      },
    ],
  });

  console.log("✅ 스타일 생성 완료");

  // ⭐ 특정 스타일에 큐레이션 추가 (스트릿 스타일)
  const targetStyle = await prisma.style.findFirst({
    where: { title: "스트릿 감성 코디" },
    select: { id: true },
  });

  if (targetStyle) {
    const styleId = targetStyle.id;

    console.log(`🌱 Style(${styleId}) → Curation 생성`);

    await prisma.curation.createMany({
      data: [
        {
          styleId,
          nickname: "Curator1",
          content: "데일리룩으로 만점입니다!",
          trendy: 5,
          personality: 3,
          practicality: 4,
          costEffectiveness: 5,
          createdAt: new Date(),
          password: "curate_pass1",
        },
        {
          styleId,
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

    // Reply 달기 위한 첫 번째 큐레이션 가져오기
    const firstCuration = await prisma.curation.findFirst({
      where: { nickname: "Curator1" },
      select: { id: true },
    });

    if (firstCuration) {
      await prisma.reply.create({
        data: {
          curationId: firstCuration.id,
          content: "감사합니다. 이 코디는 특히 신경 썼어요!",
          nickname: "StyleCreator_Reply",
          password: "reply_pass",
        },
      });

      console.log(`💬 Reply 생성 완료 (curationId: ${firstCuration.id})`);
    }
  }

  console.log("🌱 Seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
