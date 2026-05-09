"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { formatDate } from "@/app/utils/date.formater";
import { STATUS_LABELS, STATUS_COLORS, OrderStatus } from "@/app/lib/order-status";

type OrderCardProps = {
  orderId: string;
  createdAt: string;
  status: string;
};

const OrderCard = ({ orderId, createdAt, status }: OrderCardProps) => {
  return (
    <Link
      href={`/orders/${orderId}`}
      className="flex items-center justify-between pb-1 px-1 pt-4 border-b border-b-gray-300 hover:bg-gray-50 transition last:border-0"
    >
      <div className="flex flex-col gap-1">
        <span className="text-base font-semibold">#{orderId.slice(0, 8)}</span>
        <span className="text-xs text-gray-500">{formatDate(createdAt)}</span>
      </div>

      <div className="flex items-center gap-3">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLORS[status as OrderStatus] ?? "bg-gray-100 text-gray-600"}`}>
          {STATUS_LABELS[status as OrderStatus] ?? status}
        </span>
        <ChevronRight className="w-5 h-5 text-black" />
      </div>
    </Link>
  );
};

export default OrderCard;
