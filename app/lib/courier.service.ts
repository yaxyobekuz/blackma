import { apiFetch, apiFetchRaw } from "./api";

export interface LoginResponse {
  code: number;
  msg: string;
  data: {
    accessToken: string;
    refreshToken: string;
    courier: {
      id: string;
      name: string;
      phone: string;
      status: string;
    };
  };
}

export interface CourierOrder {
  id: string;
  courierId: string;
  orderId: string;
  status: "ASSIGNED" | "PICKED_UP" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED";
  assignedAt?: string;
  completedAt?: string;
  statusHistory?: Partial<Record<"ASSIGNED" | "PICKED_UP" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED", string>>;
  createdAt: string;
  updatedAt: string;
  order?: {
    id: string;
    totalPrice: number;
    address: string;
    createdAt: string;
    status: string;
    products?: {
      id: string;
      name: string;
      price: number;
      quantity: number;
    }[];
  };
}

export interface Courier {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: string;
  car?: {
    model: string;
    number: string;
    color: string;
  };
}

export interface CourierStats {
  totalDeliveries: number;
  completedDeliveries: number;
  cancelledDeliveries: number;
  averageDeliveryTime?: number;
}

export async function courierLogin(
  phone: string,
  password: string
): Promise<LoginResponse> {
  return apiFetchRaw<LoginResponse>("/api/couriers/login", {
    method: "POST",
    body: JSON.stringify({ phone, password }),
  });
}

export async function getCourierById(courierId: string): Promise<Courier> {
  return apiFetch<Courier>(`/api/couriers/${courierId}`);
}

export async function updateCourier(
  courierId: string,
  data: Partial<Pick<Courier, "name" | "phone" | "email" | "status">>
): Promise<Courier> {
  return apiFetch<Courier>(`/api/couriers/${courierId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function getCourierOrders(
  courierId: string,
  status?: string,
  limit = 20,
  offset = 0
): Promise<{ orders: CourierOrder[] }> {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  if (status) params.set("status", status);
  return apiFetch<{ orders: CourierOrder[] }>(`/api/couriers/${courierId}/orders?${params}`);
}

export async function getCourierOrderById(
  courierOrderId: string
): Promise<CourierOrder> {
  return apiFetch<CourierOrder>(`/api/couriers/orders/${courierOrderId}`);
}

export async function getOrderByCourierOrderId(
  orderId: string
): Promise<CourierOrder> {
  return apiFetch<CourierOrder>(`/api/couriers/orders/by-order/${orderId}`);
}

export async function updateCourierOrder(
  courierOrderId: string,
  status: string,
  completedAt?: string
): Promise<CourierOrder> {
  return apiFetch<CourierOrder>(`/api/couriers/orders/${courierOrderId}`, {
    method: "PUT",
    body: JSON.stringify({ status, ...(completedAt ? { completedAt } : {}) }),
  });
}

export async function getCourierStats(
  courierId: string
): Promise<CourierStats> {
  return apiFetch<CourierStats>(`/api/couriers/${courierId}/stats`);
}

export async function changePassword(
  courierId: string,
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
): Promise<void> {
  return apiFetch<void>(`/api/couriers/${courierId}/change-password`, {
    method: "POST",
    body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
  });
}
