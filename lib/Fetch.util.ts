import { useUserStore } from "@/stores/userStore";
import { removeCookie } from "./action";

// 토큰 갱신 중인지 추적 (동시 다발적 요청 시 중복 갱신 방지)
let isRefreshing = false;

const handleFetchResponse = async (
  endpoint: string,
  options: RequestInit,
  isRetry = false,
): Promise<Response> => {
  const apiUrl = "";

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  } as Record<string, string>;

  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  const response = await fetch(`${apiUrl}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  // 401 에러 && 첫 시도일 때만 토큰 갱신 후 재시도
  if (response.status === 401 && !isRetry) {
    const refreshed = await refreshToken();
    if (refreshed) {
      return handleFetchResponse(endpoint, options, true);
    }
  }

  return response;
};

const handleFetchJSON = async (
  endpoint: string,
  options: RequestInit,
): Promise<unknown> => {
  const response = await handleFetchResponse(endpoint, options);
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
    // 항상 상대 경로 사용 (크로스 오리진 CORS 문제 방지)
    const response = await fetch(`/api/auth/refresh`, {
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
  get: async (endpoint: string, options: RequestInit = {}) => {
    return handleFetchJSON(endpoint, { method: "GET", ...options });
  },

  post: async <T>(endpoint: string, data: T, options: RequestInit = {}) => {
    const isFormData = data instanceof FormData;
    return handleFetchJSON(endpoint, {
      method: "POST",
      body: isFormData ? (data as BodyInit) : JSON.stringify(data),
      ...options,
    });
  },

  postRaw: async <T>(endpoint: string, data: T, options: RequestInit = {}) => {
    const isFormData = data instanceof FormData;
    return handleFetchResponse(endpoint, {
      method: "POST",
      body: isFormData ? (data as BodyInit) : JSON.stringify(data),
      ...options,
    });
  },

  put: async <T>(endpoint: string, data: T, options: RequestInit = {}) => {
    const isFormData = data instanceof FormData;
    return handleFetchJSON(endpoint, {
      method: "PUT",
      body: isFormData ? (data as BodyInit) : JSON.stringify(data),
      ...options,
    });
  },

  patch: async <T>(endpoint: string, data: T, options: RequestInit = {}) => {
    const isFormData = data instanceof FormData;
    return handleFetchJSON(endpoint, {
      method: "PATCH",
      body: isFormData ? (data as BodyInit) : JSON.stringify(data),
      ...options,
    });
  },

  delete: async <T>(endpoint: string, data: T, options: RequestInit = {}) => {
    const isFormData = data instanceof FormData;
    return handleFetchJSON(endpoint, {
      method: "DELETE",
      body: isFormData ? (data as BodyInit) : JSON.stringify(data),
      ...options,
    });
  },
};
