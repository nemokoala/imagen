"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/providers/ModalProvider";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export const CommonModal = () => {
  const { isOpen, setIsOpen, modalContent, confirmActionRef, closeActionRef } =
    useModal();
  const pathname = usePathname();

  useEffect(() => {
    if (modalContent.content || modalContent.title) {
      setIsOpen(true);
    }
  }, [modalContent]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open && !modalContent.cancelable) {
          confirmActionRef.current?.();
        }
        if (!open && modalContent.cancelable) {
          closeActionRef.current?.();
        }
        setIsOpen(open);
      }}
    >
      <DialogContent
        className="w-9/12 max-w-screen-sm bg-white dark:bg-[#33302f] rounded-[20px] p-6 gap-1.5 z-[999]"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-[#1c1918] dark:text-white font-bold text-lg whitespace-pre-line pt-4">
            {modalContent.title}
          </DialogTitle>
        </DialogHeader>

        <div className="text-[#6f6b6a] dark:text-stone-200 text-sm font-normal text-center whitespace-pre-line max-w-full overflow-x-hidden break-words">
          {modalContent.content ?? <span />}
        </div>
        <div className="flex justify-center gap-[10px] mt-2">
          {modalContent.cancelable && (
            <Button
              variant="outline"
              className="min-w-[100px] w-fit h-8 px-5 rounded-3xl text-sm text-[#3c3938] border border-[#3c3938] font-bold !bg-white"
              onClick={() => {
                closeActionRef.current?.();
                setIsOpen(false);
              }}
            >
              {modalContent.cancelText ?? "취소"}
            </Button>
          )}

          <Button
            variant="gradient"
            className="min-w-[100px] w-fit h-8 px-5 rounded-3xl text-sm text-white font-bold"
            onClick={() => {
              confirmActionRef.current?.();
              setIsOpen(false);
            }}
          >
            {modalContent.confirmText ?? "확인"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
