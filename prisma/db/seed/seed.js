import prisma from "../../prisma.js";

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
      skipDuplicates: true, // 중복 방지
   });
   // 2. Curation 등록을 위해 Style ID 가져오기
   // '캐주얼 기본 코디' 스타일의 ID를 조회합니다.
   const casualStyle = await prisma.style.findFirst({
      where: { title: "캐주얼 기본 코디" },
      select: { id: true },
   });

   if (casualStyle) {
      const styleId = casualStyle.id;

      // 3. Curation 데이터 삽입
      await prisma.curation.createMany({
         data: [
            {
               styleId: styleId, // 위에서 찾은 Style ID 사용
               trendyScore: 5, // BigInt 타입 (숫자로 입력)
               individualityScore: 3,
               practicalityScore: 4,
               costEffectivenessScore: 5,
               oneLineReview: "데일리룩으로 만점입니다!",
               postNickname: "Curator1",
               password: "curate_pass1",
            },
            {
               styleId: styleId, // 같은 Style ID 사용
               trendyScore: 4,
               individualityScore: 5,
               practicalityScore: 3,
               costEffectivenessScore: 4,
               oneLineReview: "개성이 돋보이지만 가격은 조금 아쉽네요.",
               postNickname: "Curator2",
               password: "curate_pass2",
            },
         ],
      });
      console.log(`✅ Curation added for Style ID: ${styleId}`);
   } else {
      console.log("⚠️ Target Style not found for Curation.");
   }
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
