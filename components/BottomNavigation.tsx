"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User } from "lucide-react";
import useTranslate from "../app/hooks/useTranslate";

const NAV_ITEMS = [
  { path: "/", labelKey: "navigation.home", Icon: Home },
  { path: "/profile", labelKey: "navigation.profile", Icon: User },
];

const AUTH_ROUTES = ["/login"];

export default function BottomNavigation() {
  const pathname = usePathname();
  const { t } = useTranslate();  // ← shu qator qo'shildi

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  if (isAuthRoute) return null;

  return (
    <section className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-300 py-2 z-0">
      <nav className="max-w-xl mx-auto">
        <div className="flex justify-around items-center h-16 pb-[env(safe-area-inset-bottom)]">
          {NAV_ITEMS.map(({ path, labelKey, Icon }) => {
            const active = pathname === path;
            return (
              <Link
                key={path}
                href={path}
                className="flex flex-col items-center gap-1 px-8 py-2 rounded-xl active:scale-95 active:bg-gray-50 transition-all duration-150 select-none"
              >
                <Icon
                  size={24}
                  strokeWidth={active ? 2.2 : 1.8}
                  className={active ? "text-gray-900" : "text-gray-400"}
                />
                <span
                  className={`text-[11px] tracking-wide ${active
                    ? "text-gray-900 font-semibold"
                    : "text-gray-400 font-medium"
                    }`}
                >
                  {t(labelKey)}
                </span>
                <span
                  className={`w-1 h-1 rounded-full bg-gray-900 transition-all duration-200 ${active ? "opacity-100 scale-100" : "opacity-0 scale-0"
                    }`}
                />
              </Link>
            );
          })}
        </div>
      </nav>
    </section>
  );
}