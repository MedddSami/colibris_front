import { Category } from './api';

export interface CreateCategoryPayload {
  name: string;
  description?: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
}

export interface CategoryMessageResponse {
  message: string;
  category: Category;
}

export interface DeleteCategoryResponse {
  message: string;
}