/**
 * Service pour la gestion des paiements
 * Tous Statisticien Academy
 */

import { apiClient } from './client';
import { Payment, CreatePaymentRequest, UpdatePaymentRequest, PaymentStatus } from '@/types';
import { ApiResponse, PaginatedResponse } from '@/types/api';

/**
 * Interface pour les données de paiement Freemopay
 */
interface FreemopayPaymentData {
  amount: number;
  currency: string;
  phoneNumber: string;
  description: string;
  returnUrl: string;
  cancelUrl: string;
}

/**
 * Service pour les paiements
 */
export class PaymentService {
  /**
   * Récupère tous les paiements
   * GET /api/payments/all
   */
  async getAllPayments(): Promise<Payment[]> {
    try {
      const response = await apiClient.get<Payment[]>('/payments/all');
      return response.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des paiements:', error);
      throw error;
    }
  }

  /**
   * Récupère les paiements avec pagination
   * GET /api/payments
   */
  async getPayments(
    page: number = 1,
    limit: number = 10,
    filters?: {
      userId?: string;
      status?: PaymentStatus;
      dateFrom?: string;
      dateTo?: string;
      minAmount?: number;
      maxAmount?: number;
    }
  ): Promise<PaginatedResponse<Payment>> {
    try {
      const params: Record<string, string | number | boolean> = { page, limit };
      
      if (filters?.userId) params.userId = filters.userId;
      if (filters?.status) params.status = filters.status;
      if (filters?.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters?.dateTo) params.dateTo = filters.dateTo;
      if (filters?.minAmount) params.minAmount = filters.minAmount;
      if (filters?.maxAmount) params.maxAmount = filters.maxAmount;

      return await apiClient.getPaginated<Payment>('/payments', page, limit, params);
    } catch (error) {
      console.error('Erreur lors de la récupération des paiements paginés:', error);
      throw error;
    }
  }

  /**
   * Récupère un paiement par ID
   * GET /api/payments/{id}
   */
  async getPaymentById(id: string): Promise<Payment | null> {
    try {
      const response = await apiClient.get<Payment>(`/payments/${id}`);
      return response.data || null;
    } catch (error) {
      console.error(`Erreur lors de la récupération du paiement ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les paiements d'un utilisateur
   * GET /api/payments/user/{userId}
   */
  async getPaymentsByUserId(userId: string): Promise<Payment[]> {
    try {
      const response = await apiClient.get<Payment[]>(`/payments/user/${userId}`);
      return response.data || [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des paiements de l'utilisateur ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Crée un nouveau paiement
   * POST /api/payments/create
   */
  async createPayment(data: CreatePaymentRequest): Promise<Payment> {
    try {
      const response = await apiClient.post<Payment>('/payments/create', data);
      return response.data!;
    } catch (error) {
      console.error('Erreur lors de la création du paiement:', error);
      throw error;
    }
  }

  /**
   * Met à jour un paiement
   * PUT /api/payments/update/{id}
   */
  async updatePayment(id: string, data: UpdatePaymentRequest): Promise<Payment> {
    try {
      const response = await apiClient.put<Payment>(`/payments/update/${id}`, data);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du paiement ${id}:`, error);
      throw error;
    }
  }

  /**
   * Supprime un paiement
   * DELETE /api/payments/delete/{id}
   */
  async deletePayment(id: string): Promise<void> {
    try {
      await apiClient.delete(`/payments/delete/${id}`);
    } catch (error) {
      console.error(`Erreur lors de la suppression du paiement ${id}:`, error);
      throw error;
    }
  }

  /**
   * Initie un paiement avec Freemopay
   * POST /api/payments/freemopay/initiate
   */
  async initiateFreemopayPayment(data: FreemopayPaymentData): Promise<{
    paymentId: string;
    redirectUrl: string;
    reference: string;
    status: string;
  }> {
    try {
      const response = await apiClient.post<{
        paymentId: string;
        redirectUrl: string;
        reference: string;
        status: string;
      }>('/payments/freemopay/initiate', data);
      return response.data!;
    } catch (error) {
      console.error('Erreur lors de l\'initiation du paiement Freemopay:', error);
      throw error;
    }
  }

  /**
   * Vérifie le statut d'un paiement Freemopay
   * GET /api/payments/freemopay/status/{reference}
   */
  async checkFreemopayPaymentStatus(reference: string): Promise<{
    status: PaymentStatus;
    amount: number;
    currency: string;
    transactionId?: string;
    completedAt?: string;
    failureReason?: string;
  }> {
    try {
      const response = await apiClient.get<{
        status: PaymentStatus;
        amount: number;
        currency: string;
        transactionId?: string;
        completedAt?: string;
        failureReason?: string;
      }>(`/payments/freemopay/status/${reference}`);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la vérification du statut du paiement ${reference}:`, error);
      throw error;
    }
  }

  /**
   * Confirme un paiement après callback
   * POST /api/payments/{id}/confirm
   */
  async confirmPayment(id: string, transactionData: {
    transactionId: string;
    status: PaymentStatus;
    completedAt: string;
  }): Promise<Payment> {
    try {
      const response = await apiClient.post<Payment>(`/payments/${id}/confirm`, transactionData);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la confirmation du paiement ${id}:`, error);
      throw error;
    }
  }

  /**
   * Annule un paiement
   * POST /api/payments/{id}/cancel
   */
  async cancelPayment(id: string, reason?: string): Promise<Payment> {
    try {
      const response = await apiClient.post<Payment>(`/payments/${id}/cancel`, { reason });
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de l'annulation du paiement ${id}:`, error);
      throw error;
    }
  }

  /**
   * Rembourse un paiement
   * POST /api/payments/{id}/refund
   */
  async refundPayment(id: string, data: {
    amount?: number;
    reason: string;
    refundMethod?: 'original' | 'manual';
  }): Promise<{
    refundId: string;
    refundAmount: number;
    status: string;
    refundedAt: string;
  }> {
    try {
      const response = await apiClient.post<{
        refundId: string;
        refundAmount: number;
        status: string;
        refundedAt: string;
      }>(`/payments/${id}/refund`, data);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors du remboursement du paiement ${id}:`, error);
      throw error;
    }
  }

  /**
   * Génère une facture pour un paiement
   * GET /api/payments/{id}/invoice
   */
  async generateInvoice(id: string): Promise<Blob> {
    try {
      const response = await fetch(`${apiClient['baseUrl']}/payments/${id}/invoice`, {
        method: 'GET',
        headers: apiClient['prepareHeaders'](),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error(`Erreur lors de la génération de la facture pour le paiement ${id}:`, error);
      throw error;
    }
  }

  /**
   * Envoie une facture par email
   * POST /api/payments/{id}/send-invoice
   */
  async sendInvoiceByEmail(id: string, email?: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>(`/payments/${id}/send-invoice`, { email });
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de l'envoi de la facture pour le paiement ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère l'historique des transactions d'un paiement
   * GET /api/payments/{id}/transactions
   */
  async getPaymentTransactions(id: string): Promise<Array<{
    id: string;
    type: 'charge' | 'refund' | 'chargeback';
    amount: number;
    status: string;
    createdAt: string;
    transactionId?: string;
    gatewayResponse?: Record<string, unknown>;
  }>> {
    try {
      const response = await apiClient.get<Array<{
        id: string;
        type: 'charge' | 'refund' | 'chargeback';
        amount: number;
        status: string;
        createdAt: string;
        transactionId?: string;
        gatewayResponse?: Record<string, unknown>;
      }>>(`/payments/${id}/transactions`);
      return response.data || [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des transactions du paiement ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques des paiements
   * GET /api/payments/stats
   */
  async getPaymentStats(filters?: {
    dateFrom?: string;
    dateTo?: string;
    userId?: string;
  }): Promise<{
    totalRevenue: number;
    totalPayments: number;
    successfulPayments: number;
    failedPayments: number;
    pendingPayments: number;
    averageAmount: number;
    revenueByDay: Array<{
      date: string;
      amount: number;
      count: number;
    }>;
    paymentMethods: Record<string, number>;
  }> {
    try {
      const params: Record<string, string> = {};
      if (filters?.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters?.dateTo) params.dateTo = filters.dateTo;
      if (filters?.userId) params.userId = filters.userId;

      const response = await apiClient.get<{
        totalRevenue: number;
        totalPayments: number;
        successfulPayments: number;
        failedPayments: number;
        pendingPayments: number;
        averageAmount: number;
        revenueByDay: Array<{
          date: string;
          amount: number;
          count: number;
        }>;
        paymentMethods: Record<string, number>;
      }>('/payments/stats', params);
      return response.data!;
    }
    catch (error) {
      console.error('Erreur lors de la récupération des statistiques des paiements:', error);
      throw error;
    }
  }

  /**
   * Exporte les paiements
   * GET /api/payments/export
   */
  async exportPayments(
    format: 'csv' | 'excel' = 'csv',
    filters?: {
      dateFrom?: string;
      dateTo?: string;
      status?: PaymentStatus;
    }
  ): Promise<Blob> {
    try {
      const params: Record<string, string> = { format };
      if (filters?.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters?.dateTo) params.dateTo = filters.dateTo;
      if (filters?.status) params.status = filters.status;

      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${apiClient['baseUrl']}/payments/export?${queryString}`, {
        method: 'GET',
        headers: apiClient['prepareHeaders'](),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Erreur lors de l\'export des paiements:', error);
      throw error;
    }
  }

  /**
   * Vérifie si un utilisateur a payé
   * GET /api/payments/user/{userId}/has-paid
   */
  async checkUserPaymentStatus(userId: string): Promise<{
    hasPaid: boolean;
    lastPaymentDate?: string;
    totalPaid: number;
    activeSubscription?: {
      id: string;
      expiresAt: string;
      status: string;
    };
  }> {
    try {
      const response = await apiClient.get<{
        hasPaid: boolean;
        lastPaymentDate?: string;
        totalPaid: number;
        activeSubscription?: {
          id: string;
          expiresAt: string;
          status: string;
        };
      }>(`/payments/user/${userId}/has-paid`);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la vérification du statut de paiement de l'utilisateur ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Crée un plan de paiement
   * POST /api/payments/payment-plan
   */
  async createPaymentPlan(data: {
    userId: string;
    totalAmount: number;
    installments: number;
    firstPaymentDate: string;
    frequency: 'weekly' | 'monthly';
  }): Promise<{
    planId: string;
    installments: Array<{
      id: string;
      amount: number;
      dueDate: string;
      status: 'pending' | 'paid' | 'overdue';
    }>;
  }> {
    try {
      const response = await apiClient.post<{
        planId: string;
        installments: Array<{
          id: string;
          amount: number;
          dueDate: string;
          status: 'pending' | 'paid' | 'overdue';
        }>;
      }>('/payments/payment-plan', data);
      return response.data!;
    } catch (error) {
      console.error('Erreur lors de la création du plan de paiement:', error);
      throw error;
    }
  }

  /**
   * Récupère les méthodes de paiement disponibles
   * GET /api/payments/methods
   */
  async getPaymentMethods(): Promise<Array<{
    id: string;
    name: string;
    type: 'mobile_money' | 'card' | 'bank_transfer';
    provider: string;
    isActive: boolean;
    fees: {
      percentage: number;
      fixed: number;
    };
    logo?: string;
  }>> {
    try {
      const response = await apiClient.get<Array<{
        id: string;
        name: string;
        type: 'mobile_money' | 'card' | 'bank_transfer';
        provider: string;
        isActive: boolean;
        fees: {
          percentage: number;
          fixed: number;
        };
        logo?: string;
      }>>('/payments/methods');
      return response.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des méthodes de paiement:', error);
      throw error;
    }
  }

  /**
   * Calcule les frais de paiement
   * POST /api/payments/calculate-fees
   */
  async calculatePaymentFees(data: {
    amount: number;
    paymentMethod: string;
    currency?: string;
  }): Promise<{
    amount: number;
    fees: number;
    total: number;
    breakdown: {
      platformFee: number;
      gatewayFee: number;
      taxes: number;
    };
  }> {
    try {
      const response = await apiClient.post<{
        amount: number;
        fees: number;
        total: number;
        breakdown: {
          platformFee: number;
          gatewayFee: number;
          taxes: number;
        };
      }>('/payments/calculate-fees', data);
      return response.data!;
    } catch (error) {
      console.error('Erreur lors du calcul des frais de paiement:', error);
      throw error;
    }
  }
}