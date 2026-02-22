"use client";

import { useState, useMemo } from "react";
import { useGetUsersQuery } from "@/queries/admin/queries";
import { useUpdateUserCreditMutation } from "@/queries/admin/mutations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { User } from "@/types/user.interfaces";
import { DataTable } from "@/components/ui/data-table";

export function UserManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [creditValue, setCreditValue] = useState<string>("");
  const limit = 20;

  const sortBy = sorting.length > 0 ? sorting[0].id : "";
  const order = sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : "";

  const { data, isLoading, error } = useGetUsersQuery(
    page,
    limit,
    search,
    sortBy,
    order,
  );
  const updateCreditMutation = useUpdateUserCreditMutation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (page !== 1) setPage(1);
  };

  const handleEditClick = (user: { id: number; credits: number }) => {
    setEditingUserId(user.id);
    setCreditValue(user.credits.toString());
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setCreditValue("");
  };

  const handleSaveCredit = async (userId: number) => {
    const credits = parseInt(creditValue);
    if (isNaN(credits) || credits < 0) {
      toast.error("유효한 크레딧 값을 입력해주세요.");
      return;
    }

    try {
      await updateCreditMutation.mutateAsync({ userId, credits });
      toast.success("크레딧이 수정되었습니다.");
      setEditingUserId(null);
      setCreditValue("");
    } catch (error) {
      console.error(error);
      toast.error("크레딧 수정에 실패했습니다.");
    }
  };

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 80,
      },
      {
        accessorKey: "email",
        header: "이메일",
        size: 200,
      },
      {
        accessorKey: "nickname",
        header: "닉네임",
        size: 150,
      },
      {
        accessorKey: "credits",
        header: "크레딧",
        size: 200,
        cell: ({ row }) => {
          const user = row.original;
          return editingUserId === user.id ? (
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                value={creditValue}
                onChange={(e) => setCreditValue(e.target.value)}
                className="w-24 h-8"
                min="0"
              />
              <Button
                size="sm"
                onClick={() => handleSaveCredit(user.id)}
                disabled={updateCreditMutation.isPending}
              >
                저장
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                취소
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>{user.credits}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEditClick(user)}
              >
                수정
              </Button>
            </div>
          );
        },
      },
      {
        accessorKey: "role",
        header: "역할",
        size: 100,
        cell: ({ row }) => (
          <Badge
            variant={row.original.role === "admin" ? "default" : "secondary"}
          >
            {row.original.role === "admin" ? "관리자" : "사용자"}
          </Badge>
        ),
      },
      {
        accessorKey: "provider",
        header: "로그인 방식",
        size: 120,
        cell: ({ row }) => (
          <Badge variant="outline">
            {row.original.provider === "kakao" ? "카카오" : "로컬"}
          </Badge>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "가입일",
        size: 150,
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString("ko-KR"),
      },
      {
        id: "actions",
        header: "작업",
        size: 80,
        cell: () => "-",
        enableSorting: false,
      },
    ],
    [editingUserId, creditValue, updateCreditMutation.isPending],
  );

  if (isLoading) {
    return <div className="p-4">로딩 중...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">에러가 발생했습니다.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">유저 관리</h2>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="이메일 또는 닉네임으로 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        <Button type="submit">검색</Button>
      </form>

      <DataTable
        columns={columns}
        data={data?.users ?? []}
        sorting={sorting}
        onSortingChange={setSorting}
        manualSorting={true}
      />

      {data && data.pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            이전
          </Button>
          <span className="flex items-center px-4">
            {page} / {data.pagination.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() =>
              setPage((p) => Math.min(data.pagination.totalPages, p + 1))
            }
            disabled={page === data.pagination.totalPages}
          >
            다음
          </Button>
        </div>
      )}

      <div className="text-sm text-gray-500">
        총 {data?.pagination.total || 0}명의 유저
      </div>
    </div>
  );
}
