import api from './api';

import { Notification } from '../types/api';

import {
    CreateNotificationPayload,
    NotificationMessageResponse,
} from '../types/notification';

export const notificationService = {
    // =========================
    // Get Notifications
    // =========================

    async getNotifications(
        userId: string
    ): Promise<Notification[]> {
        const { data } = await api.get<Notification[]>(
            `/notification/${userId}`
        );

        return data;
    },

    // =========================
    // Update
    // =========================

    async markAsRead(
        notificationId: string
    ): Promise<Notification> {
        const { data } = await api.patch<Notification>(
            `/notification/${notificationId}/read`
        );

        return data;
    },

    // =========================
    // Create
    // =========================

    async createNotification(
        payload: CreateNotificationPayload
    ): Promise<Notification> {
        const { data } = await api.post<Notification>(
            '/notification',
            payload
        );

        return data;
    },

    // =========================
    // Delete
    // =========================

    async deleteNotification(
        notificationId: string
    ): Promise<NotificationMessageResponse> {
        const { data } =
            await api.delete<NotificationMessageResponse>(
                `/notification/${notificationId}`
            );

        return data;
    },
};