import api from './api';

import {
  Pack,
  User,
} from '../types/api';

import {
  PurchasePackPayload,
  PackMessageResponse,
  ShopAccessResponse,
} from '../types/pack';

export const packService = {
  // =========================
  // Packs
  // =========================

  async getPacks(): Promise<Pack[]> {
    const { data } = await api.get<Pack[]>('/packs');

    return data;
  },

  async getDisplayedPacks(): Promise<Pack[]> {
    const { data } = await api.get<Pack[]>(
      '/packs/displayed'
    );

    return data;
  },

  async createPack(
    formData: FormData
  ): Promise<Pack> {
    const { data } = await api.post<Pack>(
      '/packs',
      formData
    );

    return data;
  },

  async updatePack(
    packId: string,
    formData: FormData
  ): Promise<Pack> {
    const { data } = await api.put<Pack>(
      `/packs/${packId}`,
      formData
    );

    return data;
  },

  async deletePack(
    packId: string
  ): Promise<PackMessageResponse> {
    const { data } =
      await api.delete<PackMessageResponse>(
        `/packs/${packId}`
      );

    return data;
  },

  // =========================
  // Purchases
  // =========================

  async purchasePack(
    packId: string,
    payload: PurchasePackPayload
  ): Promise<PackMessageResponse> {
    const { data } =
      await api.post<PackMessageResponse>(
        `/packs/purchase/${packId}`,
        payload
      );

    return data;
  },

  //reject access
  async deletePurchase(
    userId: string,
    packId: string
  ): Promise<PackMessageResponse> {
    const { data } =
      await api.delete<PackMessageResponse>(
        `/packs/purchase/${userId}/${packId}`
      );

    return data;
  },

  // =========================
  // Access Management
  // =========================

  async grantAccess(
    userId: string,
    packId: string
  ): Promise<PackMessageResponse> {
    const { data } =
      await api.post<PackMessageResponse>(
        `/packs/grant-access/${userId}/${packId}`
      );

    return data;
  },

  async checkAccess(): Promise<ShopAccessResponse> {
    const { data } =
      await api.get<ShopAccessResponse>(
        '/packs/check-access'
      );

    return data;
  },

  // =========================
  // User Packs
  // =========================

  async getPurchasedPacks(): Promise<User> {
    const { data } = await api.get<User>(
      '/packs/purchased-packs'
    );

    return data;
  },

  // =========================
  // Admin Purchases
  // =========================

  async getPendingPurchases(): Promise<User[]> {
    const { data } = await api.get<User[]>(
      '/packs/pending-purchases'
    );

    return data;
  },
};