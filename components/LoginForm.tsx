"use client";

import { useState } from "react";
import Link from "next/link";
import { LOGIN_FIELDS, LoginForm } from "@/@types/login.types";
import { FormField } from "./FormField";
import { useRouter } from "next/navigation";
import useTranslate from "@/app/hooks/useTranslate";
import { courierLogin } from "@/app/lib/courier.service";

const INITIAL_FORM: LoginForm = { credential: "", password: "" };

export const LoginFormCard = () => {
  const { t } = useTranslate();
  const [form, setForm] = useState<LoginForm>(INITIAL_FORM);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const message = err instanceof Error ? err.message : t("auth.invalid_credentials");
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm w-full space-y-4 max-w-lg">
      <h2 className="text-xl font-bold">{t("auth.login_title")}</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-3"
      >
        {error && <span className="text-red-500">{error}</span>}

        {LOGIN_FIELDS.map((field) => (
          <FormField
            key={field.name}
            {...field}
            label={t(`auth.${field.name}_label`)}
            placeholder={t(`auth.${field.name}_placeholder`)}
            type={field.type}
            value={String(form[field.name])}
            onChange={setField(field.name)}
          />
        ))}

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-blue-500 hover:underline"
          >
            {t("auth.forgot_password")}
          </Link>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 text-white font-semibold py-3 rounded-lg hover:bg-black active:scale-95 transition-all disabled:opacity-60"
        >
          {loading ? t("auth.loading") || "Yuklanmoqda..." : t("auth.login_button")}
        </button>
      </form>

      <p className="text-xs text-center text-gray-500">
        {t("auth.login_agreement")}{" "}
        <Link href="/privacy" className="text-blue-500 hover:underline">
          {t("auth.privacy_policy")}
        </Link>{" "}
        <Link href="/terms" className="text-blue-500 hover:underline">
          {t("auth.terms_of_use")}
        </Link>
      </p>
    </div>
  );
};
