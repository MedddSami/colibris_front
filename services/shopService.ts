import api from './api';

import {
  Article,
  Category,
  Order,
} from '../types/api';

import {
  CreateOrderPayload,
  UpdateArticlePayload,
  ArticleResponse,
} from '../types/shop';

export const shopService = {
  // =========================
  // Articles
  // =========================

  async getArticles(): Promise<Article[]> {
    const { data } = await api.get<Article[]>('/articles');

    return data;
  },

  async getArticleById(
    articleId: string
  ): Promise<Article> {
    const { data } = await api.get<Article>(
      `/articles/${articleId}`
    );

    return data;
  },

  async createArticle(
    formData: FormData
  ): Promise<ArticleResponse> {
    const { data } = await api.post<ArticleResponse>(
      '/articles',
      formData
    );

    return data;
  },

  async updateArticle(
    articleId: string,
    payload: UpdateArticlePayload
  ): Promise<ArticleResponse> {
    const { data } = await api.patch<ArticleResponse>(
      `/articles/${articleId}`,
      payload
    );

    return data;
  },

  async deleteArticle(
    articleId: string
  ): Promise<ArticleResponse> {
    const { data } = await api.delete<ArticleResponse>(
      `/articles/${articleId}`
    );

    return data;
  },
};