"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { UserManagement } from "@/components/admin/UserManagement";
import { Layout } from "@/components/layout/Layout";

export default function AdminPage() {
  const router = useRouter();
  const { user } = useUserStore();

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.replace("/");
    }
  }, [user, router]);

  return (
    <Layout.Content className="h-[calc(100dvh-60px)] overflow-y-auto">
      <UserManagement />
    </Layout.Content>
  );
}
