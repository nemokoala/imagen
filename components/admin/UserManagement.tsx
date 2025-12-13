"use client";

import { useState } from "react";
import { useGetUsersQuery } from "@/queries/admin/queries";
import { useUpdateUserCreditMutation } from "@/queries/admin/mutations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function UserManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [creditValue, setCreditValue] = useState<string>("");
  const limit = 20;

  const { data, isLoading, error } = useGetUsersQuery(page, limit, search);
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

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>닉네임</TableHead>
              <TableHead>크레딧</TableHead>
              <TableHead>역할</TableHead>
              <TableHead>로그인 방식</TableHead>
              <TableHead>가입일</TableHead>
              <TableHead>작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.nickname}</TableCell>
                <TableCell>
                  {editingUserId === user.id ? (
                    <div className="flex gap-2 items-center">
                      <Input
                        type="number"
                        value={creditValue}
                        onChange={(e) => setCreditValue(e.target.value)}
                        className="w-24 h-full"
                        min="0"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleSaveCredit(user.id)}
                        disabled={updateCreditMutation.isPending}
                      >
                        저장
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                      >
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
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                  >
                    {user.role === "admin" ? "관리자" : "사용자"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {user.provider === "kakao" ? "카카오" : "로컬"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString("ko-KR")}
                </TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
