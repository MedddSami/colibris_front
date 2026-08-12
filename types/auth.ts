
import { User, UserRole } from './api';

type NextStep =
  | "admin_review"
  | "email_verification";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface DecodedToken {
    user: {
        id: string;
        location: string;
        role: UserRole;
    };
    iat: number;
    exp: number;
}

export interface UpdateProfilePayload {
    firstName?: string;
    lastName?: string;
    phone?: string;
    location?: string;
    avatar?: string;
}

export interface ChangeUserPasswordPayload {
    oldPassword: string;
    newPassword: string;
}

export interface VerifyResetCodePayload {
    email: string;
    code: string;
}

export interface LoginResponse {
    token: string;
}

export interface ProfileResponse {
    msg: string;
    user: User;
}

export interface ReverseGeocodeResponse {
    location: string;
}

export interface AuthMessageResponse {
  success: boolean;
  role: string;
  status: string;
  isVerified: boolean;
  nextStep: NextStep;
  msg: string;
}