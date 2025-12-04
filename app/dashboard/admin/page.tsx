// app/dashboard/admin/page.tsx
"use client";

import { AdminShell } from "@/components/admin/shared/AdminShell";
import { DashboardStats } from "@/components/admin/shared/DashboardStats";
import { QuickActions } from "@/components/admin/shared/QuickActions";
import { ActivityList } from "@/components/admin/shared/ActivityList";

export default function AdminDashboardPage() {
  return (
    <AdminShell activeSection="dashboard">
      <div className="space-y-6">
        <DashboardStats />
        <QuickActions />
        <ActivityList />
      </div>
    </AdminShell>
  );
}
