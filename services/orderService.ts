import api from './api';

import { Order } from '../types/api';

import {
  CreateOrderPayload,
  UserPointsResponse,
  DeleteOrderResponse,
} from '../types/order';

export const orderService = {
  // =========================
  // Order Creation
  // =========================

  async createOrder(
    payload: CreateOrderPayload
  ): Promise<Order> {
    const { data } = await api.post<Order>(
      '/orders/create',
      payload
    );

    return data;
  },

  // =========================
  // Admin Orders
  // =========================

  async getAdminOrders(): Promise<Order[]> {
    const { data } = await api.get<Order[]>(
      '/orders/admin'
    );

    return data;
  },

  async getAdminShopOrders(): Promise<Order[]> {
    const { data } = await api.get<Order[]>(
      '/orders/admin/shop'
    );

    return data;
  },

  async getAdminRefillOrders(): Promise<Order[]> {
    const { data } = await api.get<Order[]>(
      '/orders/admin/refill'
    );

    return data;
  },

  async confirmOrder(
    orderId: string
  ): Promise<Order> {
    const { data } = await api.patch<Order>(
      `/orders/confirm/${orderId}`
    );

    return data;
  },

  async deleteOrder(
    orderId: string
  ): Promise<DeleteOrderResponse> {
    const { data } =
      await api.delete<DeleteOrderResponse>(
        `/orders/${orderId}`
      );

    return data;
  },

  // =========================
  // User Orders
  // =========================

  async getUserShopOrders(): Promise<Order[]> {
    const { data } = await api.get<Order[]>(
      '/orders/user/shop'
    );

    return data;
  },

  async getUserRefillOrders(): Promise<Order[]> {
    const { data } = await api.get<Order[]>(
      '/orders/user/refill'
    );

    return data;
  },

  // =========================
  // User Statistics
  // =========================

  async getUserPoints(): Promise<UserPointsResponse> {
    const { data } =
      await api.get<UserPointsResponse>(
        '/orders/points'
      );

    return data;
  },
};