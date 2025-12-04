"use client";

import { useState, type FormEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

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
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const normalizedEmail = email.trim().toLowerCase();

    try {
      // Firebase ile giriş yap
      const cred = await signInWithEmailAndPassword(auth, normalizedEmail, password);

      // Rol + userId email uzantısına göre
      const { role, userId } = getRoleAndUserId(normalizedEmail);

      if (!role) {
        setError(
          "Geçersiz e-posta adresi. Lütfen @admin.com, @ogretmen.com veya @ogrenci.com kullanın."
        );
        return;
      }

      onLogin(role, userId, normalizedEmail);
      console.log("Firebase -> UID:", cred.user.uid);
    } catch (err: any) {
      const message =
        err?.code === "auth/user-not-found"
          ? "Böyle bir kullanıcı bulunamadı."
          : err?.code === "auth/wrong-password"
          ? "Şifre hatalı."
          : err?.code === "auth/invalid-email"
          ? "Geçersiz e-posta adresi."
          : "Giriş yaparken hata oluştu.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
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
          disabled={isLoading}
          className="w-full py-3 bg-[#2196F3] text-white rounded-lg hover:bg-[#1976D2] transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>

      <DemoAccounts />
    </div>
  );
}
