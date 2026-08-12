import { UserRole } from '@/types/api';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    user: {
        id: string;
        location: string;
        role: UserRole;
    };
    iat: number;
    exp: number;
}

interface AuthUser {
    id: string;
    location: string;
    role: UserRole;
}

interface AuthState {
    token: string | null;
    user: AuthUser | null;
    isAuthenticated: boolean;
    loading: boolean;
    isInitialized: boolean;
}

const initialState: AuthState = {
    token: null,
    user: null,
    isAuthenticated: false,
    loading: false,
    isInitialized: false,
};

// helper
const decodeToken = (token: string): AuthUser | null => {
    try {
        const decoded = jwtDecode<DecodedToken>(token);

        const now = Date.now() / 1000;

        if (decoded.exp < now) {
            return null;
        }

        return decoded.user;
    } catch {
        return null;
    }
};

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        setCredentials: (
            state,
            action
        ) => {
            const user = decodeToken(
                action.payload.token
            );

            if (!user) return;

            localStorage.setItem(
                'token',
                action.payload.token
            );

            state.token =
                action.payload.token;

            state.user = user;
            state.isAuthenticated = true;
        },

        hydrateAuth: (
            state,
            action: PayloadAction<{ token: string }>
        ) => {
            const user = decodeToken(action.payload.token);
            state.isInitialized = true;

            if (!user) return;

            state.token = action.payload.token;
            state.user = user;
            state.isAuthenticated = true;
        },
        // NEW reducer for the "no token found" case
        authInitialized: (state) => {
            state.isInitialized = true;
        },

        logout: (state) => {
            localStorage.removeItem('token');

            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            state.isInitialized = true; // stays true, we've checked
        },
    },
});

export const {
    setCredentials,
    hydrateAuth,
    logout,
    authInitialized,
} = authSlice.actions;

export default authSlice.reducer;