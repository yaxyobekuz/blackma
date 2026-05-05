"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { formatDate } from "@/app/utils/date.formater";

const STATUS_LABELS: Record<string, string> = {
  ASSIGNED: "Tayinlangan",
  PICKED_UP: "Olib ketildi",
  IN_TRANSIT: "Yo'lda",
  DELIVERED: "Yetkazildi",
  CANCELLED: "Bekor qilindi",
};

const STATUS_COLORS: Record<string, string> = {
  ASSIGNED: "bg-blue-100 text-blue-700",
  PICKED_UP: "bg-yellow-100 text-yellow-700",
  IN_TRANSIT: "bg-orange-100 text-orange-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

type OrderCardProps = {
  orderId: string;
  createdAt: string;
  status: string;
};

const OrderCard = ({ orderId, createdAt, status }: OrderCardProps) => {
  return (
    <Link
      href={`/orders/${orderId}`}
      className="flex items-center justify-between pb-1 px-1 pt-4 border-b border-b-gray-300 hover:bg-gray-50 transition"
    >
      <div className="flex flex-col gap-1">
        <span className="text-base font-semibold">#{orderId.slice(0, 8)}</span>
        <span className="text-xs text-gray-500">{formatDate(createdAt)}</span>
      </div>

      <div className="flex items-center gap-3">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLORS[status] ?? "bg-gray-100 text-gray-600"}`}>
          {STATUS_LABELS[status] ?? status}
        </span>
        <ChevronRight className="w-5 h-5 text-black" />
      </div>
    </Link>
  );
};

export default OrderCard;
