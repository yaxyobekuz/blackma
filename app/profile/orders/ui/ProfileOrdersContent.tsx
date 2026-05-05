"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProfileTopBar from "../../ui/TopBar";
import Tabs from "./Tabs";
import TabsContent from "./TabContent";
import useTranslate from "@/app/hooks/useTranslate";
import { getCourierOrders, CourierOrder } from "@/app/lib/courier.service";

export default function ProfileOrdersContent() {
  const { t } = useTranslate();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "new";

  const [orders, setOrders] = useState<CourierOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const courierId = localStorage.getItem("courier_id");
    if (!courierId) return;

    getCourierOrders(courierId)
      .then((res) => {
        setOrders(Array.isArray(res.orders) ? res.orders : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-2 container">
      <ProfileTopBar title={t("orders.my_orders")} path="/profile" />
      <Tabs activeTab={tab} />
      <br />
      {loading ? (
        <p className="text-center text-gray-400 py-10">Yuklanmoqda...</p>
      ) : (
        <TabsContent activeTab={tab} orders={orders} />
      )}
    </div>
  );
}
