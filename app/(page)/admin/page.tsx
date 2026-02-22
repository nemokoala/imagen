"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { UserManagement } from "@/components/admin/UserManagement";
import { CreditSettingsComponent } from "@/components/admin/CreditSettings";
import { ImageManagement } from "@/components/admin/ImageManagement";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useUrlParams } from "@/hooks/use-url-params";

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoading } = useUserStore();
  const { getParam, setParam } = useUrlParams();
  const activeTab = getParam("tab") || "users";

  const handleTabChange = (value: string) => {
    setParam("tab", value);
  };

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/auth/login");
        return;
      }
      if (user.role !== "admin") {
        router.push("/");
        return;
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <Layout.Content className="flex items-center justify-center">
        <div>로딩 중...</div>
      </Layout.Content>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <Layout.Content className="h-[calc(100dvh-60px)] overflow-y-auto">
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="users">유저 관리</TabsTrigger>
            <TabsTrigger value="images">이미지 관리</TabsTrigger>
            <TabsTrigger value="credits">크레딧 비용 설정</TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="mt-4">
            <UserManagement />
          </TabsContent>
          <TabsContent value="images" className="mt-4">
            <ImageManagement />
          </TabsContent>
          <TabsContent value="credits" className="mt-4">
            <CreditSettingsComponent />
          </TabsContent>
        </Tabs>
      </div>
    </Layout.Content>
  );
}
