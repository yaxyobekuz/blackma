"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import useTranslate from "@/app/hooks/useTranslate";
import { courierLogin } from "@/app/lib/courier.service";
import { LoginForm } from "@/@types/login.types";

const INITIAL_FORM: LoginForm = { credential: "", password: "" };

export const LoginFormCard = () => {
  const { t } = useTranslate();
  const router = useRouter();
  const [form, setForm] = useState<LoginForm>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const setField = (key: keyof LoginForm) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    const phone = form.credential.trim();
    const password = form.password.trim();

    setError(null);

    if (!phone || !password) {
      setError(t("auth.fill_all_fields"));
      return;
    }

    if (password.length < 6) {
      setError(t("auth.password_min_length"));
      return;
    }

    setLoading(true);
    try {
      const res = await courierLogin(phone, password);
      localStorage.setItem("access_token", res.data.accessToken);
      localStorage.setItem("courier_id", res.data.courier.id);
      localStorage.setItem("courier_name", res.data.courier.name);
      router.push("/");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : t("auth.invalid_credentials");
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl shadow-black/5 ring-1 ring-black/5">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {t("auth.login_title")}
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-4"
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="credential" className="text-sm font-medium text-gray-700">
            {t("auth.credential_label")}
          </label>
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 py-3 bg-gray-50 focus-within:border-gray-900 focus-within:bg-white transition-colors">
            <Phone className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              id="credential"
              name="credential"
              type="tel"
              required
              autoComplete="tel"
              placeholder={t("auth.credential_placeholder")}
              value={form.credential}
              onChange={(e) => setField("credential")(e.target.value)}
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            {t("auth.password_label")}
          </label>
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 py-3 bg-gray-50 focus-within:border-gray-900 focus-within:bg-white transition-colors">
            <Lock className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder={t("auth.password_placeholder")}
              value={form.password}
              onChange={(e) => setField("password")(e.target.value)}
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-gray-400 hover:text-gray-700 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 text-white font-semibold py-3.5 rounded-xl hover:bg-black active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading
            ? t("auth.loading") || "Yuklanmoqda..."
            : t("auth.login_button")}
        </button>
      </form>
    </div>
  );
};
