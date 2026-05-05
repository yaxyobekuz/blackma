"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { SectionCard } from "@/components/SectionCard";
import { InfoRow } from "@/components/InfoRow";
import useAuth from "@/app/hooks/useAuth";
import useTranslate from "@/app/hooks/useTranslate";
import {
  getCourierOrderById,
  updateCourierOrder,
  CourierOrder,
} from "@/app/lib/courier.service";
import { formatDate } from "@/app/utils/date.formater";

const STATUS_LABELS: Record<string, string> = {
  ASSIGNED: "Tayinlangan",
  PICKED_UP: "Olib ketildi",
  IN_TRANSIT: "Yo'lda",
  DELIVERED: "Yetkazildi",
  CANCELLED: "Bekor qilindi",
};

const NEXT_STATUS: Record<string, string | null> = {
  ASSIGNED: "PICKED_UP",
  PICKED_UP: "IN_TRANSIT",
  IN_TRANSIT: "DELIVERED",
  DELIVERED: null,
  CANCELLED: null,
};

const NEXT_STATUS_LABEL: Record<string, string> = {
  ASSIGNED: "Olib ketdim",
  PICKED_UP: "Yo'lga chiqdim",
  IN_TRANSIT: "Yetkazdim",
};

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const { t } = useTranslate();
  const orderId = params.order_id as string;

  useAuth();

  const [order, setOrder] = useState<CourierOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    getCourierOrderById(orderId)
      .then(setOrder)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleStatusUpdate = async () => {
    if (!order) return;
    const next = NEXT_STATUS[order.status];
    if (!next) return;

    setUpdating(true);
    try {
      const completedAt =
        next === "DELIVERED" ? new Date().toISOString() : undefined;
      const updated = await updateCourierOrder(order.id, next, completedAt);
      // response da order (nested) qaytmaydi, shuning uchun mavjud order ni saqlab qo'yamiz
      setOrder({ ...updated, order: order.order });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Xato yuz berdi");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <section className="p-4 flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Yuklanmoqda...</p>
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className="p-4 flex flex-col items-center justify-center min-h-screen gap-3">
        <p className="text-red-500">{error || "Buyurtma topilmadi"}</p>
        <button
          onClick={() => router.back()}
          className="text-blue-500 underline"
        >
          Orqaga
        </button>
      </section>
    );
  }

  const totalPrice = order.order?.totalPrice ?? 0;
  const formattedPrice = totalPrice.toLocaleString("uz-UZ");
  const nextStatus = NEXT_STATUS[order.status];

  return (
    <section className="p-4 space-y-4 pb-24 container">
      <div className="flex items-center justify-center relative">
        <ChevronLeft
          size={25}
          className="text-black cursor-pointer absolute left-0"
          onClick={() => router.back()}
        />
        <h1 className="font-bold text-2xl text-center">{t("order.title")}</h1>
      </div>

      <SectionCard title={t("order.details")}>
        <InfoRow
          label={t("order.status")}
          value={STATUS_LABELS[order.status] ?? order.status}
        />
        <InfoRow label={t("order.date")} value={formatDate(order.createdAt)} />
        {order.assignedAt && (
          <InfoRow label={t("order.assigned_at")} value={formatDate(order.assignedAt)} />
        )}
        {order.completedAt && (
          <InfoRow label={t("order.completed_at")} value={formatDate(order.completedAt)} />
        )}
        {order.order?.address && (
          <InfoRow label={t("order.address")} value={order.order.address} />
        )}
      </SectionCard>

      {order.statusHistory && Object.keys(order.statusHistory).length > 0 && (
        <SectionCard title={t("order.status_history")}>
          {(["ASSIGNED", "PICKED_UP", "IN_TRANSIT", "DELIVERED", "CANCELLED"] as const).map(
            (s) =>
              order.statusHistory?.[s] ? (
                <div key={s} className="flex justify-between text-sm py-1">
                  <span className="text-gray-600">{STATUS_LABELS[s]}</span>
                  <span className="font-medium">{formatDate(order.statusHistory[s]!)}</span>
                </div>
              ) : null
          )}
        </SectionCard>
      )}

      {order.order?.products && order.order.products.length > 0 && (
        <SectionCard title={t("order.payment_details")}>
          {order.order.products.map((product) => (
            <div key={product.id} className="flex justify-between text-sm py-1">
              <span>
                {product.name} × {product.quantity}
              </span>
              <span>
                {product.price.toLocaleString("uz-UZ")} {t("orders.sum")}
              </span>
            </div>
          ))}
          <span className="w-full flex border-b border-b-slate-300" />
          <div className="flex justify-between font-bold">
            <span>{t("order.grand_total")}</span>
            <span>
              {formattedPrice} {t("orders.sum")}
            </span>
          </div>
        </SectionCard>
      )}

      {nextStatus && (
        <div className="bg-white pt-2">
          <button
            onClick={handleStatusUpdate}
            disabled={updating}
            className="w-full bg-black text-white font-semibold py-4 rounded-2xl active:scale-95 transition-transform disabled:opacity-60"
          >
            {updating ? "Yuklanmoqda..." : NEXT_STATUS_LABEL[order.status]}
          </button>
        </div>
      )}

      {!nextStatus && order.status === "DELIVERED" && (
        <div className="text-center text-green-600 font-semibold py-3">
          Buyurtma muvaffaqiyatli yetkazildi ✓
        </div>
      )}
    </section>
  );
};

export default Page;
