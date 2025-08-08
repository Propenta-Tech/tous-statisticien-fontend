/**
 * Service d'authentification pour Tous Statisticien Academy
 * Gestion de l'inscription, connexion, et réinitialisation de mot de passe
 */

import { apiClient } from './client';
import { 
  AuthUser as User,
  LoginCredentials as LoginRequest, 
  LoginResponse, 
  RegistrationStep1 as RegisterPhase1Request,
  RegistrationStep2 as VerifyCodeRequest,
  RegistrationStep3 as CompleteRegistrationRequest,
  ForgotPasswordData as ForgotPasswordRequest,
  ResetPasswordData as ResetPasswordRequest
} from '@/types/auth';
import { ApiResponse } from '@/types/api';

/**
 * Response pour le démarrage de l'inscription
 */
interface StartRegistrationResponse {
  message: string;
  verificationToken: string;
}

/**
 * Response pour la vérification du code
 */
interface VerifyCodeResponse {
  message: string;
}

/**
 * Response pour la finalisation de l'inscription
 */
interface CompleteRegistrationResponse extends User {}

/**
 * Response pour mot de passe oublié
 */
interface ForgotPasswordResponse {
  message: string;
}

/**
 * Response pour réinitialisation mot de passe
 */
interface ResetPasswordResponse {
  message: string;
}

/**
 * Service d'authentification
 */
export class AuthService {
  /**
   * Démarre le processus d'inscription (Phase 1)
   * POST /api/auth/register/start
   */
  async startRegistration(data: RegisterPhase1Request): Promise<StartRegistrationResponse> {
    try {
      const response = await apiClient.post<StartRegistrationResponse>('/auth/register/start', data);
      return response.data!;
    } catch (error) {
      console.error('Erreur lors du démarrage de l\'inscription:', error);
      throw error;
    }
  }

  /**
   * Vérifie le code de vérification (Phase 2)
   * POST /api/auth/register/verify
   */
  async verifyCode(data: VerifyCodeRequest): Promise<VerifyCodeResponse> {
    try {
      const response = await apiClient.post<VerifyCodeResponse>('/auth/register/verify', data);
      return response.data!;
    } catch (error) {
      console.error('Erreur lors de la vérification du code:', error);
      throw error;
    }
  }

  /**
   * Finalise l'inscription avec le mot de passe (Phase 3)
   * POST /api/auth/register/complete
   */
  async completeRegistration(data: CompleteRegistrationRequest): Promise<CompleteRegistrationResponse> {
    try {
      const response = await apiClient.post<CompleteRegistrationResponse>('/auth/register/complete', data);
      return response.data!;
    } catch (error) {
      console.error('Erreur lors de la finalisation de l\'inscription:', error);
      throw error;
    }
  }

  /**
   * Connexion d'un utilisateur
   * POST /api/auth/login
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
      
      // Stocker le token automatiquement
      if (response.data?.token) {
        apiClient.setAuthToken(response.data.token);
      }
      
      return response.data!;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  }

  /**
   * Déconnexion d'un utilisateur
   */
  async logout(): Promise<void> {
    try {
      // Supprimer le token
      apiClient.setAuthToken(null);
      
      // Nettoyer le localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        localStorage.removeItem('user_preferences');
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  }

  /**
   * Demande de réinitialisation de mot de passe
   * POST /api/auth/forgot-password
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    try {
      const response = await apiClient.post<ForgotPasswordResponse>('/auth/forgot-password', data);
      return response.data!;
    } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation:', error);
      throw error;
    }
  }

  /**
   * Réinitialisation du mot de passe
   * POST /api/auth/reset-password
   */
  async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    try {
      const response = await apiClient.post<ResetPasswordResponse>('/auth/reset-password', data);
      return response.data!;
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error);
      throw error;
    }
  }

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    const token = apiClient.getAuthToken();
    if (!token) return false;

    try {
      // Vérifier si le token n'est pas expiré
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  /**
   * Récupère les informations de l'utilisateur depuis le token
   */
  getCurrentUser(): User | null {
    const token = apiClient.getAuthToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Vérifier si le token n'est pas expiré
      const currentTime = Date.now() / 1000;
      if (payload.exp <= currentTime) {
        this.logout();
        return null;
      }

      return {
        id: payload.sub || payload.userId,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        role: payload.role,
        hasPaid: payload.hasPaid,
        phone: payload.phone,
        country: payload.country,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error);
      return null;
    }
  }

  /**
   * Rafraîchit le token d'authentification (si supporté par l'API)
   */
  async refreshToken(): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/refresh');
      
      if (response.data?.token) {
        apiClient.setAuthToken(response.data.token);
      }
      
      return response.data!;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      // En cas d'erreur, déconnecter l'utilisateur
      this.logout();
      throw error;
    }
  }

  /**
   * Vérifie la validité du token actuel
   */
  async validateToken(): Promise<boolean> {
    try {
      const token = apiClient.getAuthToken();
      if (!token) return false;

      // Faire une requête simple pour vérifier la validité du token
      await apiClient.get('/auth/validate');
      return true;
    } catch {
      // Si la validation échoue, supprimer le token
      this.logout();
      return false;
    }
  }

  /**
   * Met à jour le profil utilisateur
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put<User>('/auth/profile', data);
      return response.data!;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    }
  }

  /**
   * Change le mot de passe de l'utilisateur
   */
  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>('/auth/change-password', data);
      return response.data!;
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      throw error;
    }
  }

  /**
   * Supprime le compte utilisateur
   */
  async deleteAccount(password: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete<{ message: string }>('/auth/account', {
        headers: {
          'X-Confirm-Password': password,
        },
      });
      
      // Déconnecter automatiquement après suppression
      this.logout();
      
      return response.data!;
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
      throw error;
    }
  }

  /**
   * Envoie à nouveau le code de vérification
   */
  async resendVerificationCode(verificationToken: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>('/auth/resend-code', {
        verificationToken,
      });
      return response.data!;
    } catch (error) {
      console.error('Erreur lors du renvoi du code:', error);
      throw error;
    }
  }
}

/**
 * Instance par défaut du service d'authentification
 */
export const authService = new AuthService();

/**
 * Helper pour vérifier les permissions
 */
export const hasPermission = (user: User | null, requiredRole: string): boolean => {
  if (!user) return false;
  
  const roleHierarchy = ['STUDENT', 'FORMATEUR', 'ADMIN'];
  const userRoleIndex = roleHierarchy.indexOf(user.role);
  const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);
  
  return userRoleIndex >= requiredRoleIndex;
};

/**
 * Helper pour vérifier si l'utilisateur a payé
 */
export const hasUserPaid = (user: User | null): boolean => {
  return user?.hasPaid === true;
};

/**
 * Helper pour formater le nom complet
 */
export const getFullName = (user: User | null): string => {
  if (!user) return '';
  return `${user.firstName} ${user.lastName}`.trim();
};

/**
 * Helper pour obtenir les initiales
 */
export const getUserInitials = (user: User | null): string => {
  if (!user) return '';
  const firstInitial = user.firstName?.charAt(0).toUpperCase() || '';
  const lastInitial = user.lastName?.charAt(0).toUpperCase() || '';
  return `${firstInitial}${lastInitial}`;
};