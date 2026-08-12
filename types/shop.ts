import { Article, Order } from './api';

export interface CreateOrderPayload {
  articleId: string;
  quantity: number;
  address?: string;
}

export interface UpdateArticlePayload {
  title?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: string;
  image?: string;
}

export interface ArticleResponse {
  article: Article;
  message: string;
}

export interface UserOrdersResponse {
  orders: Order[];
}