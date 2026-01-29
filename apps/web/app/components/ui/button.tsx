"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  size?: "sm" | "default";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-2xl font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none",
          "text-[15px]",
          size === "sm" && "h-9 px-4",
          size === "default" && "h-10 px-6 py-2",
          variant === "default" &&
            "bg-black text-white border border-black hover:bg-gray-800",
          variant === "outline" &&
            "border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-gray-100",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
