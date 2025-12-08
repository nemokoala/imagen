"use client";

import { Loader2 } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="h-[100dvh] fixed inset-0 flex justify-center items-center">
      <Loader2 className="w-10 h-10 animate-spin" />
    </div>
  );
}
