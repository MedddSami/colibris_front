import api from './api';

import { Transaction } from '../types/api';

import {
  CheckoutResponse,
} from '../types/transaction';

export const transactionService = {
  // =========================
  // Checkout
  // =========================

  async checkout(): Promise<CheckoutResponse> {
    const { data } = await api.post<CheckoutResponse>(
      '/transaction/checkout'
    );

    return data;
  },

  // =========================
  // Transactions
  // =========================

  async getTransactions(): Promise<Transaction[]> {
    const { data } = await api.get<Transaction[]>(
      '/transaction'
    );

    return data;
  },

  async getTransactionById(
    transactionId: string
  ): Promise<Transaction> {
    const { data } = await api.get<Transaction>(
      `/transaction/${transactionId}`
    );

    return data;
  },
};