import { getCookie, removeCookie } from "./action";

const handleFetch = async <T>(endpoint: string, options: RequestInit) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
      {
        ...options,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const data = await response.json();

    if (response.status === 401) {
      const tokenRefreshed = await getNewAccessToken();
      if (tokenRefreshed) {
        return await handleFetch(endpoint, options);
      }
    }

    if (!response.ok) {
      throw new Error(data.message || "데이터를 불러오는데 실패했습니다");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "서버와의 통신에 실패했습니다");
    }
    throw new Error("알 수 없는 오류가 발생했습니다");
  }
};

export const FetchUtil = {
  get: async (endpoint: string) => {
    return await handleFetch(endpoint, { method: "GET" });
  },

  post: async <T>(endpoint: string, data: T, options: RequestInit = {}) => {
    return await handleFetch(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
      ...options,
    });
  },

  put: async <T>(endpoint: string, data: T, options: RequestInit = {}) => {
    return await handleFetch(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
      ...options,
    });
  },

  delete: async <T>(endpoint: string, data: T, options: RequestInit = {}) => {
    return await handleFetch(endpoint, {
      method: "DELETE",
      body: JSON.stringify(data),
      ...options,
    });
  },
};

// 토큰 갱신 중인지 추적하는 변수
let tokenRefreshPromise: Promise<boolean> | null = null;
// 마지막 토큰 갱신 시간 추적
let lastTokenRefreshTime = 0;
// 쿨타임 설정 (5초 = 5000ms)
const TOKEN_REFRESH_COOLDOWN = 5000;

export const getNewAccessToken = async () => {
  const currentTime = Date.now();

  // 이미 토큰 갱신 중이라면 진행 중인 Promise를 반환
  if (tokenRefreshPromise) {
    return tokenRefreshPromise;
  }

  // 마지막 갱신 후 쿨타임이 지나지 않았다면 이전 결과 반환 (true로 가정)
  if (currentTime - lastTokenRefreshTime < TOKEN_REFRESH_COOLDOWN) {
    return true;
  }

  // 새로운 토큰 갱신 Promise 생성
  tokenRefreshPromise = (async () => {
    try {
      // 현재 시간을 마지막 갱신 시간으로 설정
      lastTokenRefreshTime = currentTime;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.status !== 200) {
        throw new Error("새로운 액세스 토큰을 발급받는데 실패했습니다");
      }

      return true;
    } catch (error) {
      await removeCookie("rft");
      if (window.location.pathname !== "/auth") {
        window.location.href = "/auth?expired=true";
      }
      console.error("새로운 액세스 토큰을 발급받는데 실패했습니다", error);
      return false;
    } finally {
      // 작업이 완료되면 Promise 초기화
      tokenRefreshPromise = null;
    }
  })();

  return tokenRefreshPromise;
};
