import { products } from "../app/data/products";
import { OrderStatus } from "../app/lib/order-status";

export interface Order {
    orderId: string;
    orderPrice: number;
    createdAt: string;
    products: typeof products;
    address: string;
}

export interface CourierOrderProduct {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface CourierOrderDetail {
    id: string;
    courierId: string;
    orderId: string;
    status: OrderStatus;
    assignedAt?: string;
    enRouteToPickupAt?: string;
    atPickupAt?: string;
    pickedUpAt?: string;
    enRouteToDropOffAt?: string;
    atDropOffAt?: string;
    deliveredAt?: string;
    cancelledAt?: string;
    createdAt: string;
    updatedAt: string;
    order?: {
        id: string;
        totalPrice: number;
        address: string;
        createdAt: string;
        status: string;
        products?: CourierOrderProduct[];
    };
}

export interface CourierProfile {
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