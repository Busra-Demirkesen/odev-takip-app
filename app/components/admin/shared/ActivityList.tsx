import { Clock, LayoutGrid } from "lucide-react";

type Activity = {
  icon?: JSX.Element;
  title: string;
  subtitle: string;
  time: string;
};

type ActivityListProps = {
  activities?: Activity[];
};

const DEFAULT_ACTIVITIES: Activity[] = [
  {
    icon: <LayoutGrid size={18} className="text-[#2196F3]" />,
    title: "Yeni sınıf oluşturuldu",
    subtitle: "9-A sınıfı sisteme eklendi",
    time: "2 saat önce",
  },
  {
    icon: <LayoutGrid size={18} className="text-[#16a34a]" />,
    title: "Öğrenci eklendi",
    subtitle: "Ali Öztürk - 9-A",
    time: "3 saat önce",
  },
];

export function ActivityList({ activities = DEFAULT_ACTIVITIES }: ActivityListProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Son Aktiviteler</h3>
      <div className="space-y-3">
        {activities.map((activity, idx) => (
          <div
            key={`${activity.title}-${idx}`}
            className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
          >
            <div className="mt-1">
              {activity.icon ?? <LayoutGrid size={18} className="text-[#2196F3]" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
              <p className="text-xs text-gray-600">{activity.subtitle}</p>
              <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-1">
                <Clock size={12} />
                <span>{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
