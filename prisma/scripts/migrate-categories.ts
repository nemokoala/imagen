import { PrismaClient } from "../../lib/generated/prisma";

const prisma = new PrismaClient();

// 환경변수에서 Ollama URL 가져오기
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || "http://localhost:11434";

/**
 * DB에서 현재 사용 가능한 카테고리 slug 목록 조회
 */
async function getAvailableCategorySlugs(): Promise<string[]> {
  const categories = await prisma.category.findMany({
    select: { slug: true },
  });
  return categories.map((c) => c.slug);
}

/**
 * Ollama AI를 사용해 프롬프트를 분석하고 카테고리 추천
 */
async function classifyPrompt(
  prompt: string,
  availableCategories: string[],
): Promise<string[]> {
  const systemPrompt = `
You are an assistant that classifies image prompts into categories.

Available categories (use slug values): ${availableCategories.join(", ")}

Rules for categories:
- Select 1-3 most relevant categories from the available list.
- Use the slug values (e.g., "landscape", "portrait", "animal").
- Only select categories that strongly match the content.
- If no category matches well, return an empty array.

Always respond in JSON format:
{
  "categories": ["<category_slug1>", "<category_slug2>"]
}

Prompt to classify:
${prompt}
`;

  try {
    const response = await fetch(`${OLLAMA_API_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma3:4b",
        prompt: systemPrompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      console.error(`  ⚠️ Ollama API 오류: ${response.status}`);
      return [];
    }

    const data = await response.json();

    if (!data.response) {
      return [];
    }

    // JSON 응답 파싱
    const jsonMatch = data.response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return [];
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // 유효한 카테고리만 필터링
    const validCategories = (parsed.categories || []).filter((cat: string) =>
      availableCategories.includes(cat.toLowerCase().trim()),
    );

    return validCategories.map((c: string) => c.toLowerCase().trim());
  } catch (error) {
    console.error(`  ⚠️ 분류 실패:`, error);
    return [];
  }
}

/**
 * 카테고리가 없는 이미지에 카테고리 마이그레이션
 */
async function migrateCategories() {
  console.log("🔄 기존 이미지 카테고리 마이그레이션 시작...\n");

  // 1. 사용 가능한 카테고리 목록 조회
  const availableCategories = await getAvailableCategorySlugs();
  console.log(`📋 사용 가능한 카테고리: ${availableCategories.join(", ")}\n`);

  if (availableCategories.length === 0) {
    console.log(
      "⚠️ 카테고리가 없습니다. 먼저 seed-categories.ts를 실행하세요.",
    );
    console.log("   npx tsx prisma/seed-categories.ts");
    return;
  }

  // 2. 카테고리가 없는 이미지 조회
  const imagesWithoutCategories = await prisma.generatedImage.findMany({
    where: {
      categories: {
        none: {},
      },
    },
    select: {
      id: true,
      prompt: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  console.log(
    `📸 카테고리 미설정 이미지 수: ${imagesWithoutCategories.length}개\n`,
  );

  if (imagesWithoutCategories.length === 0) {
    console.log("✅ 모든 이미지에 카테고리가 설정되어 있습니다.");
    return;
  }

  // 3. 카테고리 slug -> id 매핑 미리 조회
  const categoryMap = await prisma.category.findMany({
    select: { id: true, slug: true },
  });
  const slugToId: Record<string, number> = {};
  for (const cat of categoryMap) {
    slugToId[cat.slug] = cat.id;
  }

  // 4. 각 이미지에 대해 카테고리 분류 및 업데이트
  let successCount = 0;
  let skipCount = 0;

  for (let i = 0; i < imagesWithoutCategories.length; i++) {
    const image = imagesWithoutCategories[i];
    const progress = `[${i + 1}/${imagesWithoutCategories.length}]`;

    console.log(`${progress} ID ${image.id} 분석 중...`);
    console.log(`  프롬프트: ${image.prompt.substring(0, 100)}...`);

    // AI로 카테고리 분류
    const categorySlugs = await classifyPrompt(
      image.prompt,
      availableCategories,
    );

    if (categorySlugs.length === 0) {
      console.log(`  ⏭️ 매칭되는 카테고리 없음, 건너뜀\n`);
      skipCount++;
      continue;
    }

    // 카테고리 ID로 변환
    const categoryIds = categorySlugs
      .map((slug) => slugToId[slug])
      .filter((id) => id !== undefined);

    // 이미지에 카테고리 연결
    await prisma.generatedImage.update({
      where: { id: image.id },
      data: {
        categories: {
          connect: categoryIds.map((id) => ({ id })),
        },
      },
    });

    console.log(`  ✅ 카테고리 설정: ${categorySlugs.join(", ")}\n`);
    successCount++;

    // Rate limiting - Ollama 과부하 방지
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log("\n🎉 마이그레이션 완료!");
  console.log(`  - 성공: ${successCount}개`);
  console.log(`  - 건너뜀: ${skipCount}개`);
}

// 드라이런 모드 (실제 업데이트 없이 분류 결과만 확인)
async function dryRun() {
  console.log("🔍 드라이런 모드 - 실제 업데이트 없이 분류 결과만 확인\n");

  const availableCategories = await getAvailableCategorySlugs();
  console.log(`📋 사용 가능한 카테고리: ${availableCategories.join(", ")}\n`);

  const imagesWithoutCategories = await prisma.generatedImage.findMany({
    where: {
      categories: {
        none: {},
      },
    },
    select: {
      id: true,
      prompt: true,
    },
    take: 5, // 테스트로 5개만
    orderBy: {
      id: "asc",
    },
  });

  console.log(`📸 샘플 이미지 ${imagesWithoutCategories.length}개 분석...\n`);

  for (const image of imagesWithoutCategories) {
    console.log(`ID ${image.id}:`);
    console.log(`  프롬프트: ${image.prompt.substring(0, 100)}...`);

    const categorySlugs = await classifyPrompt(
      image.prompt,
      availableCategories,
    );
    console.log(
      `  추천 카테고리: ${categorySlugs.length > 0 ? categorySlugs.join(", ") : "(없음)"}\n`,
    );

    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

// 명령어 인자 확인
const args = process.argv.slice(2);
const isDryRun = args.includes("--dry-run");

if (isDryRun) {
  dryRun()
    .catch((e) => {
      console.error("❌ 드라이런 실패:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
} else {
  migrateCategories()
    .catch((e) => {
      console.error("❌ 마이그레이션 실패:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

// 사용법:
// 드라이런 (테스트): npx tsx prisma/migrate-categories.ts --dry-run
// 실제 실행: npx tsx prisma/migrate-categories.ts
