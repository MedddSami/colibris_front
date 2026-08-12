import api from './api';

import { Metrics } from '../types/api';

import {
  ContactPayload,
  ContactResponse,
  PdfGeneratePayload,
  MetricsResponse,
} from '../types/util';

export const utilService = {
  // =========================
  // Metrics (Admin)
  // =========================

  async getMetrics(): Promise<Metrics> {
    const { data } = await api.get<Metrics>(
      '/metrics/metrics'
    );

    return data;
  },

  // =========================
  // Contact (Guest)
  // =========================

  async sendContactMail(
    payload: ContactPayload
  ): Promise<ContactResponse> {
    const { data } = await api.post<ContactResponse>(
      '/contact',
      payload
    );

    return data;
  },

  // =========================
  // PDF Generator (User)
  // =========================

  async generatePdf(
    payload: PdfGeneratePayload
  ): Promise<Blob> {
    const response = await api.post(
      '/api/pdf/generate-pdf',
      payload,
      {
        responseType: 'blob',
      }
    );

    return response.data;
  },
};