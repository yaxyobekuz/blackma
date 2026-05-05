import { CourierOrder } from "@/app/lib/courier.service";
import AllOrders from "./tabs/AllOrders";
import NewOrders from "./tabs/NewOrders";

export default function TabsContent({
  activeTab,
  orders,
}: {
  activeTab: string;
  orders: CourierOrder[];
}) {
  const newOrders = orders.filter((o) => o.status === "ASSIGNED");
  const allOrders = orders;

  switch (activeTab) {
    case "new":
      return <NewOrders orders={newOrders} />;
    case "all":
      return <AllOrders orders={allOrders} />;
  }
}
