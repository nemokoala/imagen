"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      toastOptions={{
        // backdrop-filter는 CSS 빌드 과정에서 제거되어 인라인으로 적용 (글래스 효과)
        style: {
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
