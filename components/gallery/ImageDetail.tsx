"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Image as ImageIcon,
  Download,
  Sparkles,
  MessageCircle,
  Trash2,
  ArrowLeft,
  User,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CommentSection } from "./comment/CommentSection";
import { useGetCommentsQuery } from "@/queries/image/queries";
import { LikeButton } from "./LikeButton";
import { useDeleteImageMutation } from "@/queries/image/mutations";
import { useUserStore } from "@/stores/userStore";
import { toast } from "sonner";
import { useModal } from "@/providers/ModalProvider";
import { useRouter } from "next/navigation";
import { downloadImage } from "@/lib/utils";
import { Image as ImageType } from "@/types/image.interfaces";
import { Layout } from "../layout/Layout";
import Link from "next/link";
import { ProfileAvatar } from "../auth/ProfileAvatar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageCard } from "./ImageCard";
import { Separator } from "@/components/ui/separator";

interface ImageDetailProps {
  image: ImageType;
  prevImages?: ImageType[];
  nextImages?: ImageType[];
}

export function ImageDetail({
  image: initialImage,
  prevImages = [],
  nextImages = [],
}: ImageDetailProps) {
  const router = useRouter();
  const [imageData, setImageData] = useState<ImageType>(initialImage);
  const { changeModalContent } = useModal();
  const { user } = useUserStore();

  // image prop이 변경될 때만 업데이트
  useEffect(() => {
    if (initialImage) {
      setImageData(initialImage);
    }
  }, [initialImage]);

  // TanStack Query hooks
  const { data: comments = [] } = useGetCommentsQuery(imageData?.id ?? null);
  const deleteImageMutation = useDeleteImageMutation();

  // 삭제 권한 확인: 본인 이미지이거나 어드민인 경우
  const canDelete =
    imageData &&
    user &&
    (imageData.user.id === user.id || user.role === "admin");

  const showDeleteModal = () => {
    changeModalContent(
      {
        title: "이미지 삭제 확인",
        content:
          "정말로 이 이미지를 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며, 관련된 좋아요와 댓글도 함께 삭제됩니다.",
        cancelable: true,
        confirmText: "삭제",
      },
      handleDelete
    );
  };

  const handleDelete = async () => {
    if (!imageData) return;
    try {
      await deleteImageMutation.mutateAsync(imageData.id);
      toast.success("이미지가 삭제되었습니다.");
      router.push("/"); // 홈으로 이동
    } catch (error) {
      console.error(error);
      toast.error("이미지 삭제에 실패했습니다.");
    }
  };

  if (!imageData) return null;

  return (
    <Layout.Content className="py-8 px-4 md:px-8 lg:px-12">
      <div className="max-w-8xl mx-auto w-full">
        {/* 뒤로가기 버튼 */}
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          뒤로가기
        </Button>

        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
            <ImageIcon className="h-8 w-8 text-purple-600" />
            <span>이미지 상세 정보</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="flex flex-col gap-4">
            <div className="space-y-6">
              {/* 이미지 */}
              <div className="flex justify-center aspect-square relative">
                <Image
                  src={imageData.imageUrl}
                  alt={imageData.prompt}
                  fill
                  className="max-w-full object-contain rounded-xl shadow-lg transition-transform duration-300"
                  unoptimized
                  priority
                />
              </div>

              {/* 프롬프트 */}
              <div className="space-y-3">
                <div className="font-semibold text-lg text-foreground flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  프롬프트
                  <div className="flex items-center gap-2 ml-auto">
                    <Button
                      onClick={() =>
                        downloadImage(imageData.imageUrl, imageData.prompt)
                      }
                      variant="outline"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      다운로드
                    </Button>
                    {canDelete && (
                      <Button
                        variant="destructive"
                        onClick={showDeleteModal}
                        className="rounded-full h-full px-1 ml-auto"
                      >
                        <Trash2 className="h-4 w-4" />
                        삭제
                      </Button>
                    )}
                  </div>
                </div>
                <div className="bg-background-plus border border-border p-4 rounded-xl">
                  <p className="text-foreground leading-relaxed">
                    {imageData.prompt}
                  </p>
                </div>
              </div>
              {/* 이미지 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex gap-2 h-16 items-center bg-background-plus backdrop-blur-sm p-4 rounded-xl border border-border shadow-lg">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      모델
                    </h3>
                    <Badge
                      variant="secondary"
                      className="gradient-purple-bg text-white"
                    >
                      {imageData.model}
                    </Badge>
                  </div>
                  <div className="flex gap-2 h-16 items-center bg-background-plus backdrop-blur-sm p-4 rounded-xl border border-border shadow-lg">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-purple-600" />
                      크기
                    </h3>
                    <p className="text-foreground">{imageData.size}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-2 h-16 items-center bg-background-plus backdrop-blur-sm p-4 rounded-xl border border-border shadow-lg">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <User className="h-4 w-4 text-purple-600" />
                      생성자
                    </h3>
                    <p className="text-foreground whitespace-nowrap flex items-center gap-1.5 ml-0.5">
                      <Link href={`/profile/${imageData.user.id}`}>
                        <ProfileAvatar
                          profileImageUrl={imageData.user.profileImageUrl || ""}
                          nickname={imageData.user.nickname || ""}
                          size="small"
                        />{" "}
                      </Link>
                      {imageData.user.nickname}
                    </p>
                  </div>
                  <div className="flex gap-2 h-16 items-center bg-background-plus backdrop-blur-sm p-4 rounded-xl border border-border shadow-lg">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-purple-600" />
                      생성일
                    </h3>
                    <p className="text-foreground">
                      {format(new Date(imageData.createdAt), "yy.MM.dd HH:mm", {
                        locale: ko,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {/* 좋아요 및 댓글 섹션 */}
            <div className="space-y-4">
              {/* 좋아요 버튼 */}
              <div className="flex items-center gap-4 h-10">
                <LikeButton imageId={imageData.id} />
                <div className="flex items-center gap-2 text-foreground">
                  <MessageCircle className="h-5 w-5" />
                  <span>{comments.length}</span>
                </div>
              </div>
              {/* 댓글 섹션 */}
              <CommentSection imageId={imageData.id} />
            </div>
          </div>
        </div>

        <Separator className="my-6" />
        {/* 이전/다음 이미지 섹션 */}
        {(prevImages.length > 0 || nextImages.length > 0) && (
          <div className="mt-12 space-y-8">
            {/* 이전글 */}
            {prevImages.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <ChevronLeft className="h-6 w-6 text-purple-600" />
                  이전글
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {prevImages.map((prevImage) => (
                    <ImageCard key={prevImage.id} image={prevImage} />
                  ))}
                </div>
              </div>
            )}

            {/* 다음글 */}
            {nextImages.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <ChevronRight className="h-6 w-6 text-purple-600" />
                  다음글
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {nextImages.map((nextImage) => (
                    <ImageCard key={nextImage.id} image={nextImage} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout.Content>
  );
}
