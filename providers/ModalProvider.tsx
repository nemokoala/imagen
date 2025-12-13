"use client";

import { CommonModal } from "@/components/common/CommonModal";
import { createContext, useContext, useState, useRef } from "react";

interface ModalContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  modalContent: {
    title: string | React.ReactNode;
    content: React.ReactNode;
    cancelable: boolean;
    confirmText?: string;
    cancelText?: string;
  };
  confirmActionRef: React.RefObject<VoidFunction>;
  closeActionRef: React.RefObject<VoidFunction>;
  changeModalContent: (
    modalContent: {
      title: string | React.ReactNode;
      content: React.ReactNode;
      cancelable?: boolean;
      confirmText?: string;
      cancelText?: string;
    },
    confirmAction?: VoidFunction,
    closeAction?: VoidFunction
  ) => void;
}

const ModalContext = createContext<ModalContextType>({
  isOpen: false,
  setIsOpen: () => {},
  modalContent: { title: "", content: null, cancelable: false },
  confirmActionRef: { current: () => {} },
  closeActionRef: { current: () => {} },
  changeModalContent: () => {},
});

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string | React.ReactNode;
    content: React.ReactNode;
    cancelable: boolean;
    confirmText?: string;
    cancelText?: string;
  }>({
    title: "",
    content: null as React.ReactNode,
    cancelable: false,
    confirmText: "",
    cancelText: "",
  });
  const confirmActionRef = useRef<VoidFunction>(() => {});
  const closeActionRef = useRef<VoidFunction>(() => {});

  const changeModalContent = (
    modalContent: {
      title: string | React.ReactNode;
      content: React.ReactNode;
      cancelable?: boolean;
      confirmText?: string;
      cancelText?: string;
    },
    confirmAction?: VoidFunction,
    closeAction?: VoidFunction
  ) => {
    setModalContent({
      ...modalContent,
      cancelable: modalContent.cancelable ?? false,
    });
    if (confirmAction) {
      confirmActionRef.current = confirmAction;
    } else {
      confirmActionRef.current = () => {};
    }
    if (closeAction) {
      closeActionRef.current = closeAction;
    } else {
      closeActionRef.current = () => {};
    }
  };

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        setIsOpen,
        modalContent,
        confirmActionRef,
        closeActionRef,
        changeModalContent,
      }}
    >
      {children}
      <CommonModal />
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
