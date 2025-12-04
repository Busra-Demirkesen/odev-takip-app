"use client";

type TopNavProps = {
  activeKey?: "dashboard" | "classes" | "students" | "teachers";
};

const TABS = [
  { key: "dashboard" as const, label: "Gösterge Paneli" },
  { key: "classes" as const, label: "Sınıflar" },
  { key: "students" as const, label: "Öğrenciler" },
  { key: "teachers" as const, label: "Öğretmenler" },
];

export function TopNav({ activeKey = "dashboard" }: TopNavProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-8">
        <nav className="flex items-center gap-8">
          {TABS.map((tab) => {
            const isActive = tab.key === activeKey;
            return (
              <button
                key={tab.key}
                className={`pb-3 pt-4 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? "border-[#2196F3] text-[#2196F3]"
                    : "border-transparent text-gray-600 hover:text-[#2196F3]"
                }`}
                type="button"
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
