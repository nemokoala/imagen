import { useUserStore } from "@/stores/userStore";
import { removeCookie } from "./action";

// 토큰 갱신 중인지 추적 (동시 다발적 요청 시 중복 갱신 방지)
let isRefreshing = false;

const handleFetch = async (
  endpoint: string,
  options: RequestInit,
  isRetry = false
): Promise<unknown> => {
  // 상대 경로 사용 (www/non-www 모두 동일한 도메인으로 요청)
  const apiUrl = "";

  const response = await fetch(`${apiUrl}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  // 401 에러 && 첫 시도일 때만 토큰 갱신 후 재시도
  if (response.status === 401 && !isRetry) {
    const refreshed = await refreshToken();
    if (refreshed) {
      // 토큰 갱신 성공 -> 재시도 (isRetry=true로 설정하여 무한 재귀 방지)
      return handleFetch(endpoint, options, true);
    }
    // 토큰 갱신 실패 -> 에러 던지기
  }

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.message || "요청에 실패했습니다";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  return data;
};

// 토큰 갱신 함수 (단순화)
const refreshToken = async (): Promise<boolean> => {
  // 이미 갱신 중이면 대기
  if (isRefreshing) {
    return false;
  }

  isRefreshing = true;

  try {
    // 상대 경로 사용 (www/non-www 모두 동일한 도메인으로 요청)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

    const response = await fetch(`${apiUrl}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.ok) {
      return true;
    }

    // refresh 실패 시 쿠키 삭제
    useUserStore.getState().logout();
    await removeCookie("refreshToken");
    return false;
  } catch (error) {
    console.error("토큰 갱신 실패:", error);
    await removeCookie("refreshToken");
    return false;
  } finally {
    isRefreshing = false;
  }
};

export const FetchUtil = {
  get: async (endpoint: string) => {
    return handleFetch(endpoint, { method: "GET" });
  },

  post: async <T>(endpoint: string, data: T, options: RequestInit = {}) => {
    return handleFetch(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
      ...options,
    });
  },

  put: async <T>(endpoint: string, data: T, options: RequestInit = {}) => {
    return handleFetch(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
      ...options,
    });
  },

  patch: async <T>(endpoint: string, data: T, options: RequestInit = {}) => {
    return handleFetch(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
      ...options,
    });
  },

  delete: async <T>(endpoint: string, data: T, options: RequestInit = {}) => {
    return handleFetch(endpoint, {
      method: "DELETE",
      body: JSON.stringify(data),
      ...options,
    });
  },
};
