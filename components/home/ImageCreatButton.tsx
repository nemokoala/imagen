"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "@/stores/userStore";

interface ImageCreatButtonProps {
  isVisible?: boolean;
}

export function ImageCreatButton({ isVisible = true }: ImageCreatButtonProps) {
  const { user } = useUserStore();
  const isLoggedIn = !!user;

  if (!isLoggedIn) {
    return null;
  }

  return (
    <motion.div
      className="fixed bottom-9 left-1/2 -translate-x-1/2 z-50"
      initial={{ y: 0, opacity: 1 }}
      animate={{
        y: isVisible ? 0 : 100,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      <Link href="/generate">
        <Button variant="gradient" className="rounded-full" size="lg">
          <Sparkles className="h-4 w-4" />
          이미지 생성하기
        </Button>
      </Link>
    </motion.div>
  );
}
