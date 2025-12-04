// app/dashboard/admin/page.tsx
"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { QuickActions } from "@/components/admin/QuickActions";
import { ActivityList } from "@/components/admin/ActivityList";

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
