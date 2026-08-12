import { Category, RefillArticle } from './api';

export interface CreateRefillCategoryPayload {
  name: string;
  description?: string;
}

export interface RefillCategoryResponse {
  message: string;
  category: Category;
}

export interface RefillArticleResponse {
  message: string;
  article: RefillArticle;
}

export interface ValidateRefillOrderPayload {
  articleId: string;
  volume: 1 | 2 | 5;
}

export interface DeleteRefillArticleResponse {
  message: string;
}

export interface RefillArticleRequest {
  nom: string,
  description: string,
  stock: string,
  prix: number,
  points: number,
  category: number,
  CO2_refill: number
}