import api from './api';

import {
  Cart,
  RefillCart,
} from '../types/api';

import {
  CartItemPayload,
  RefillCartItemPayload,
  ClearCartResponse,
  ClearRefillCartResponse,
} from '../types/cart';

export const cartService = {
  // =========================
  // Shop Cart
  // =========================

  async getCart(): Promise<Cart> {
    const { data } = await api.get<Cart>('/cart');

    return data;
  },

  async addToCart(
    payload: CartItemPayload
  ): Promise<Cart> {
    const { data } = await api.post<Cart>(
      '/cart/add',
      payload
    );

    return data;
  },

  async updateCart(
    payload: CartItemPayload
  ): Promise<Cart> {
    const { data } = await api.put<Cart>(
      '/cart/update',
      payload
    );

    return data;
  },

  async removeFromCart(
    articleId: string
  ): Promise<Cart> {
    const { data } = await api.delete<Cart>(
      `/cart/remove/${articleId}`
    );

    return data;
  },

  async clearCart(): Promise<ClearCartResponse> {
    const { data } =
      await api.delete<ClearCartResponse>(
        '/cart/clear'
      );

    return data;
  },

  // =========================
  // Refill Cart
  // =========================

  async getRefillCart(): Promise<RefillCart> {
    const { data } = await api.get<RefillCart>(
      '/refill-cart'
    );

    return data;
  },

  async addToRefillCart(
    payload: RefillCartItemPayload
  ): Promise<RefillCart> {
    const { data } = await api.post<RefillCart>(
      '/refill-cart/add',
      payload
    );

    return data;
  },

  async updateRefillCart(
    payload: RefillCartItemPayload
  ): Promise<RefillCart> {
    const { data } = await api.put<RefillCart>(
      '/refill-cart/update',
      payload
    );

    return data;
  },

  async removeFromRefillCart(
    articleId: string
  ): Promise<RefillCart> {
    const { data } = await api.delete<RefillCart>(
      `/refill-cart/remove/${articleId}`
    );

    return data;
  },

  async clearRefillCart(): Promise<ClearRefillCartResponse> {
    const { data } =
      await api.delete<ClearRefillCartResponse>(
        '/refill-cart/clear'
      );

    return data;
  },
};