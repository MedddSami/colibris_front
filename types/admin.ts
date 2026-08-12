import {
  User,
  Collection,
  Reservation,
  Action,
  BadgeCriteria,
  Chiffre,
} from './api';

export interface SetCollectionDatesPayload {
  title: string,
  date: string,
  time: [string, string],
  maxCollection: number,
  prix: number,
}

export interface UpdateBadgeCriteriaPayload {
  bronze?: number;
  silver?: number;
  gold?: number;
}

export interface UpdateChiffrePayload {
  value: number;
}

export interface ReservationResponsePayload {
  accepted: boolean;
  suggestedDate?: string;
  reason?: string;
}

export interface HandleReportedReservationPayload {
  action: 'approve' | 'reject';
  reason?: string;
}


export interface EnterpriseDecisionPayload {
  userId: string;
  accepted: boolean;
}

export interface CreateActionPayload {
  title: string;
  description: string;
  pointsRequired: number;
  image?: string;
}

export interface UpdateActionPayload {
  title?: string;
  description?: string;
  pointsRequired?: number;
  image?: string;
}

export interface UsersResponse {
  users: User[];
}

export interface ReservationsResponse {
  reservations: Reservation[];
}

export interface ActionsResponse {
  actions: Action[];
}

export interface ChiffresResponse {
  chiffres: Chiffre[];
}

export interface BadgeCriteriaResponse extends BadgeCriteria { }

export interface MessageResponse {
  msg: string;
}

export interface EnterpriseDecisionResponse {
  message: string;
}

export interface ReservationActionResponse {
  msg: string;
  reservation: Reservation;
}

export interface ChiffreResponse {
  chiffre: Chiffre;
}

export interface ActionResponse {
  action: Action;
}

export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "reported"
  | "cancelled";

export interface UpdateReservationPayload {
  action: "accept" | "refuse";
  selectedTime?: string;
}

export interface ReportReservationPayload {
  selectedTime?: string;
}