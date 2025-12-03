// app/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { GraduationCap } from "lucide-react";
import type { UserRole } from "@/types/auth";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (role: UserRole, userId: string, email: string) => {
    // Şimdilik sadece role'e göre yönlendirme örneği:
    if (role === "admin") {
      router.push("/dashboard/admin");
    } else if (role === "teacher") {
      router.push(`/dashboard/teacher/${userId}`);
    } else {
      router.push(`/dashboard/student/${userId}`);
    }

    console.log("Logged in:", { role, userId, email });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block bg-white p-4 rounded-2xl shadow-md mb-4">
            <GraduationCap className="text-[#2196F3]" size={48} />
          </div>
          <h1 className="text-gray-900 mb-2">
            Ödev Takip Sistemi
          </h1>
          <p className="text-gray-600">Hesabınıza giriş yapın</p>
        </div>

        <LoginForm onLogin={handleLogin} />
      </div>
    </div>
  );
}
