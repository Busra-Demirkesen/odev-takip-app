// app/dashboard/admin/dashboard/page.tsx
import { redirect } from "next/navigation";

export default function AdminDashboardLegacyRedirect() {
  redirect("/dashboard/admin");
}
