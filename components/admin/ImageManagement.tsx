"use client";

import { useState, useMemo } from "react";
import { useGetGalleryImagesQuery } from "@/queries/image/queries";
import { useDeleteImageMutation } from "@/queries/image/mutations";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import { useModal } from "@/providers/ModalProvider";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { useRouter } from "next/navigation";

// TImage type inference from query hook
type TImage = NonNullable<
  ReturnType<typeof useGetGalleryImagesQuery>["data"]
>["images"][number];

export function ImageManagement() {
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const limit = 20;
  const { changeModalContent } = useModal();
  const router = useRouter();

  const sortBy = sorting.length > 0 ? sorting[0].id : undefined;
  const order =
    sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined;

  const { data, error } = useGetGalleryImagesQuery(
    page,
    limit,
    undefined,
    sortBy,
    order,
  );
  const deleteImageMutation = useDeleteImageMutation();

  const showDeleteModal = (imageId: number) => {
    changeModalContent(
      {
        title: "이미지 삭제 확인",
        content: "정말로 이 이미지를 삭제하시겠습니까?",
        cancelable: true,
        confirmText: "삭제",
      },
      () => handleDelete(imageId),
    );
  };

  const handleDelete = async (imageId: number) => {
    try {
      await deleteImageMutation.mutateAsync(imageId);
      toast.success("이미지가 삭제되었습니다.");
      if (data && data.images?.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch (error) {
      console.error(error);
      toast.error("이미지 삭제에 실패했습니다.");
    }
  };

  const columns = useMemo<ColumnDef<TImage>[]>(
    () => [
      {
        accessorKey: "imageUrl",
        header: "이미지",
        size: 100,
        enableSorting: false,
        cell: ({ row }) => (
          <Button
            className="relative w-16 h-16"
            onClick={() => router.push(`/image/${row.original.id}`)}
          >
            <Image
              src={row.original.imageUrl}
              alt={row.original.prompt.substring(0, 50)}
              fill
              className="object-cover rounded"
              sizes="64px"
            />
          </Button>
        ),
      },
      {
        accessorKey: "id",
        header: "ID",
        size: 80,
      },
      {
        accessorKey: "user",
        header: "사용자",
        size: 150,
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.user.nickname}</div>
            <div className="text-sm text-gray-500">
              ID: {row.original.user.id}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "prompt",
        header: "프롬프트",
        size: 300,
      },
      {
        accessorKey: "model",
        header: "모델",
        size: 120,
        cell: ({ row }) => (
          <span className="text-sm">{row.original.model}</span>
        ),
      },
      {
        accessorKey: "likeCount",
        header: "좋아요",
        size: 80,
        cell: ({ row }) => row.original.likeCount || 0,
      },
      {
        accessorKey: "commentCount",
        header: "댓글",
        size: 80,
        cell: ({ row }) => row.original.commentCount || 0,
      },
      {
        accessorKey: "createdAt",
        header: "생성일",
        size: 150,
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
      },
      {
        id: "actions",
        header: "작업",
        size: 70,
        enableSorting: false,
        cell: ({ row }) => (
          <Button
            size="sm"
            variant="destructive"
            disabled={deleteImageMutation.isPending}
            onClick={() => showDeleteModal(row.original.id)}
          >
            삭제
          </Button>
        ),
      },
    ],
    [deleteImageMutation.isPending],
  );

  if (error) {
    return <div className="p-4 text-red-500">에러가 발생했습니다.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">이미지 관리</h2>
      </div>

      <DataTable
        columns={columns}
        data={data?.images ?? []}
        sorting={sorting}
        onSortingChange={setSorting}
        manualSorting={true}
      />

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
