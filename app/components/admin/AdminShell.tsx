"use client";

import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

type AdminShellProps = {
  children: ReactNode;
  activeSection?: "dashboard" | "classes" | "students" | "teachers";
};

export function AdminShell({ children, activeSection = "dashboard" }: AdminShellProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const closeMobileNav = () => setIsMobileNavOpen(false);

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-gray-900">
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-2xl bg-[#2196F3] text-white flex items-center justify-center text-lg font-semibold">
            HB
          </div>
          <div>
            <p className="text-base font-semibold">HomeworkBoard</p>
            <p className="text-xs text-gray-500">Yönetim Paneli</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsMobileNavOpen((prev) => !prev)}
          className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          aria-label="Menüyü aç/kapat"
        >
          {isMobileNavOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div className="flex">
        <Sidebar className="hidden lg:flex" />

        <div className="flex-1 flex flex-col min-w-0">
          <TopNav activeKey={activeSection} className="hidden lg:block" />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>

      {/* Mobile drawer */}
      {isMobileNavOpen ? (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeMobileNav}
            aria-hidden
          />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[80%] bg-white shadow-xl overflow-y-auto pb-6">
            <Sidebar className="border-r-0" onNavigate={closeMobileNav} />
            <div className="mt-2">
              <TopNav activeKey={activeSection} className="border-t border-gray-200" />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
