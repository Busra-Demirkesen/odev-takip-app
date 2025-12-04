"use client";

import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

type AdminShellProps = {
  children: ReactNode;
  activeSection?: "dashboard" | "classes" | "students" | "teachers";
};

export function AdminShell({ children, activeSection = "dashboard" }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-[#f7f9fc] text-gray-900 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopNav activeKey={activeSection} />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
