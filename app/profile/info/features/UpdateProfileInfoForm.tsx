"use client";
import { useState, useEffect } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import PasswordInput from "../ui/PasswordInput";
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
    getCourierById(courierId)
      .then((data) => {
        setCourier(data);
        setName(data.name ?? "");
        setPhone(data.phone ?? "");
        setEmail(data.email ?? "");
      })
      .catch(console.error);
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
      setSaveMsg(t("profile.info_saved_success"));
    } catch (e: unknown) {
      setSaveError(e instanceof Error ? e.message : t("common.error"));
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
      setPwdError(t("profile.passwords_mismatch"));
      return;
    }
    if (newPassword.length < 6) {
      setPwdError(t("auth.password_min_length"));
      return;
    }

    setSavingPwd(true);
    try {
      await changePassword(
        courierId,
        oldPassword,
        newPassword,
        confirmPassword,
      );
      setPwdMsg(t("profile.password_changed_success"));
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e: unknown) {
      setPwdError(e instanceof Error ? e.message : t("common.error"));
    } finally {
      setSavingPwd(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile update form */}
      <form onSubmit={handleProfileSave} className="space-y-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="name">{t("profile.name")}</label>
          <Input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="tel">{t("profile.phone")}</label>
          <Input
            type="tel"
            id="tel"
            name="phone"
            value={phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPhone(e.target.value)
            }
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <Input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
        </div>

        {saveMsg && <p className="text-green-600 text-sm">{saveMsg}</p>}

        {saveError && <p className="text-red-500 text-sm">{saveError}</p>}

        <Button disabled={savingProfile}>
          {savingProfile ? t("profile.saving") : t("profile.save_changes")}
        </Button>
      </form>

      {/* Change password form */}
      <form onSubmit={handleChangePassword} className="space-y-3 border-t pt-4">
        <h3 className="font-semibold text-lg">{t("profile.change_password")}</h3>
        <div className="flex flex-col gap-1">
          <label htmlFor="oldPassword">{t("profile.old_password")}</label>
          <PasswordInput
            id="oldPassword"
            name="oldPassword"
            value={oldPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setOldPassword(e.target.value)
            }
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="newPassword">{t("profile.new_password")}</label>
          <PasswordInput
            id="newPassword"
            name="newPassword"
            value={newPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewPassword(e.target.value)
            }
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="confirmPassword">{t("profile.confirm_new_password")}</label>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setConfirmPassword(e.target.value)
            }
          />
        </div>
        {pwdMsg && <p className="text-green-600 text-sm">{pwdMsg}</p>}
        {pwdError && <p className="text-red-500 text-sm">{pwdError}</p>}
        <Button disabled={savingPwd}>
          {savingPwd ? t("profile.saving") : t("profile.change_password")}
        </Button>
      </form>
    </div>
  );
}
