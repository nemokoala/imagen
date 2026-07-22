import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import { imageService } from "@/lib/services/image/imageService";
import { authService } from "@/lib/services/auth/authService";
import {
  SHOWCASE_IMAGE_LIMIT,
  topLikedImagesQueryKey,
} from "@/constants/image.constants";
import { ExploreContent } from "./ExploreContent";

export default async function ExplorePage() {
  const queryClient = new QueryClient();
  const cookieStore = await cookies();

  // 서버 컴포넌트에서는 쿠키를 수정할 수 없으므로 리프레시 없이 액세스 토큰만 확인한다.
  let currentUserId: number | undefined;
  try {
    currentUserId = await authService.getUserIdFromCookie(cookieStore);
  } catch {
    currentUserId = undefined;
  }

  // 액세스 토큰(30분)은 만료됐지만 리프레시 토큰이 남아 있으면 실제로는 로그인 유저다.
  // 위에서 리프레시를 못 했으므로 isLiked가 전부 false로 나가는 상태다.
  const isLikedUnresolved =
    currentUserId === undefined && !!cookieStore.get("refreshToken")?.value;

  // 상단 쇼케이스 이미지를 서버에서 미리 채워 LCP 이미지가 초기 HTML에 포함되게 한다.
  // isLiked를 확정하지 못한 경우에만 dataUpdatedAt을 0으로 심어, 클라이언트가
  // 마운트 직후 다시 받아오도록 한다(API 라우트는 리프레시까지 처리한다).
  const images = await imageService.getTopLikedImages(
    SHOWCASE_IMAGE_LIMIT,
    currentUserId,
  );
  queryClient.setQueryData(
    topLikedImagesQueryKey(SHOWCASE_IMAGE_LIMIT),
    images,
    isLikedUnresolved ? { updatedAt: 0 } : undefined,
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ExploreContent />
    </HydrationBoundary>
  );
}
