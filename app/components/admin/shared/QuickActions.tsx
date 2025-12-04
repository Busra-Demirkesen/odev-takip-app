import { Plus, GraduationCap, Users, BookOpen, LayoutGrid } from "lucide-react";

type QuickAction = {
  label: string;
  description: string;
  icon: JSX.Element;
  colorClass: string;
  onClick?: () => void;
};

type QuickActionsProps = {
  actions?: QuickAction[];
};

const DEFAULT_ACTIONS: QuickAction[] = [
  {
    label: "Sınıf Ekle",
    description: "Yeni sınıf oluştur",
    icon: <LayoutGrid size={18} />,
    colorClass: "bg-[#e8f3ff] text-[#2196F3]",
  },
  {
    label: "Öğretmen Ekle",
    description: "Yeni öğretmen kaydet",
    icon: <Users size={18} />,
    colorClass: "bg-[#f3e8ff] text-[#a855f7]",
  },
  {
    label: "Öğrenci Ekle",
    description: "Sınıfa öğrenci ekle",
    icon: <GraduationCap size={18} />,
    colorClass: "bg-[#e8f7ef] text-[#16a34a]",
  },
  {
    label: "Ders Yönetimi",
    description: "Dersleri düzenle",
    icon: <BookOpen size={18} />,
    colorClass: "bg-[#fff4e5] text-[#f59e0b]",
  },
];

export function QuickActions({ actions = DEFAULT_ACTIONS }: QuickActionsProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Hızlı İşlemler</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {actions.map((action, idx) => (
          <button
            key={`${action.label}-${idx}`}
            type="button"
            onClick={action.onClick}
            className={`flex items-start gap-3 rounded-2xl px-4 py-3 text-left border border-transparent hover:shadow-sm transition-shadow ${action.colorClass}`}
          >
            <span className="mt-1">
              <Plus size={18} />
            </span>
            <div>
              <p className="text-sm font-semibold">{action.label}</p>
              <p className="text-xs text-gray-600">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
