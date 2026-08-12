import { Cart, RefillCart } from './api';

export interface CartItemPayload {
  articleId: string;
  quantity: number;
}

export interface RefillCartItemPayload {
  articleId: string;
  quantity: number;
  volume: "1L" | "2L" | "5L";
  price: number;
}

export interface ClearCartResponse {
  message: string;
  cart: Cart;
}

export interface ClearRefillCartResponse {
  message: string;
  cart: RefillCart;
}