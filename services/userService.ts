import api from './api';

import {
  User,
  Collection,
  Reservation,
  Action,
} from '../types/api';

import {
  BookCollectionPayload,
  RespondToSuggestedCollectionPayload,
  ReportReservationPayload,
  UserMessageResponse,
  UserUpdateResponse,
  ReservationResponse,
  DonateActionResponse,
  NextBookedCollectionResponse,
  AvailableActionsResponse,
} from '../types/user';
import { ChangeUserPasswordPayload } from '@/types/auth';

export const userService = {
  // =========================
  // Profile
  // =========================

  async getUser(): Promise<User> {
    const { data } = await api.get<User>('/user');

    return data;
  },

  async updateUser(
    userId: string,
    formData: FormData
  ): Promise<UserUpdateResponse> {
    const { data } = await api.put<UserUpdateResponse>(
      `/update/${userId}`,
      formData
    );

    return data;
  },

  async changePassword(
    userId: string,
    payload: ChangeUserPasswordPayload
  ): Promise<UserMessageResponse> {
    const { data } = await api.put<UserMessageResponse>(
      `/change-password/${userId}`,
      payload
    );

    return data;
  },

  // =========================
  // Collections
  // =========================

  async getAvailableCollections(): Promise<Collection[]> {
    const { data } = await api.get<Collection[]>(
      '/available-collections'
    );

    return data;
  },

  async bookCollection(
    collectionId: string,
    payload: BookCollectionPayload
  ): Promise<ReservationResponse> {
    const { data } = await api.post<ReservationResponse>(
      `/book-collection/${collectionId}`,
      payload
    );

    return data;
  },

  async getHistory(): Promise<Reservation[]> {
    const { data } = await api.get<Reservation[]>('/history');

    return data;
  },

  async cancelReservation(
    reservationId: string
  ): Promise<UserMessageResponse> {
    const { data } = await api.patch<UserMessageResponse>(
      `/cancel-reservation/${reservationId}`
    );

    return data;
  },

  async respondToSuggestedCollection(
    reservationId: string,
    payload: RespondToSuggestedCollectionPayload
  ): Promise<ReservationResponse> {
    const { data } = await api.post<ReservationResponse>(
      `/respond-to-suggested-collection/${reservationId}`,
      payload
    );

    return data;
  },

  async reportReservation(
    reservationId: string,
    suggestedCollectionId: string,
    payload: ReportReservationPayload
  ): Promise<ReservationResponse> {
    const { data } = await api.post<ReservationResponse>(
      `/report-reservation/${reservationId}/${suggestedCollectionId}`,
      payload
    );

    return data;
  },

  async getNextBookedCollection(): Promise<NextBookedCollectionResponse> {
    const { data } = await api.get<NextBookedCollectionResponse>(
      '/next-booked-collection'
    );

    return data;
  },

  // =========================
  // Actions / Donations
  // =========================

  async getAvailableActions(): Promise<AvailableActionsResponse> {
    const { data } = await api.get<AvailableActionsResponse>(
      '/user/actions'
    );

    return data;
  },

  async donateToAction(
    actionId: string,
    points: number
  ): Promise<DonateActionResponse> {
    const { data } = await api.post<DonateActionResponse>(
      `/user/actions/${actionId}/donate`,
      { points }
    );

    return data;
  },
};