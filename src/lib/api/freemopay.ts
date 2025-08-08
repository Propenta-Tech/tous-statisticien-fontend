/**
 * Service pour l'intégration Freemopay
 * Tous Statisticien Academy - Paiements Mobile Money
 */

import { apiClient } from './client';
import { ApiResponse } from '@/types/api';

/**
 * Interface pour les données de paiement Freemopay
 */
interface FreemopayPaymentRequest {
  amount: number;
  currency: string;
  phoneNumber: string;
  operator: 'ORANGE' | 'MTN';
  description: string;
  customerName?: string;
  customerEmail?: string;
  notificationUrl?: string;
  returnUrl?: string;
  cancelUrl?: string;
  customData?: Record<string, unknown>;
}

/**
 * Interface pour la réponse d'initiation de paiement
 */
interface FreemopayInitResponse {
  success: boolean;
  reference: string;
  transactionId: string;
  status: 'PENDING' | 'PROCESSING';
  message: string;
  paymentUrl?: string;
  expiresAt: string;
}

/**
 * Interface pour le statut de paiement
 */
interface FreemopayStatusResponse {
  success: boolean;
  reference: string;
  transactionId: string;
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'EXPIRED' | 'CANCELLED';
  amount: number;
  currency: string;
  operator: string;
  phoneNumber: string;
  customerName?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  failureReason?: string;
  operatorTransactionId?: string;
}

/**
 * Interface pour l'historique des transactions
 */
interface FreemopayTransaction {
  id: string;
  reference: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
  operator: string;
  phoneNumber: string;
  description: string;
  createdAt: string;
  completedAt?: string;
  failureReason?: string;
}

/**
 * Interface pour les statistiques Freemopay
 */
interface FreemopayStats {
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  pendingTransactions: number;
  totalAmount: number;
  averageAmount: number;
  successRate: number;
  transactionsByOperator: Record<string, number>;
  recentTransactions: FreemopayTransaction[];
}

/**
 * Service pour Freemopay
 */
export class FreemopayService {
  private readonly baseUrl = 'https://api-v2.freemopay.com';
  private readonly appKey: string;

  constructor() {
    this.appKey = process.env.NEXT_PUBLIC_FREEMOPAY_APP_KEY || '';
  }

  /**
   * Initie un paiement Freemopay
   * POST /api/freemopay/initiate
   */
  async initiatePayment(data: FreemopayPaymentRequest): Promise<FreemopayInitResponse> {
    try {
      // Validation des données
      this.validatePaymentRequest(data);

      const response = await apiClient.post<FreemopayInitResponse>('/freemopay/initiate', {
        ...data,
        appKey: this.appKey,
      });

      return response.data!;
    } catch (error) {
      console.error('Erreur lors de l\'initiation du paiement Freemopay:', error);
      throw error;
    }
  }

  /**
   * Vérifie le statut d'un paiement
   * GET /api/freemopay/status/{reference}
   */
  async checkPaymentStatus(reference: string): Promise<FreemopayStatusResponse> {
    try {
      const response = await apiClient.get<FreemopayStatusResponse>(`/freemopay/status/${reference}`);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la vérification du statut du paiement ${reference}:`, error);
      throw error;
    }
  }

  /**
   * Annule un paiement en cours
   * POST /api/freemopay/cancel/{reference}
   */
  async cancelPayment(reference: string, reason?: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
      }>(`/freemopay/cancel/${reference}`, { reason });
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de l'annulation du paiement ${reference}:`, error);
      throw error;
    }
  }

  /**
   * Récupère l'historique des transactions
   * GET /api/freemopay/transactions
   */
  async getTransactionHistory(filters?: {
    status?: string;
    operator?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    transactions: FreemopayTransaction[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      const params: Record<string, string | number> = {};
      
      if (filters?.status) params.status = filters.status;
      if (filters?.operator) params.operator = filters.operator;
      if (filters?.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters?.dateTo) params.dateTo = filters.dateTo;
      if (filters?.limit) params.limit = filters.limit;
      if (filters?.offset) params.offset = filters.offset;

      const response = await apiClient.get<{
        transactions: FreemopayTransaction[];
        total: number;
        hasMore: boolean;
      }>('/freemopay/transactions', params);

      return response.data!;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique des transactions:', error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques Freemopay
   * GET /api/freemopay/statistics
   */
  async getStatistics(period?: {
    dateFrom?: string;
    dateTo?: string;
  }): Promise<FreemopayStats> {
    try {
      const params: Record<string, string> = {};
      
      if (period?.dateFrom) params.dateFrom = period.dateFrom;
      if (period?.dateTo) params.dateTo = period.dateTo;

      const response = await apiClient.get<FreemopayStats>('/freemopay/statistics', params);
      return response.data!;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques Freemopay:', error);
      throw error;
    }
  }

  /**
   * Teste la connectivité avec Freemopay
   * GET /api/freemopay/test
   */
  async testConnection(): Promise<{
    success: boolean;
    message: string;
    apiVersion: string;
    timestamp: string;
  }> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        apiVersion: string;
        timestamp: string;
      }>('/freemopay/test');
      return response.data!;
    } catch (error) {
      console.error('Erreur lors du test de connexion Freemopay:', error);
      throw error;
    }
  }

  /**
   * Récupère les opérateurs disponibles
   * GET /api/freemopay/operators
   */
  async getAvailableOperators(): Promise<Array<{
    code: string;
    name: string;
    country: string;
    currency: string;
    isActive: boolean;
    fees: {
      percentage: number;
      fixed: number;
    };
    limits: {
      min: number;
      max: number;
    };
  }>> {
    try {
      const response = await apiClient.get<Array<{
        code: string;
        name: string;
        country: string;
        currency: string;
        isActive: boolean;
        fees: {
          percentage: number;
          fixed: number;
        };
        limits: {
          min: number;
          max: number;
        };
      }>>('/freemopay/operators');
      return response.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des opérateurs:', error);
      throw error;
    }
  }

  /**
   * Calcule les frais de transaction
   * POST /api/freemopay/calculate-fees
   */
  async calculateFees(data: {
    amount: number;
    operator: string;
    currency?: string;
  }): Promise<{
    amount: number;
    operatorFees: number;
    platformFees: number;
    totalFees: number;
    netAmount: number;
    total: number;
  }> {
    try {
      const response = await apiClient.post<{
        amount: number;
        operatorFees: number;
        platformFees: number;
        totalFees: number;
        netAmount: number;
        total: number;
      }>('/freemopay/calculate-fees', data);
      return response.data!;
    } catch (error) {
      console.error('Erreur lors du calcul des frais:', error);
      throw error;
    }
  }

  /**
   * Valide un numéro de téléphone pour un opérateur
   * POST /api/freemopay/validate-phone
   */
  async validatePhoneNumber(phoneNumber: string, operator: 'ORANGE' | 'MTN'): Promise<{
    isValid: boolean;
    formattedNumber: string;
    operator: string;
    country: string;
  }> {
    try {
      const response = await apiClient.post<{
        isValid: boolean;
        formattedNumber: string;
        operator: string;
        country: string;
      }>('/freemopay/validate-phone', { phoneNumber, operator });
      return response.data!;
    } catch (error) {
      console.error('Erreur lors de la validation du numéro:', error);
      throw error;
    }
  }

  /**
   * Récupère les webhooks configurés
   * GET /api/freemopay/webhooks
   */
  async getWebhooks(): Promise<Array<{
    id: string;
    url: string;
    events: string[];
    isActive: boolean;
    secret: string;
    createdAt: string;
  }>> {
    try {
      const response = await apiClient.get<Array<{
        id: string;
        url: string;
        events: string[];
        isActive: boolean;
        secret: string;
        createdAt: string;
      }>>('/freemopay/webhooks');
      return response.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des webhooks:', error);
      throw error;
    }
  }

  /**
   * Configure un webhook
   * POST /api/freemopay/webhooks
   */
  async configureWebhook(data: {
    url: string;
    events: string[];
    secret?: string;
  }): Promise<{
    id: string;
    url: string;
    events: string[];
    secret: string;
    message: string;
  }> {
    try {
      const response = await apiClient.post<{
        id: string;
        url: string;
        events: string[];
        secret: string;
        message: string;
      }>('/freemopay/webhooks', data);
      return response.data!;
    } catch (error) {
      console.error('Erreur lors de la configuration du webhook:', error);
      throw error;
    }
  }

  /**
   * Polling pour vérifier le statut d'un paiement
   */
  async pollPaymentStatus(
    reference: string,
    options: {
      maxAttempts?: number;
      interval?: number;
      onStatusUpdate?: (status: FreemopayStatusResponse) => void;
    } = {}
  ): Promise<FreemopayStatusResponse> {
    const { maxAttempts = 30, interval = 5000, onStatusUpdate } = options;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const status = await this.checkPaymentStatus(reference);
        onStatusUpdate?.(status);
        
        // Statuts finaux
        if (['SUCCESS', 'FAILED', 'EXPIRED', 'CANCELLED'].includes(status.status)) {
          return status;
        }
        
        // Attendre avant la prochaine vérification
        if (attempt < maxAttempts - 1) {
          await new Promise(resolve => setTimeout(resolve, interval));
        }
      } catch (error) {
        console.error(`Erreur lors de la vérification ${attempt + 1}:`, error);
        
        // Continuer les tentatives même en cas d'erreur
        if (attempt < maxAttempts - 1) {
          await new Promise(resolve => setTimeout(resolve, interval));
        }
      }
    }
    
    throw new Error('Timeout: Le statut du paiement n\'a pas pu être déterminé');
  }

  /**
   * Valide une requête de paiement
   */
  private validatePaymentRequest(data: FreemopayPaymentRequest): void {
    if (!data.amount || data.amount <= 0) {
      throw new Error('Le montant doit être supérieur à 0');
    }

    if (!data.phoneNumber) {
      throw new Error('Le numéro de téléphone est requis');
    }

    if (!data.operator || !['ORANGE', 'MTN'].includes(data.operator)) {
      throw new Error('L\'opérateur doit être ORANGE ou MTN');
    }

    if (!data.currency) {
      throw new Error('La devise est requise');
    }

    if (!data.description) {
      throw new Error('La description est requise');
    }

    // Validation du numéro de téléphone selon l'opérateur
    const cleanNumber = data.phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    if (data.operator === 'ORANGE') {
      if (!/^(69|655|656|657|658|659)\d{6}$/.test(cleanNumber.slice(-9))) {
        throw new Error('Numéro Orange Money invalide');
      }
    } else if (data.operator === 'MTN') {
      if (!/^(67|650|651|652|653|654)\d{6}$/.test(cleanNumber.slice(-9))) {
        throw new Error('Numéro MTN Mobile Money invalide');
      }
    }
  }
}

/**
 * Instance par défaut du service Freemopay
 */
export const freemopayService = new FreemopayService();

/**
 * Helper pour formater un numéro de téléphone camerounais
 */
export const formatCameroonianPhone = (phone: string): string => {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Si le numéro commence par +237, le supprimer
  const withoutCountryCode = cleaned.startsWith('+237') ? cleaned.slice(4) : 
                           cleaned.startsWith('237') ? cleaned.slice(3) : cleaned;
  
  // Formater avec des espaces
  if (withoutCountryCode.length === 9) {
    return `${withoutCountryCode.slice(0, 3)} ${withoutCountryCode.slice(3, 5)} ${withoutCountryCode.slice(5, 7)} ${withoutCountryCode.slice(7)}`;
  }
  
  return phone;
};

/**
 * Helper pour détecter l'opérateur à partir du numéro
 */
export const detectOperator = (phone: string): 'ORANGE' | 'MTN' | 'UNKNOWN' => {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  const number = cleaned.slice(-9);
  
  if (/^(69|655|656|657|658|659)/.test(number)) {
    return 'ORANGE';
  }
  
  if (/^(67|650|651|652|653|654)/.test(number)) {
    return 'MTN';
  }
  
  return 'UNKNOWN';
};

/**
 * Helper pour formater le statut de paiement
 */
export const formatPaymentStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'PENDING': 'En attente',
    'PROCESSING': 'En cours',
    'SUCCESS': 'Réussi',
    'FAILED': 'Échoué',
    'EXPIRED': 'Expiré',
    'CANCELLED': 'Annulé',
  };
  return statusMap[status] || status;
};

/**
 * Helper pour obtenir la couleur du statut
 */
export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    'PENDING': 'yellow',
    'PROCESSING': 'blue',
    'SUCCESS': 'green',
    'FAILED': 'red',
    'EXPIRED': 'gray',
    'CANCELLED': 'gray',
  };
  return colorMap[status] || 'gray';
};

/**
 * Helper pour vérifier si un statut est final
 */
export const isFinalStatus = (status: string): boolean => {
  return ['SUCCESS', 'FAILED', 'EXPIRED', 'CANCELLED'].includes(status);
};

/**
 * Constantes Freemopay
 */
export const FREEMOPAY_CONSTANTS = {
  OPERATORS: {
    ORANGE: {
      name: 'Orange Money',
      prefixes: ['69', '655', '656', '657', '658', '659'],
      color: '#FF7900',
    },
    MTN: {
      name: 'MTN Mobile Money',
      prefixes: ['67', '650', '651', '652', '653', '654'],
      color: '#FFCB05',
    },
  },
  CURRENCIES: {
    XAF: 'Franc CFA',
    EUR: 'Euro',
    USD: 'Dollar US',
  },
  STATUS: {
    PENDING: 'En attente',
    PROCESSING: 'En cours',
    SUCCESS: 'Réussi',
    FAILED: 'Échoué',
    EXPIRED: 'Expiré',
    CANCELLED: 'Annulé',
  },
  LIMITS: {
    MIN_AMOUNT: 100, // XAF
    MAX_AMOUNT: 1000000, // XAF
  },
};