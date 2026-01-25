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
