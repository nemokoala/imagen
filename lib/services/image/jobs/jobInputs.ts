import { randomUUID } from "crypto";
import { mkdir, readdir, readFile, rm, stat, writeFile } from "fs/promises";
import { join } from "path";
import { GenerationFailedError } from "./localServer";

/**
 * 편집 작업의 입력 이미지(원본·참고·마스크)를 AI 서버가 켜질 때까지 디스크에 둔다.
 * 배포 때 앱 폴더가 바뀌므로 생성 이미지와 같은 UPLOAD_PATH 아래에 두고,
 * /api/uploads가 이 폴더를 내보내지 않도록 서빙 라우트에서 막는다.
 */

export type EditImageMime = "image/png" | "image/jpeg" | "image/webp";

export interface EditUpload {
  data: Buffer;
  mimeType: EditImageMime;
}

export interface EditUploads {
  source: EditUpload;
  /** <image2>부터 순서대로 매핑되는 참고 이미지 */
  references: EditUpload[];
  /** 흰색 영역만 편집하는 마스크(PNG) */
  mask?: EditUpload;
}

interface StoredFile {
  file: string;
  mimeType: EditImageMime;
}

/** ImageJob.inputs에 저장하는 모양. 파일 이름만 두고 경로는 매번 다시 만든다. */
export interface EditJobInputs {
  dir: string;
  source: StoredFile;
  references: StoredFile[];
  mask?: StoredFile;
}

const EXTENSIONS: Record<EditImageMime, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};
// DB 값으로 경로를 만들기 때문에, 우리가 만든 이름 모양만 받아 경로 조작을 막는다.
const DIR_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const FILE_PATTERN = /^[a-z0-9-]+\.(png|jpg|webp)$/;

const uploadBaseDir = () => process.env.UPLOAD_PATH || join(process.cwd(), "uploads");
export const JOB_INPUTS_DIR_NAME = "job-inputs";
const inputsRoot = () => join(uploadBaseDir(), JOB_INPUTS_DIR_NAME);

const isMime = (value: unknown): value is EditImageMime =>
  typeof value === "string" && value in EXTENSIONS;

function toStoredFile(value: unknown): StoredFile | null {
  if (!value || typeof value !== "object") return null;
  const { file, mimeType } = value as Record<string, unknown>;
  return typeof file === "string" && FILE_PATTERN.test(file) && isMime(mimeType)
    ? { file, mimeType }
    : null;
}

/** DB에서 읽은 값을 검증해 돌려준다. 모양이 다르면 null. */
export function parseEditInputs(value: unknown): EditJobInputs | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  const source = toStoredFile(raw.source);
  const references = Array.isArray(raw.references)
    ? raw.references.map(toStoredFile)
    : null;
  const mask = raw.mask === undefined ? undefined : toStoredFile(raw.mask);
  if (
    typeof raw.dir !== "string" ||
    !DIR_PATTERN.test(raw.dir) ||
    !source ||
    !references ||
    references.some((item) => item === null) ||
    mask === null
  ) {
    return null;
  }
  return {
    dir: raw.dir,
    source,
    references: references as StoredFile[],
    ...(mask ? { mask } : {}),
  };
}

export async function saveEditInputs(uploads: EditUploads): Promise<EditJobInputs> {
  const dir = randomUUID();
  const path = join(inputsRoot(), dir);
  await mkdir(path, { recursive: true });

  const save = async (name: string, upload: EditUpload): Promise<StoredFile> => {
    const file = `${name}.${EXTENSIONS[upload.mimeType]}`;
    await writeFile(join(path, file), upload.data);
    return { file, mimeType: upload.mimeType };
  };

  try {
    const source = await save("source", uploads.source);
    const references: StoredFile[] = [];
    for (const [index, reference] of uploads.references.entries()) {
      references.push(await save(`reference-${index + 1}`, reference));
    }
    const mask = uploads.mask ? await save("mask", uploads.mask) : undefined;
    return { dir, source, references, ...(mask ? { mask } : {}) };
  } catch (error) {
    await rm(path, { recursive: true, force: true });
    throw error;
  }
}

export async function loadEditInputs(inputs: EditJobInputs): Promise<EditUploads> {
  const path = join(inputsRoot(), inputs.dir);
  const load = async ({ file, mimeType }: StoredFile): Promise<EditUpload> => {
    try {
      return { data: await readFile(join(path, file)), mimeType };
    } catch (error) {
      // 파일이 없으면 다시 시도해도 같으므로 바로 실패시키고 환불한다.
      throw new GenerationFailedError("편집할 이미지 파일을 찾지 못했습니다.", {
        cause: error,
      });
    }
  };

  return {
    source: await load(inputs.source),
    references: await Promise.all(inputs.references.map(load)),
    ...(inputs.mask ? { mask: await load(inputs.mask) } : {}),
  };
}

/** 작업이 끝나면 입력 파일을 지운다. 실패해도 작업 처리는 계속한다(남은 폴더는 정리 작업이 지운다). */
export async function deleteEditInputs(value: unknown): Promise<void> {
  const inputs = parseEditInputs(value);
  if (!inputs) return;
  try {
    await rm(join(inputsRoot(), inputs.dir), { recursive: true, force: true });
  } catch (error) {
    console.error("[image-job] 편집 입력 파일 삭제 실패:", inputs.dir, error);
  }
}

/**
 * 진행 중인 작업이 쓰지 않는 입력 폴더를 지운다(삭제 실패, 접수 도중 중단 등으로 남은 것).
 * 접수 직후 아직 DB에 기록되기 전인 폴더를 지우지 않도록 minAgeMs보다 오래된 것만 본다.
 */
export async function sweepOrphanEditInputs(
  activeDirs: ReadonlySet<string>,
  minAgeMs: number,
): Promise<number> {
  let entries: string[];
  try {
    entries = await readdir(inputsRoot());
  } catch {
    return 0;
  }

  let removed = 0;
  for (const dir of entries) {
    if (!DIR_PATTERN.test(dir) || activeDirs.has(dir)) continue;
    const path = join(inputsRoot(), dir);
    try {
      const { mtimeMs } = await stat(path);
      if (Date.now() - mtimeMs < minAgeMs) continue;
      await rm(path, { recursive: true, force: true });
      removed++;
    } catch (error) {
      console.error("[image-job] 남은 입력 폴더 정리 실패:", dir, error);
    }
  }
  return removed;
}
