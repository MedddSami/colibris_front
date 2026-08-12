import { Notification } from './api';

export interface CreateNotificationPayload {
    user: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
}

export interface NotificationMessageResponse {
    message: string;
}