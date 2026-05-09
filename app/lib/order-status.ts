export type OrderStatus =
  | "ASSIGNED"
  | "EN_ROUTE_TO_PICKUP"
  | "AT_PICKUP"
  | "PICKED_UP"
  | "EN_ROUTE_TO_DROP_OFF"
  | "AT_DROP_OFF"
  | "DELIVERED"
  | "CANCELLED";

export const ORDER_STATUS_FLOW: readonly OrderStatus[] = [
  "ASSIGNED",
  "EN_ROUTE_TO_PICKUP",
  "AT_PICKUP",
  "PICKED_UP",
  "EN_ROUTE_TO_DROP_OFF",
  "AT_DROP_OFF",
  "DELIVERED",
] as const;

export const TERMINAL_STATUSES: readonly OrderStatus[] = [
  "DELIVERED",
  "CANCELLED",
] as const;

export const STATUS_LABELS: Record<OrderStatus, string> = {
  ASSIGNED: "Tayinlangan",
  EN_ROUTE_TO_PICKUP: "Olib ketishga yo'lda",
  AT_PICKUP: "Olib ketish joyida",
  PICKED_UP: "Olib ketildi",
  EN_ROUTE_TO_DROP_OFF: "Yetkazishga yo'lda",
  AT_DROP_OFF: "Yetkazish joyida",
  DELIVERED: "Yetkazildi",
  CANCELLED: "Bekor qilindi",
};

export const STATUS_COLORS: Record<OrderStatus, string> = {
  ASSIGNED: "bg-blue-100 text-blue-700",
  EN_ROUTE_TO_PICKUP: "bg-sky-100 text-sky-700",
  AT_PICKUP: "bg-indigo-100 text-indigo-700",
  PICKED_UP: "bg-yellow-100 text-yellow-700",
  EN_ROUTE_TO_DROP_OFF: "bg-orange-100 text-orange-700",
  AT_DROP_OFF: "bg-amber-100 text-amber-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  ASSIGNED: "EN_ROUTE_TO_PICKUP",
  EN_ROUTE_TO_PICKUP: "AT_PICKUP",
  AT_PICKUP: "PICKED_UP",
  PICKED_UP: "EN_ROUTE_TO_DROP_OFF",
  EN_ROUTE_TO_DROP_OFF: "AT_DROP_OFF",
  AT_DROP_OFF: "DELIVERED",
  DELIVERED: null,
  CANCELLED: null,
};

export const NEXT_STATUS_LABEL: Partial<Record<OrderStatus, string>> = {
  ASSIGNED: "Olib ketishga yo'lga chiqdim",
  EN_ROUTE_TO_PICKUP: "Olib ketish joyiga yetdim",
  AT_PICKUP: "Olib ketdim",
  PICKED_UP: "Yetkazishga yo'lga chiqdim",
  EN_ROUTE_TO_DROP_OFF: "Yetkazish joyiga yetdim",
  AT_DROP_OFF: "Yetkazdim",
};

export const STATUS_TIMESTAMP_FIELD: Partial<Record<OrderStatus, string>> = {
  EN_ROUTE_TO_PICKUP: "enRouteToPickupAt",
  AT_PICKUP: "atPickupAt",
  PICKED_UP: "pickedUpAt",
  EN_ROUTE_TO_DROP_OFF: "enRouteToDropOffAt",
  AT_DROP_OFF: "atDropOffAt",
  DELIVERED: "deliveredAt",
  CANCELLED: "cancelledAt",
};

export function isTerminalStatus(status: string): boolean {
  return TERMINAL_STATUSES.includes(status as OrderStatus);
}

export function getNextStatus(status: OrderStatus): OrderStatus | null {
  return NEXT_STATUS[status];
}
