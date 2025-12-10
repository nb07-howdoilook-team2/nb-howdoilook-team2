import prisma from "../../prisma/prisma.js";

async function main() {
  await prisma.style.createMany({
    data: [
      {
        title: "캐주얼 기본 코디",
        nickname: "Mango",
        thumbnail: "thumbnail1.jpg",
        tags: ["데일리", "남친룩"],
        components: ["맨투맨", "데님 팬츠", "운동화"],
        description: "편하게 입기 좋은 캐주얼 룩입니다.",
        views: 10,
        curatedCount: 2,
        images: ["1.jpg", "2.jpg"],
      },
      {
        title: "스트릿 감성 코디",
        nickname: "Zero",
        thumbnail: "thumbnail2.jpg",
        tags: ["스트릿", "유니크"],
        components: ["후드티", "와이드팬츠", "스니커즈"],
        description: "스트릿 감성의 자유로운 스타일!",
        views: 25,
        curatedCount: 5,
        images: ["3.jpg", "4.jpg"],
      },
    ],
  });
}

main()
  .then(() => {
    console.log("🌱 Seed completed!");
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
