import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

const defaultCategories = [
  { name: "풍경", slug: "landscape" },
  { name: "인물", slug: "portrait" },
  { name: "동물", slug: "animal" },
  { name: "추상화", slug: "abstract" },
  { name: "판타지", slug: "fantasy" },
  { name: "SF", slug: "sci-fi" },
  { name: "음식", slug: "food" },
  { name: "건축", slug: "architecture" },
  { name: "자연", slug: "nature" },
  { name: "아트", slug: "art" },
  { name: "애니메이션", slug: "anime" },
  { name: "실사", slug: "realistic" },
  { name: "3D 렌더링", slug: "3d-render" },
  { name: "사이버펑크", slug: "cyberpunk" },
  { name: "캐릭터", slug: "character" },
  { name: "픽셀 아트", slug: "pixel-art" },
];

async function seedCategories() {
  console.log("🌱 카테고리 시드 시작...");

  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
    console.log(`  ✅ ${category.name} (${category.slug})`);
  }

  console.log("🎉 카테고리 시드 완료!");
}

seedCategories()
  .catch((e) => {
    console.error("❌ 카테고리 시드 실패:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// 아래 명령어 실행 시 카테고리 추가.
// npx tsx prisma/seed-categories.ts
