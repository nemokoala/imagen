/** 탐색 페이지 상단 쇼케이스용으로 서버에서 가져올 인기 이미지 개수 */
export const SHOWCASE_IMAGE_LIMIT = 16;

/** 모바일에서 실제로 렌더링할 쇼케이스 슬라이드 개수 */
export const MOBILE_SHOWCASE_COUNT = 8;

/**
 * 인기 이미지 쿼리 키.
 * 서버 컴포넌트의 prefetch와 클라이언트 useQuery가 반드시 같은 키를 써야
 * hydration 시 재요청 없이 캐시가 그대로 이어진다.
 */
export const topLikedImagesQueryKey = (limit: number) =>
  ["topLikedImages", limit] as const;
