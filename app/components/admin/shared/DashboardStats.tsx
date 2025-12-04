import { BookOpen, GraduationCap, Users, School } from "lucide-react";

type StatCard = {
  icon: JSX.Element;
  label: string;
  value: string | number;
};

type DashboardStatsProps = {
  stats?: StatCard[];
};

const DEFAULT_STATS: StatCard[] = [
  { icon: <School className="text-[#2196F3]" size={24} />, label: "Toplam Sınıf", value: 3 },
  { icon: <GraduationCap className="text-[#16a34a]" size={24} />, label: "Toplam Öğrenci", value: 5 },
  { icon: <Users className="text-[#a855f7]" size={24} />, label: "Toplam Öğretmen", value: 2 },
  { icon: <BookOpen className="text-[#f59e0b]" size={24} />, label: "Toplam Ders", value: 5 },
];

export function DashboardStats({ stats = DEFAULT_STATS }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <div
          key={`${stat.label}-${idx}`}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center gap-4"
        >
          <div className="h-12 w-12 rounded-2xl bg-[#f5f8ff] flex items-center justify-center">
            {stat.icon}
          </div>
          <div>
            <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
