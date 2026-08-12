import api from './api';

import {
  User,
  Collection,
  Reservation,
  Action,
  BadgeCriteria,
  Chiffre,
} from '../types/api';

import {
  SetCollectionDatesPayload,
  UpdateBadgeCriteriaPayload,
  UpdateChiffrePayload,
  ReservationResponsePayload,
  HandleReportedReservationPayload,
  UpdateReservationPayload,
  CreateActionPayload,
  UpdateActionPayload,
  UsersResponse,
  ReservationsResponse,
  ActionsResponse,
  ChiffresResponse,
  MessageResponse,
  EnterpriseDecisionResponse,
  ReservationActionResponse,
  ChiffreResponse,
  ActionResponse,
} from '../types/admin';
import { EnterpriseDecisionPayload } from '@/types/user';

export const adminService = {
  // =========================
  // Users
  // =========================

  async getUsersByRole(role: string): Promise<UsersResponse> {
    const { data } = await api.get<UsersResponse>(
      '/admin/users',
      {
        params: { role },
      }
    );

    return data;
  },

  async getAllUsers(): Promise<User[]> {
    const { data } = await api.get<User[]>(
      '/admin/all-users'
    );

    return data;
  },

  async getEnterprises(): Promise<User[]> {
    const { data } = await api.get<User[]>(
      '/admin/enterprises'
    );

    return data;
  },

  async acceptOrRefuseEnterprise(
    payload: EnterpriseDecisionPayload
  ): Promise<EnterpriseDecisionResponse> {
    const { data } =
      await api.put<EnterpriseDecisionResponse>(
        '/admin/accept-or-refuse',
        payload
      );

    return data;
  },

  // =========================
  // Collections
  // =========================

  async getAvailableCollections(): Promise<Collection[]> {
    const { data } = await api.get<Collection[]>(
      "/admin/available-collections"
    );

    return data;
  },

  async setCollectionDates(
    payload: SetCollectionDatesPayload
  ): Promise<Collection> {
    const { data } = await api.post<Collection>(
      "/admin/set-collection-dates",
      payload
    );

    return data;
  },

  async updateCollection(
    collectionId: string,
    payload: Partial<Collection>
  ): Promise<Collection> {
    const { data } = await api.put<Collection>(
      `/admin/collection/${collectionId}`,
      payload
    );

    return data;
  },

  async deleteCollection(
    collectionId: string
  ): Promise<MessageResponse> {
    const { data } = await api.delete<MessageResponse>(
      `/admin/collection/${collectionId}`
    );

    return data;
  },

  // =========================
  // Badge Criteria
  // =========================

  async getBadgeCriteria(): Promise<BadgeCriteria> {
    const { data } = await api.get<BadgeCriteria>(
      '/admin/badge-criteria'
    );

    return data;
  },

  async updateBadgeCriteria(
    payload: UpdateBadgeCriteriaPayload
  ): Promise<BadgeCriteria> {
    const { data } = await api.put<BadgeCriteria>(
      '/admin/badge-criteria',
      payload
    );

    return data;
  },

  // =========================
  // Chiffres
  // =========================

  async getChiffres(): Promise<ChiffresResponse> {
    const { data } = await api.get<ChiffresResponse>(
      '/admin/chiffres'
    );

    return data;
  },

  async updateChiffre(
    chiffreId: string,
    payload: UpdateChiffrePayload
  ): Promise<ChiffreResponse> {
    const { data } = await api.put<ChiffreResponse>(
      `/admin/chiffres/${chiffreId}`,
      payload
    );

    return data;
  },

  // =========================
  // Reservations
  // =========================

  async getReservations(): Promise<ReservationsResponse> {
    const { data } = await api.get<ReservationsResponse>(
      '/admin/reservations'
    );

    return data;
  },

  async getReservationsByDate(
    date: string
  ): Promise<ReservationsResponse> {
    const { data } =
      await api.get<ReservationsResponse>(
        '/admin/reservations-by-date',
        {
          params: { date },
        }
      );

    return data;
  },

  async respondToReservation(
    reservationId: string,
    payload: ReservationResponsePayload
  ): Promise<ReservationActionResponse> {
    const { data } =
      await api.post<ReservationActionResponse>(
        `/admin/reservations/${reservationId}/respond`,
        payload
      );

    return data;
  },

  async handleReportedReservation(
    reservationId: string,
    payload: HandleReportedReservationPayload
  ): Promise<ReservationActionResponse> {
    const { data } =
      await api.post<ReservationActionResponse>(
        `/admin/reservations/${reservationId}/handle-reported`,
        payload
      );

    return data;
  },

  async updateReservation(
    reservationId: string,
    payload: UpdateReservationPayload
  ): Promise<ReservationActionResponse> {
    const { data } =
      await api.patch<ReservationActionResponse>(
        `/admin/reservations/${reservationId}`,
        payload
      );

    return data;
  },

  async markReservationPaid(
    reservationId: string
  ): Promise<ReservationActionResponse> {
    const { data } =
      await api.patch<ReservationActionResponse>(
        `/admin/reservations/${reservationId}/mark-paid`
      );

    return data;
  },

  // =========================
  // Actions
  // =========================

  async getActions(): Promise<ActionsResponse> {
    const { data } = await api.get<ActionsResponse>(
      '/admin/actions'
    );

    return data;
  },

  async createAction(
    payload: FormData
  ): Promise<ActionResponse> {
    const { data } = await api.post<ActionResponse>(
      '/admin/actions',
      payload,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );

    return data;
  },

  async updateAction(
    actionId: string,
    payload: FormData
  ): Promise<ActionResponse> {
    const { data } = await api.patch<ActionResponse>(
      `/admin/actions/${actionId}`,
      payload,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );

    return data;
  },

  async deleteAction(
    actionId: string
  ): Promise<EnterpriseDecisionResponse> {
    const { data } =
      await api.delete<EnterpriseDecisionResponse>(
        `/admin/actions/${actionId}`
      );

    return data;
  },
};