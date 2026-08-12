import { Transaction } from './api';

export interface CheckoutResponse {
    message: string;
    transaction: Transaction;
}