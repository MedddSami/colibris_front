
import api from './api';
import { User } from '../types/api';

import {
    LoginPayload,
    LoginResponse,
    UpdateProfilePayload,
    VerifyResetCodePayload,
    AuthMessageResponse,
    ProfileResponse,
    ReverseGeocodeResponse,
    ChangeUserPasswordPayload,
} from '../types/auth';
import { UserMessageResponse } from '@/types/user';

export const authService = {
    // =========================
    // Authentication
    // =========================

    async signup(formData: FormData): Promise<AuthMessageResponse> {
        const { data } = await api.post<AuthMessageResponse>(
            '/reg-auth/signup',
            formData
        );

        return data;
    },

    async verifyEmail(token: string): Promise<AuthMessageResponse> {
        const { data } = await api.get<AuthMessageResponse>(
            `/reg-auth/verify/${token}`
        );

        return data;
    },

    async login(credentials: LoginPayload): Promise<LoginResponse> {
        const { data } = await api.post<LoginResponse>(
            '/reg-auth/login',
            credentials
        );

        return data;
    },

    // =========================
    // Password Recovery
    // =========================

    async sendResetCode(email: string): Promise<AuthMessageResponse> {
        const { data } = await api.post<AuthMessageResponse>(
            '/reg-auth/send-reset-code',
            { email }
        );

        return data;
    },

    async verifyResetCode(
        payload: VerifyResetCodePayload
    ): Promise<AuthMessageResponse> {
        const { data } = await api.post<AuthMessageResponse>(
            '/reg-auth/verify-reset-code',
            payload
        );

        return data;
    },

    async changePassword(
        userId: string,
        payload: ChangeUserPasswordPayload
    ): Promise<UserMessageResponse> {
        const { data } =
            await api.put<UserMessageResponse>(
                `/change-password/${userId}`,
                {
                    oldPassword:
                        payload.oldPassword,
                    newPassword:
                        payload.newPassword,
                }
            );

        return data;
    },

    // =========================
    // Profile
    // =========================

    async getProfile(): Promise<User> {
        const { data } = await api.get<User>('/reg-auth/profile');

        return data;
    },

    async updateProfile(
        payload: UpdateProfilePayload
    ): Promise<ProfileResponse> {
        const { data } = await api.put<ProfileResponse>(
            '/reg-auth/profile',
            payload
        );

        return data;
    },

    // =========================
    // Utilities
    // =========================

    async reverseGeocode(
        lat: number,
        lng: number
    ): Promise<ReverseGeocodeResponse> {
        const { data } = await api.get<ReverseGeocodeResponse>(
            '/reg-auth/reverse-geocode',
            {
                params: { lat, lng },
            }
        );

        return data;
    },
};