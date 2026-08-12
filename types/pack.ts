import { Pack, User } from './api';

export interface PurchasePackPayload {
  deliveryOption: 'custom' | 'collection';
  deliveryDate?: string;
  location?: string;
}

export interface PackMessageResponse {
  message: string;
}

export interface ShopAccessResponse {
  canAccessShop: boolean;
}

export interface CreatePackFormValues {
  name: string;
  description: string;
  price: number;
  points: number;
  isDisplayed: boolean;
  period: number;
  collecteNumber: number;
  photo?: File;
}