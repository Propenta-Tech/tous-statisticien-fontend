/**
 * Client HTTP principal pour Tous Statisticien Academy
 * Gestion centralisée des requêtes API avec authentification et gestion d'erreurs
 */

import { ApiResponse, ApiError, PaginatedResponse } from '@/types/api';

/**
 * Configuration du client API
 */
interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  defaultHeaders?: Record<string, string>;
}

/**
 * Options pour les requêtes
 */
interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  signal?: AbortSignal;
}

/**
 * Options pour les requêtes avec fichiers
 */
interface FileUploadOptions extends RequestOptions {
  onProgress?: (progress: number) => void;
}

/**
 * Client HTTP principal
 */
export class ApiClient {
  private baseUrl: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;
  private token: string | null = null;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.timeout = config.timeout || 30000;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.defaultHeaders,
    };

    // Récupérer le token depuis localStorage si disponible
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  /**
   * Définit le token d'authentification
   */
  setAuthToken(token: string | null): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  /**
   * Récupère le token d'authentification
   */
  getAuthToken(): string | null {
    return this.token;
  }

  /**
   * Prépare les headers pour une requête
   */
  private prepareHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
    const headers = { ...this.defaultHeaders, ...customHeaders };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Construit l'URL complète
   */
  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    
    if (!params) return url;

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `${url}?${queryString}` : url;
  }

  /**
   * Gère les erreurs de réponse
   */
  private async handleResponseError(response: Response): Promise<never> {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    let errorCode = response.status.toString();
    let details: Record<string, unknown> = {};

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
      errorCode = errorData.code || errorCode;
      details = errorData.details || {};
    } catch {
      // Si la réponse n'est pas du JSON, utiliser le message par défaut
    }

    const apiError: ApiError = {
      message: errorMessage,
      status: response.status,
      code: errorCode,
      details,
    };

    // Gestion spéciale pour l'expiration du token
    if (response.status === 401) {
      this.setAuthToken(null);
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    throw apiError;
  }

  /**
   * Traite la réponse de l'API
   */
  private async processResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      await this.handleResponseError(response);
    }

    // Gérer les réponses vides (204 No Content)
    if (response.status === 204) {
      return {
        data: undefined as T,
        success: true,
        message: 'Opération réussie',
      };
    }

    try {
      const data = await response.json();
      return {
        data,
        success: true,
        message: data.message || 'Opération réussie',
      };
    } catch {
      // Si la réponse n'est pas du JSON, retourner les données brutes
      const text = await response.text();
      return {
        data: text as T,
        success: true,
        message: 'Opération réussie',
      };
    }
  }

  /**
   * Requête GET
   */
  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean>,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, params);
    const headers = this.prepareHeaders(options.headers);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || this.timeout);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
        signal: options.signal || controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.processResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error('Timeout de la requête');
      }
      throw error;
    }
  }

  /**
   * Requête POST
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const headers = this.prepareHeaders(options.headers);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || this.timeout);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: data ? JSON.stringify(data) : undefined,
        signal: options.signal || controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.processResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error('Timeout de la requête');
      }
      throw error;
    }
  }

  /**
   * Requête PUT
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const headers = this.prepareHeaders(options.headers);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || this.timeout);

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: data ? JSON.stringify(data) : undefined,
        signal: options.signal || controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.processResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error('Timeout de la requête');
      }
      throw error;
    }
  }

  /**
   * Requête DELETE
   */
  async delete<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const headers = this.prepareHeaders(options.headers);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || this.timeout);

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers,
        signal: options.signal || controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.processResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error('Timeout de la requête');
      }
      throw error;
    }
  }

  /**
   * Upload de fichier avec progression
   */
  async uploadFile<T>(
    endpoint: string,
    formData: FormData,
    options: FileUploadOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const headers = this.prepareHeaders(options.headers);

    // Supprimer Content-Type pour permettre au navigateur de le définir automatiquement
    delete headers['Content-Type'];

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Gestion de la progression
      if (options.onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = (e.loaded / e.total) * 100;
            options.onProgress!(progress);
          }
        });
      }

      // Gestion de la fin de l'upload
      xhr.addEventListener('load', async () => {
        try {
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            resolve({
              data,
              success: true,
              message: 'Upload réussi',
            });
          } else {
            reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
          }
        } catch (error) {
          reject(new Error('Erreur lors du traitement de la réponse'));
        }
      });

      // Gestion des erreurs
      xhr.addEventListener('error', () => {
        reject(new Error('Erreur réseau lors de l\'upload'));
      });

      xhr.addEventListener('timeout', () => {
        reject(new Error('Timeout lors de l\'upload'));
      });

      // Configuration et envoi
      xhr.open('POST', url);
      xhr.timeout = options.timeout || this.timeout;

      // Ajout des headers
      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      xhr.send(formData);
    });
  }

  /**
   * Requête GET paginée
   */
  async getPaginated<T>(
    endpoint: string,
    page: number = 1,
    limit: number = 10,
    params?: Record<string, string | number | boolean>,
    options: RequestOptions = {}
  ): Promise<PaginatedResponse<T>> {
    const paginationParams = { page, limit, ...params };
    const response = await this.get<{
      data: T[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(endpoint, paginationParams, options);

    return {
      data: response.data?.data || [],
      pagination: response.data?.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
      success: response.success,
      message: response.message,
    };
  }
}

/**
 * Instance par défaut du client API
 */
export const apiClient = new ApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  timeout: 30000,
  defaultHeaders: {
    'Accept': 'application/json',
  },
});

/**
 * Helper pour créer des instances personnalisées
 */
export const createApiClient = (config: ApiClientConfig): ApiClient => {
  return new ApiClient(config);
};

/**
 * Utilitaires pour la gestion des erreurs
 */
export const isApiError = (error: unknown): error is ApiError => {
  return typeof error === 'object' && error !== null && 'status' in error;
};

export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Une erreur inattendue s\'est produite';
};