/**
 * 페이지 콘텐츠 폭은 두 단계로 맞춘다.
 * - 넓은 폭: 이미지를 훑어보는 화면 (탐색 · 프로필 · 생성)
 * - 좁은 폭: 읽는 화면 (이미지 상세 · 랜딩 · 프로필 댓글) 은 각 페이지에서 max-w-6xl 을 쓴다.
 */
export const WIDE_CONTAINER = "mx-auto w-full max-w-[1600px]";

/** 넓은 폭 페이지의 좌우 여백. 스크롤 컨테이너(Layout.Content)에 준다. */
export const WIDE_PAGE_GUTTER = "px-4 md:px-6";

/** 좌우 여백을 무시하고 화면 끝까지 넓힐 때 (배경 · 상단에 붙는 툴바) */
export const WIDE_PAGE_BLEED = "-mx-4 px-4 md:-mx-6 md:px-6";
