"use client";

import { usePathname } from "next/navigation";

export function LayoutLines() {
  const pathname = usePathname();
  if (pathname === "/marketplace") return null;
  return (
    <>
      <div
        className="fixed top-0 bottom-0 w-0.5 pointer-events-none z-[60]"
        style={{
          backgroundColor: "#E1E1E1",
          left: "calc(50% - 640px)",
        }}
      />
      <div
        className="fixed top-0 bottom-0 w-0.5 pointer-events-none z-[60]"
        style={{
          backgroundColor: "#E1E1E1",
          left: "calc(50% + 640px)",
        }}
      />
    </>
  );
}
