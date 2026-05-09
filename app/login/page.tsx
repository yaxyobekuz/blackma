"use client";
import { LoginFormCard } from "@/components/LoginForm";
import useTranslate from "@/app/hooks/useTranslate";

const LoginPage = () => {
  const { t } = useTranslate();

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-5 py-10 bg-gradient-to-br from-[#C8D8E8] via-[#DCE7F1] to-[#A9C0D6] overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-24 w-80 h-80 rounded-full bg-[#7FA0BF]/40 blur-3xl"
      />

      <div className="relative z-10 flex flex-col items-center gap-10 w-full">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Tijaro
          </h1>
          <p className="mt-2 text-lg font-medium text-gray-700">
            {t("auth.courier")}
          </p>
        </div>

        <LoginFormCard />
      </div>
    </main>
  );
};

export default LoginPage;
