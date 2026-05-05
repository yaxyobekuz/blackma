import { ChevronRight } from "lucide-react";
import Link from "next/link";
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

export default function OrderCard({
  order,
}: {
  order: { id: string; createdAt: string; status: string };
}) {
  return (
    <Link
      href={`/orders/${order.id}`}
      className="flex items-center justify-between py-3 border-b border-slate-200 hover:bg-gray-50 transition"
    >
      <div className="flex flex-col gap-1">
        <p className="text-base font-semibold">#{order.id.slice(0, 8)}</p>
        <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
          {STATUS_LABELS[order.status] ?? order.status}
        </span>
        <ChevronRight className="w-5 h-5 text-black" />
      </div>
    </Link>
  );
}
