import api from './api';

import {
  RefillArticle,
  Category,
  Order,
} from '../types/api';

import {
  CreateRefillCategoryPayload,
  RefillCategoryResponse,
  RefillArticleResponse,
  ValidateRefillOrderPayload,
  DeleteRefillArticleResponse,
} from '../types/refill';

export const refillService = {
  // =========================
  // Refill Articles
  // =========================

  async getRefillArticles(): Promise<RefillArticle[]> {
    const { data } = await api.get<RefillArticle[]>(
      '/refill-articles'
    );

    return data;
  },

  async getRefillArticleById(
    articleId: string
  ): Promise<RefillArticle> {
    const { data } = await api.get<RefillArticle>(
      `/refill-articles/${articleId}`
    );

    return data;
  },

  async createRefillArticle(
    formData: FormData
  ): Promise<RefillArticleResponse> {
    const { data } = await api.post<RefillArticleResponse>(
      '/refill-articles',
      formData
    );

    return data;
  },

  async updateRefillArticle(
    articleId: string,
    formData: FormData
  ): Promise<RefillArticleResponse> {
    const { data } = await api.patch<RefillArticleResponse>(
      `/refill-articles/${articleId}`,
      formData
    );

    return data;
  },

  async deleteRefillArticle(
    articleId: string
  ): Promise<DeleteRefillArticleResponse> {
    const { data } =
      await api.delete<DeleteRefillArticleResponse>(
        `/refill-articles/${articleId}`
      );

    return data;
  },

  // =========================
  // Categories
  // =========================

  async getRefillCategories(): Promise<Category[]> {
    const { data } = await api.get<Category[]>(
      '/refill-articles/categories'
    );

    return data;
  },

  async createRefillCategory(
    payload: CreateRefillCategoryPayload
  ): Promise<RefillCategoryResponse> {
    const { data } =
      await api.post<RefillCategoryResponse>(
        '/refill-articles/categories',
        payload
      );

    return data;
  },

  // =========================
  // Validation
  // =========================

  async validateRefillOrder(
    payload: ValidateRefillOrderPayload
  ): Promise<RefillArticleResponse> {
    const { data } =
      await api.post<RefillArticleResponse>(
        '/refill-articles/validate-order',
        payload
      );

    return data;
  },
};