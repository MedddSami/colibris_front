import api from './api';

import { Category } from '../types/api';

import {
    CreateCategoryPayload,
    UpdateCategoryPayload,
    CategoryMessageResponse,
    DeleteCategoryResponse,
} from '../types/category';

export const categoryService = {
    // =========================
    // Read
    // =========================

    async getCategories(): Promise<Category[]> {
        const { data } = await api.get<Category[]>(
            '/api/categories'
        );

        return data;
    },

    async getCategoryById(
        categoryId: string
    ): Promise<Category> {
        const { data } = await api.get<Category>(
            `/api/categories/${categoryId}`
        );

        return data;
    },

    // =========================
    // Create
    // =========================

    async createCategory(
        payload: CreateCategoryPayload
    ): Promise<CategoryMessageResponse> {
        const { data } =
            await api.post<CategoryMessageResponse>(
                '/api/categories',
                payload
            );

        return data;
    },

    // =========================
    // Update
    // =========================

    async updateCategory(
        categoryId: string,
        payload: UpdateCategoryPayload
    ): Promise<CategoryMessageResponse> {
        const { data } = await api.put<CategoryMessageResponse>(
            `/api/categories/${categoryId}`,
            payload
        );

        return data;
    },

    // =========================
    // Delete
    // =========================

    async deleteCategory(
        categoryId: string
    ): Promise<DeleteCategoryResponse> {
        const { data } =
            await api.delete<DeleteCategoryResponse>(
                `/api/categories/${categoryId}`
            );

        return data;
    },
};