"use client";

import { useState } from "react";
import { useGetGalleryImagesQuery } from "@/queries/image/queries";
import { useDeleteImageMutation } from "@/queries/image/mutations";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import Image from "next/image";
import { useModal } from "@/providers/ModalProvider";

export function ImageManagement() {
  const [page, setPage] = useState(1);
  const limit = 20;
  const { changeModalContent } = useModal();

  const { data, isLoading, error } = useGetGalleryImagesQuery(page, limit);
  const deleteImageMutation = useDeleteImageMutation();

  const showDeleteModal = (imageId: number) => {
    changeModalContent(
      {
        title: "이미지 삭제 확인",
        content: "정말로 이 이미지를 삭제하시겠습니까?",
        cancelable: true,
        confirmText: "삭제",
      },
      () => handleDelete(imageId)
    );
  };

  const handleDelete = async (imageId: number) => {
    try {
      await deleteImageMutation.mutateAsync(imageId);
      toast.success("이미지가 삭제되었습니다.");
      // 페이지가 비어있으면 이전 페이지로 이동
      if (data && data.images?.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch (error) {
      console.error(error);
      toast.error("이미지 삭제에 실패했습니다.");
    }
  };

  if (isLoading) {
    return <div className="p-4">로딩 중...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">에러가 발생했습니다.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">이미지 관리</h2>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">이미지</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>사용자</TableHead>
              <TableHead className="max-w-md">프롬프트</TableHead>
              <TableHead>모델</TableHead>
              <TableHead>좋아요</TableHead>
              <TableHead>댓글</TableHead>
              <TableHead>생성일</TableHead>
              <TableHead>작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.images && data.images.length > 0 ? (
              data.images.map((image) => (
                <TableRow key={image.id}>
                  <TableCell>
                    <div className="relative w-16 h-16">
                      <Image
                        src={image.imageUrl}
                        alt={image.prompt.substring(0, 50)}
                        fill
                        className="object-cover rounded"
                        sizes="64px"
                      />
                    </div>
                  </TableCell>
                  <TableCell>{image.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{image.user.nickname}</div>
                      <div className="text-sm text-gray-500">
                        ID: {image.user.id}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <div className="truncate" title={image.prompt}>
                      {image.prompt}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{image.model}</span>
                  </TableCell>
                  <TableCell>{image.likeCount || 0}</TableCell>
                  <TableCell>{image.commentCount || 0}</TableCell>
                  <TableCell>
                    {new Date(image.createdAt).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={deleteImageMutation.isPending}
                      onClick={() => showDeleteModal(image.id)}
                    >
                      삭제
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  이미지가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data && data.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            이전
          </Button>
          <span className="flex items-center px-4">
            {page} / {data.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
            disabled={page === data.totalPages}
          >
            다음
          </Button>
        </div>
      )}

      <div className="text-sm text-gray-500">
        총 {data?.totalCount || 0}개의 이미지
      </div>
    </div>
  );
}
