"use client"
import { useState, useEffect } from "react";
import { Pen } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Image from "next/image";
import Man from "@/assets/profiles/profile.jpg"
import useTranslate from "@/app/hooks/useTranslate";
import {
  getCourierById,
  updateCourier,
  changePassword,
  Courier,
} from "@/app/lib/courier.service";

export default function UpdateProfileInfoFunction() {
  const { t } = useTranslate();

  const [courier, setCourier] = useState<Courier | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdMsg, setPwdMsg] = useState<string | null>(null);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [savingPwd, setSavingPwd] = useState(false);

  useEffect(() => {
    const courierId = localStorage.getItem("courier_id");
    if (!courierId) return;
    getCourierById(courierId).then((data) => {
      setCourier(data);
      setName(data.name ?? "");
      setPhone(data.phone ?? "");
      setEmail(data.email ?? "");
    }).catch(console.error);
  }, []);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const courierId = localStorage.getItem("courier_id");
    if (!courierId) return;

    setSaveMsg(null);
    setSaveError(null);
    setSavingProfile(true);
    try {
      const updated = await updateCourier(courierId, { name, phone, email });
      setCourier(updated);
      localStorage.setItem("courier_name", updated.name);
      setSaveMsg("Ma'lumotlar saqlandi");
    } catch (e: unknown) {
      setSaveError(e instanceof Error ? e.message : "Xato yuz berdi");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const courierId = localStorage.getItem("courier_id");
    if (!courierId) return;

    setPwdMsg(null);
    setPwdError(null);

    if (newPassword !== confirmPassword) {
      setPwdError("Yangi parollar mos kelmaydi");
      return;
    }
    if (newPassword.length < 6) {
      setPwdError("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
      return;
    }

    setSavingPwd(true);
    try {
      await changePassword(courierId, oldPassword, newPassword, confirmPassword);
      setPwdMsg("Parol muvaffaqiyatli o'zgartirildi");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e: unknown) {
      setPwdError(e instanceof Error ? e.message : "Xato yuz berdi");
    } finally {
      setSavingPwd(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile update form */}
      <form onSubmit={handleProfileSave} className="space-y-3">
        <div>
          <label
            htmlFor="avatar"
            className="w-28 h-28 border border-slate-300 flex p-2 rounded-full relative"
          >
            <span className="bg-blue-500 absolute text-white p-2 rounded-full border-2 border-white top-0 right-0">
              <Pen size={16} />
            </span>
            <Image
              src={Man}
              alt="profile pic"
              className="w-full h-full object-cover aspect-square rounded-full"
              width={112}
              height={112}
            />
          </label>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="name">{t("profile.name")}</label>
          <Input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="tel">{t("profile.phone")}</label>
          <Input
            type="tel"
            id="tel"
            name="phone"
            value={phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <Input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />
        </div>
        {saveMsg && <p className="text-green-600 text-sm">{saveMsg}</p>}
        {saveError && <p className="text-red-500 text-sm">{saveError}</p>}
        <Button disabled={savingProfile}>
          {savingProfile ? "Saqlanmoqda..." : t("profile.save_changes")}
        </Button>
      </form>

      {/* Change password form */}
      <form onSubmit={handleChangePassword} className="space-y-3 border-t pt-4">
        <h3 className="font-semibold text-lg">Parolni o'zgartirish</h3>
        <div className="flex flex-col gap-1">
          <label htmlFor="oldPassword">Joriy parol</label>
          <Input
            type="password"
            id="oldPassword"
            name="oldPassword"
            value={oldPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOldPassword(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="newPassword">Yangi parol</label>
          <Input
            type="password"
            id="newPassword"
            name="newPassword"
            value={newPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="confirmPassword">Yangi parolni tasdiqlang</label>
          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
          />
        </div>
        {pwdMsg && <p className="text-green-600 text-sm">{pwdMsg}</p>}
        {pwdError && <p className="text-red-500 text-sm">{pwdError}</p>}
        <Button disabled={savingPwd}>
          {savingPwd ? "Yuklanmoqda..." : "Parolni o'zgartirish"}
        </Button>
      </form>
    </div>
  );
}
