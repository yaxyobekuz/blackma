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
import {
  STATUS_LABELS,
  NEXT_STATUS,
  NEXT_STATUS_LABEL,
  STATUS_TIMESTAMP_FIELD,
  ORDER_STATUS_FLOW,
  isTerminalStatus,
  OrderStatus,
} from "@/app/lib/order-status";
import { formatDate } from "@/app/utils/date.formater";

const TIMESTAMP_LABEL_KEYS: Partial<Record<OrderStatus, string>> = {
  EN_ROUTE_TO_PICKUP: "order.en_route_to_pickup_at",
  AT_PICKUP: "order.at_pickup_at",
  PICKED_UP: "order.picked_up_at",
  EN_ROUTE_TO_DROP_OFF: "order.en_route_to_drop_off_at",
  AT_DROP_OFF: "order.at_drop_off_at",
  DELIVERED: "order.delivered_at",
  CANCELLED: "order.cancelled_at",
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
      const updated = await updateCourierOrder(order.id, next);
      setOrder({ ...updated, order: order.order });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Xato yuz berdi");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = async () => {
    if (!order) return;
    setUpdating(true);
    try {
      const updated = await updateCourierOrder(order.id, "CANCELLED");
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
  const showActions = !isTerminalStatus(order.status);

  const timestampRows: { status: OrderStatus; value: string }[] = [];
  for (const s of ORDER_STATUS_FLOW) {
    if (s === "ASSIGNED") continue;
    const field = STATUS_TIMESTAMP_FIELD[s] as keyof CourierOrder | undefined;
    if (field && order[field]) {
      timestampRows.push({ status: s, value: order[field] as string });
    }
  }
  if (order.cancelledAt) {
    timestampRows.push({ status: "CANCELLED", value: order.cancelledAt });
  }

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
        {timestampRows.map(({ status, value }) => (
          <InfoRow
            key={status}
            label={t(TIMESTAMP_LABEL_KEYS[status] ?? "order.status")}
            value={formatDate(value)}
          />
        ))}
        {order.order?.address && (
          <InfoRow label={t("order.address")} value={order.order.address} />
        )}
      </SectionCard>

      {order.statusHistory && Object.keys(order.statusHistory).length > 0 && (
        <SectionCard title={t("order.status_history")}>
          {[...ORDER_STATUS_FLOW, "CANCELLED" as const].map((s) =>
            order.statusHistory?.[s] ? (
              <div key={s} className="flex justify-between text-sm py-1">
                <span className="text-gray-600">{STATUS_LABELS[s]}</span>
                <span className="font-medium">{formatDate(order.statusHistory[s]!)}</span>
              </div>
            ) : null,
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

      {showActions && (
        <div className="bg-white pt-2 flex gap-2">
          {nextStatus && (
            <button
              onClick={handleStatusUpdate}
              disabled={updating}
              className="flex-1 bg-black text-white font-semibold py-4 rounded-2xl active:scale-95 transition-transform disabled:opacity-60"
            >
              {updating ? "Yuklanmoqda..." : NEXT_STATUS_LABEL[order.status]}
            </button>
          )}
          <button
            onClick={handleCancel}
            disabled={updating}
            className="bg-red-50 text-red-600 font-semibold py-4 px-5 rounded-2xl active:scale-95 transition-transform disabled:opacity-60"
          >
            {t("order.cancel_button")}
          </button>
        </div>
      )}

      {order.status === "DELIVERED" && (
        <div className="text-center text-green-600 font-semibold py-3">
          Buyurtma muvaffaqiyatli yetkazildi ✓
        </div>
      )}

      {order.status === "CANCELLED" && (
        <div className="text-center text-red-500 font-semibold py-3">
          {t("order.cancelled_message")}
        </div>
      )}
    </section>
  );
};

export default Page;
