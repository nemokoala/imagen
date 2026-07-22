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
  // 만료된 경우 비로그인으로 간주하고, isLiked는 클라이언트 재요청 시 채워진다.
  let currentUserId: number | undefined;
  try {
    currentUserId = await authService.getUserIdFromCookie(cookieStore);
  } catch {
    currentUserId = undefined;
  }

  // 상단 쇼케이스 이미지를 서버에서 미리 채워 LCP 이미지가 초기 HTML에 포함되게 한다.
  await queryClient.prefetchQuery({
    queryKey: topLikedImagesQueryKey(SHOWCASE_IMAGE_LIMIT),
    queryFn: () =>
      imageService.getTopLikedImages(SHOWCASE_IMAGE_LIMIT, currentUserId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ExploreContent />
    </HydrationBoundary>
  );
}
