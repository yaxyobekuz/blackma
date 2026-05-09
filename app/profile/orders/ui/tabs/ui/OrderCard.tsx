import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/app/utils/date.formater";
import {
  STATUS_LABELS,
  STATUS_COLORS,
  OrderStatus,
} from "@/app/lib/order-status";

export default function OrderCard({
  order,
}: {
  order: { id: string; createdAt: string; status: string };
}) {
  return (
    <Link
      href={`/orders/${order.id}`}
      className="flex items-center justify-between py-3 border-b border-slate-200 hover:bg-gray-50 transition last:border-0"
    >
      <div className="flex flex-col gap-1">
        <p className="text-base font-semibold">#{order.id.slice(0, 8)}</p>
        <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLORS[order.status as OrderStatus] ?? "bg-gray-100 text-gray-600"}`}
        >
          {STATUS_LABELS[order.status as OrderStatus] ?? order.status}
        </span>
        <ChevronRight className="w-5 h-5 text-black" />
      </div>
    </Link>
  );
}
