import { Order } from './api';

export interface OrderItemPayload {
    articleId: string;
    quantity: number;
    volume?: 1 | 2 | 5;
    price?: number;
    CO2?: number;
}

export interface CreateOrderPayload {
    items: OrderItemPayload[];

    deliveryOption: 'custom' | 'collection';

    deliveryDate: string;

    usePoints: boolean;

    pointsToUse: number;

    type: 'shop' | 'refill';
}

export interface UserPointsResponse {
    points: number;
    CO2Saved: number;
}

export interface DeleteOrderResponse {
    message: string;
}