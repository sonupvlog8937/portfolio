import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function GradientText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={cn("gradient-text", className)}>{children}</span>;
}