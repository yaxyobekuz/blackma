"use client"
import PageHeading from "../ui/PageHeading";
import ProfileTopBar from "../ui/TopBar";
import UpdateProfileInfoFunction from "./features/UpdateProfileInfoForm";
import useTranslate from "@/app/hooks/useTranslate";

export default function ProfileInfoPage() {
  const { t } = useTranslate();
  return (
    <div className="space-y-2 container">
      <ProfileTopBar title={t("navigation.profile")} path="/profile" />
      <UpdateProfileInfoFunction />
    </div>
  );
}
