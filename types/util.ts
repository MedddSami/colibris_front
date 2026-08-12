import { Metrics } from './api';

export interface ContactPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  msg: string;
}

export interface PdfGeneratePayload {
  latexContent: string;
  filename: string;
}

export interface PdfBlobResponse {
  blob: Blob;
  filename?: string;
}

export interface MetricsResponse extends Metrics {}

export interface AuthSuccessResponse {
  message: string;
  token: string;
}