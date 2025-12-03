// components/auth/LoginForm.tsx
"use client";

import { useState } from "react";
import type { UserRole } from "@/types/auth";
import { TextField } from "@/components/ui/TextField";
import { PasswordField } from "@/components/ui/PasswordField";
import { DemoAccounts } from "@/components/auth/DemoAccounts";

type LoginFormProps = {
  onLogin: (role: UserRole, userId: string, email: string) => void;
};

function getRoleAndUserId(email: string): { role: UserRole | null; userId: string } {
  let role: UserRole | null = null;
  let userId = "";

  if (email.endsWith("@admin.com")) {
    role = "admin";
    userId = "admin";
  } else if (email.endsWith("@ogretmen.com")) {
    role = "teacher";
    const username = email.split("@")[0];

    if (username === "yasemin.bahtiyar") {
      userId = "t1";
    } else if (username === "mehmet.demir") {
      userId = "t2";
    } else {
      userId = "t1";
    }
  } else if (email.endsWith("@ogrenci.com")) {
    role = "student";
    const username = email.split("@")[0];

    if (username === "zeynep.kaya") {
      userId = "s2";
    } else if (username === "ali.ozturk") {
      userId = "s1";
    } else if (username === "ahmet.celik") {
      userId = "s3";
    } else {
      userId = "s1";
    }
  }

  return { role, userId };
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { role, userId } = getRoleAndUserId(email);

    if (!role) {
      setError(
        "Geçersiz e-posta adresi. Lütfen @admin.com, @ogretmen.com veya @ogrenci.com uzantılı bir e-posta kullanın."
      );
      return;
    }

    if (password.length < 4) {
      setError("Şifre en az 4 karakter olmalıdır.");
      return;
    }

    onLogin(role, userId, email);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-gray-900 mb-2 text-center">Hoş Geldiniz</h2>
      <h2 className="text-gray-900 mb-2 text-center">ÖdevTakip</h2>
      <p className="text-gray-600 text-center mb-8">
        Hesabınıza giriş yapın
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <TextField
          id="email"
          type="email"
          label="Kullanıcı ID"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Kullanıcı ID'nizi girin"
          required
        />

        <PasswordField
          id="password"
          label="Şifre"
          value={password}
          onChange={setPassword}
          placeholder="Şifrenizi girin"
        />

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="text-right">
          <button
            type="button"
            className="text-sm text-[#2196F3] hover:text-[#1976D2]"
          >
            Şifremi Unuttum?
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#2196F3] text-white rounded-lg hover:bg-[#1976D2] transition-colors shadow-md"
        >
          Giriş Yap
        </button>
      </form>

      <DemoAccounts />
    </div>
  );
}
