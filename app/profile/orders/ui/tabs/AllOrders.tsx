import { CourierOrder } from "@/app/lib/courier.service";
import OrderCard from "./ui/OrderCard";

export default function AllOrders({ orders }: { orders: CourierOrder[] }) {
  if (orders.length === 0) {
    return (
      <p className="text-center text-gray-400 py-10">Buyurtmalar yo'q</p>
    );
  }

  return (
    <div>
      {orders.map((o) => (
        <OrderCard key={o.id} order={o} />
      ))}
    </div>
  );
}
