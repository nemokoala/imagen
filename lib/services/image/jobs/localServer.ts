/**
 * 집 AI 서버(ComfyUI·A1111) 호출에서 나는 실패를 두 종류로 나눈다.
 * 워커는 이 구분으로 "대기열로 되돌릴지"와 "실패로 끝내고 환불할지"를 정한다.
 */

/** 서버에 닿지 않는다(꺼짐·네트워크·중간에 끊김). 작업을 대기열로 되돌린다. */
export class LocalServerUnavailableError extends Error {
  constructor(message = "로컬 AI 서버에 연결할 수 없습니다.", options?: ErrorOptions) {
    super(message, options);
    this.name = "LocalServerUnavailableError";
  }
}

/** 서버는 응답했지만 생성이 실패했다. 메시지는 사용자에게 그대로 보인다. */
export class GenerationFailedError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "GenerationFailedError";
  }
}

// 리버스 프록시를 거칠 때 서버가 꺼져 있으면 이 상태 코드가 온다.
const UNAVAILABLE_STATUSES = new Set([502, 503, 504]);

export async function localFetch(
  url: string | URL,
  { timeoutMs = 30_000, ...init }: RequestInit & { timeoutMs?: number } = {},
): Promise<Response> {
  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    throw new LocalServerUnavailableError(undefined, { cause: error });
  }

  if (UNAVAILABLE_STATUSES.has(response.status)) {
    throw new LocalServerUnavailableError(
      `로컬 AI 서버가 응답하지 않습니다. (${response.status})`,
    );
  }
  return response;
}

// 본문을 받는 도중 서버가 꺼지면 fetch가 아니라 본문 읽기에서 에러가 난다.
export async function readLocalJson<T>(response: Response): Promise<T> {
  let text: string;
  try {
    text = await response.text();
  } catch (error) {
    throw new LocalServerUnavailableError(
      "AI 서버 응답을 받는 중 연결이 끊겼습니다.",
      { cause: error },
    );
  }

  try {
    return JSON.parse(text) as T;
  } catch (error) {
    throw new GenerationFailedError("AI 서버 응답을 해석하지 못했습니다.", {
      cause: error,
    });
  }
}

export async function readLocalBuffer(response: Response): Promise<Buffer> {
  try {
    return Buffer.from(await response.arrayBuffer());
  } catch (error) {
    throw new LocalServerUnavailableError(
      "생성된 이미지를 받는 중 연결이 끊겼습니다.",
      { cause: error },
    );
  }
}
