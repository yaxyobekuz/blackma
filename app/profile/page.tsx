"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageHeading from "./ui/PageHeading";
import ProfileTopBar from "./ui/TopBar";
import { ChevronRight, LogOut } from "lucide-react";
import useAuth from "../hooks/useAuth";
import LanguageModal from "./ui/LanguageModal";
import useTranslate from "../hooks/useTranslate";
import {
  getCourierById,
  getCourierOrders,
  Courier,
} from "../lib/courier.service";

const LANG_LABELS = {
  uz: "O'zbekcha",
  eng: "English",
  ru: "Русский",
};

type Lang = keyof typeof LANG_LABELS;

export default function ProfilePage() {
  const { t } = useTranslate();
  const router = useRouter();
  useAuth();
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<Lang>("uz");
  const [courier, setCourier] = useState<Courier | null>(null);
  const [ordersCount, setOrdersCount] = useState<number | null>(null);

  const handleLogout = () => {
    if (!window.confirm(t("profile.logout_confirm"))) return;
    localStorage.removeItem("access_token");
    localStorage.removeItem("courier_id");
    localStorage.removeItem("courier_name");
    router.push("/login");
  };

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved && saved in LANG_LABELS) setCurrentLang(saved);

    const courierId = localStorage.getItem("courier_id");
    if (!courierId) return;

    getCourierById(courierId).then(setCourier).catch(console.error);

    getCourierOrders(courierId)
      .then((res) => setOrdersCount(res.orders?.length ?? 0))
      .catch(console.error);
  }, []);

  const handleModalClose = () => {
    setLangModalOpen(false);
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved && saved in LANG_LABELS) setCurrentLang(saved);
  };

  return (
    <div className="space-y-2 container">
      <ProfileTopBar title={t("navigation.profile")} path="/" />
      <PageHeading>{t("profile.personal_cabinet")}</PageHeading>

      <div>
        <Link
          href="/profile/info"
          className="flex items-center justify-between py-4 border-b border-slate-200"
        >
          <p className="text-lg Nunito_Sans_SemiBold">
            {t("profile.my_profile")}
          </p>
          <p className="flex items-center gap-2 Nunito_Sans_SemiBold text-right">
            {courier?.name ?? "..."} <ChevronRight />
          </p>
        </Link>
        <Link
          href="/profile/orders"
          className="flex items-center justify-between py-4 border-b border-slate-200"
        >
          <p className="text-lg Nunito_Sans_SemiBold">
            {t("orders.my_orders")}
          </p>
          <p className="flex items-center gap-2 Nunito_Sans_SemiBold">
            {ordersCount ?? "..."} <ChevronRight />
          </p>
        </Link>
      </div>

      <br />
      <PageHeading>{t("profile.settings")}</PageHeading>

      <div>
        <button
          onClick={() => setLangModalOpen(true)}
          className="w-full flex items-center justify-between py-4 border-b border-slate-200 Nunito_Sans_SemiBold"
        >
          <p className="text-lg">{t("profile.language")}</p>
          <p className="flex items-center gap-2">
            {LANG_LABELS[currentLang]} <ChevronRight />
          </p>
        </button>
        <Link
          href="https://t.me/balckme_support"
          target="_blank"
          className="flex items-center justify-between py-4 border-b border-slate-200 Nunito_Sans_SemiBold"
        >
          <p className="text-lg">{t("profile.help")}</p>
          <p className="flex items-center gap-2">
            Telegram
            <ChevronRight />
          </p>
        </Link>
      </div>

      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 mt-6 py-4 rounded-2xl bg-red-50 text-red-600 font-semibold active:scale-95 transition-transform"
      >
        <LogOut size={18} />
        {t("profile.logout")}
      </button>

      <LanguageModal isOpen={langModalOpen} onClose={handleModalClose} />
    </div>
  );
}
