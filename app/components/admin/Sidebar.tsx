"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  School,
  GraduationCap,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number }>;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Gösterge Paneli", href: "/dashboard/admin", icon: LayoutDashboard },
  { label: "Sınıflar", href: "/dashboard/admin/classes", icon: School },
  { label: "Öğrenciler", href: "/dashboard/admin/students", icon: GraduationCap },
  { label: "Öğretmenler", href: "/dashboard/admin/teachers", icon: Users },
];

type SidebarProps = {
  fallbackActiveHref?: string;
};

export function Sidebar({ fallbackActiveHref = "/dashboard/admin/students" }: SidebarProps) {
  const pathname = usePathname();
  const isRoot = pathname === "/dashboard/admin";

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="px-6 py-6 flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-[#2196F3] text-white flex items-center justify-center text-xl font-semibold">
          HB
        </div>
        <div>
          <p className="text-lg font-semibold">HomeworkBoard</p>
          <p className="text-sm text-gray-500">Yönetim Paneli</p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = isRoot
            ? item.href === fallbackActiveHref
            : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? "bg-[#2196F3] text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-6 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors">
          <Settings size={20} />
          <span className="text-sm font-medium">Ayarlar</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors">
          <LogOut size={20} />
          <span className="text-sm font-medium">Çıkış Yap</span>
        </button>
      </div>
    </aside>
  );
}
