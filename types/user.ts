import { Action, Reservation, User } from './api';

export type BookCollectionPayload = {
  tempLocation?: string;
  lat?: number;
  lng?: number;
  selectedTime: string;
  useFreeCollecte: boolean;
  tempPhone?: string;
  collectionType: string;
  collectionTypeOther?: string;
  estimatedVolume: string;
  estimatedVolumeOther?: string;
};

export type EstimatedVolume =
  | "Un sac (20-30L)"
  | "Carton (30-50L)"
  | "Plusieurs sacs"
  | "Autre";

export interface RespondToSuggestedCollectionPayload {
  accepted: boolean;
  reason?: string;
}

export interface ReportReservationPayload {
  reason: string;
  description?: string;
}

export interface UserMessageResponse {
  msg: string;
}

export interface UserUpdateResponse {
  msg: string;
  user: User;
}

export interface ReservationResponse {
  msg: string;
  reservation: Reservation;
}

export interface DonateActionResponse {
  message: string;
  action: Action;
}

export interface NextBookedCollectionResponse {
  date: string | null;
}

export interface AvailableActionsResponse {
  actions: Action[];
}

export interface EnterpriseDecisionPayload {
  email: string;
  status: "accepted" | "refused";
}