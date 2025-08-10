// src/lib/auth/context.tsx
/**
 * Contexte d'authentification - Tous Statisticien Academy
 * Gestion globale de l'état d'authentification avec persistance
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AuthUser, AuthContextValue, LoginCredentials, RegistrationData, ResourcePermissions } from '@/types/auth';
import { Role } from '@/types';
import { authService } from '@/lib/api/auth';
import { apiClient } from '@/lib/api/client';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

// ==============================================
// CONTEXTE D'AUTHENTIFICATION
// ==============================================

// Interface étendue pour inclure les méthodes manquantes
interface ExtendedAuthContextValue extends AuthContextValue {
  hasRole: (role: Role) => boolean;
  hasPermission: (resource: keyof ResourcePermissions, action: string) => boolean;
  canAccess: (route: string) => boolean;
}

const AuthContext = createContext<ExtendedAuthContextValue | undefined>(undefined);

// ==============================================
// CONSTANTES DE CACHE
// ==============================================

const CACHE_KEYS = {
  USER: 'tous_statisticien_user',
  TOKEN: 'tous_statisticien_token',
  PREFERENCES: 'tous_statisticien_preferences',
  REMEMBER_ME: 'tous_statisticien_remember_me',
} as const;

const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes avant expiration

// ==============================================
// TYPES INTERNES
// ==============================================

interface CachedAuthData {
  user: AuthUser;
  token: string;
  expiresAt: number;
  rememberMe: boolean;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

// ==============================================
// PROVIDER D'AUTHENTIFICATION
// ==============================================

export function AuthProvider({ children }: AuthProviderProps) {
  // État local
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Cache local avec types stricts
  const [cachedAuth, setCachedAuth] = useLocalStorage<CachedAuthData | null>(
    CACHE_KEYS.USER,
    null
  );
  const [rememberMe, setRememberMe] = useLocalStorage<boolean>(
    CACHE_KEYS.REMEMBER_ME,
    false
  );

  // ==============================================
  // HELPERS INTERNES
  // ==============================================

  /**
   * Vérifie si le token est encore valide
   */
  const isTokenValid = useCallback((tokenData: CachedAuthData): boolean => {
    const now = Date.now();
    const expiresAt = tokenData.expiresAt;
    return now < expiresAt;
  }, []);

  /**
   * Vérifie si le token doit être rafraîchi
   */
  const shouldRefreshToken = useCallback((tokenData: CachedAuthData): boolean => {
    const now = Date.now();
    const expiresAt = tokenData.expiresAt;
    return (expiresAt - now) < TOKEN_REFRESH_THRESHOLD;
  }, []);

  /**
   * Sauvegarde les données d'authentification
   */
  const saveAuthData = useCallback((
    userData: AuthUser,
    tokenValue: string,
    expiresIn: number = 24 * 60 * 60 * 1000, // 24h par défaut
    remember: boolean = false
  ) => {
    const expiresAt = Date.now() + expiresIn;
    const authData: CachedAuthData = {
      user: userData,
      token: tokenValue,
      expiresAt,
      rememberMe: remember,
    };

    setUser(userData);
    setToken(tokenValue);
    setCachedAuth(authData);
    setRememberMe(remember);

    // Définir le token dans le service API
    apiClient.setAuthToken(tokenValue);
  }, [setCachedAuth, setRememberMe]);

  /**
   * Nettoie les données d'authentification
   */
  const clearAuthData = useCallback(() => {
    setUser(null);
    setToken(null);
    setCachedAuth(null);
    apiClient.setAuthToken(null);
  }, [setCachedAuth]);

  /**
   * Rafraîchit le token automatiquement
   */
  const refreshTokenIfNeeded = useCallback(async () => {
    if (!cachedAuth || !isTokenValid(cachedAuth)) {
      return false;
    }

    if (shouldRefreshToken(cachedAuth)) {
      try {
        if (authService && typeof authService.refreshToken === 'function') {
          const refreshResponse = await authService.refreshToken();
          saveAuthData(
            refreshResponse.user,
            refreshResponse.token,
            refreshResponse.expiresIn,
            cachedAuth.rememberMe
          );
          return true;
        }
        return false;
      } catch (error) {
        console.warn('Échec du rafraîchissement du token:', error);
        clearAuthData();
        return false;
      }
    }

    return true;
  }, [cachedAuth, isTokenValid, shouldRefreshToken, saveAuthData, clearAuthData]);

  // ==============================================
  // FONCTIONS D'AUTHENTIFICATION
  // ==============================================

  /**
   * Connexion utilisateur
   */
  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthUser> => {
    try {
      setIsLoading(true);

      if (authService && typeof authService.login === 'function') {
        const response = await authService.login(credentials);
        
        saveAuthData(
          response.user,
          response.token,
          response.expiresIn,
          credentials.rememberMe || false
        );

        toast.success(`Bienvenue ${response.user.firstName} !`, {
          description: 'Connexion réussie',
          className: 'bg-green-50 text-green-900 border-green-200',
        });

        return response.user;
      } else {
        throw new Error('Service d\'authentification non disponible');
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Erreur de connexion';
      toast.error('Échec de connexion', {
        description: errorMessage,
        className: 'bg-red-50 text-red-900 border-red-200',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [saveAuthData]);

  /**
   * Déconnexion utilisateur
   */
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Appeler le service de déconnexion
      if (authService && typeof authService.logout === 'function') {
        await authService.logout();
      }
      
      // Nettoyer les données locales
      clearAuthData();

      toast.info('Déconnexion réussie', {
        description: 'À bientôt !',
        className: 'bg-blue-50 text-blue-900 border-blue-200',
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Nettoyer quand même les données locales
      clearAuthData();
    } finally {
      setIsLoading(false);
    }
  }, [clearAuthData]);

  /**
   * Inscription utilisateur (processus en 3 étapes)
   */
  const register = useCallback(async (data: RegistrationData): Promise<void> => {
    try {
      setIsLoading(true);

      if (!authService) {
        throw new Error('Service d\'authentification non disponible');
      }

      // Étape 1 : Démarrer l'inscription
      if (typeof authService.startRegistration === 'function') {
        const step1Response = await authService.startRegistration(data.step1);
        
        // Étape 2 : Vérifier le code (le token est déjà dans data.step2)
        if (typeof authService.verifyCode === 'function') {
          await authService.verifyCode(data.step2);
        }
        
        // Étape 3 : Finaliser avec le mot de passe
        if (typeof authService.completeRegistration === 'function') {
          const finalResponse = await authService.completeRegistration(data.step3);
          
          // Auto-connexion après inscription réussie
          if (typeof authService.login === 'function') {
            const loginResponse = await authService.login({
              email: data.step1.email,
              password: data.step3.password,
              rememberMe: false,
            });

            saveAuthData(
              loginResponse.user,
              loginResponse.token,
              loginResponse.expiresIn,
              false
            );
          }

          toast.success('Inscription réussie !', {
            description: `Bienvenue ${finalResponse.firstName} ! Votre compte a été créé avec succès.`,
            className: 'bg-green-50 text-green-900 border-green-200',
            duration: 5000,
          });
        }
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Erreur lors de l\'inscription';
      toast.error('Échec de l\'inscription', {
        description: errorMessage,
        className: 'bg-red-50 text-red-900 border-red-200',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [saveAuthData]);

  /**
   * Met à jour les données utilisateur
   */
  const updateUser = useCallback((userData: Partial<AuthUser>) => {
    if (!user || !cachedAuth) return;

    const updatedUser = { ...user, ...userData };
    const updatedAuthData = { ...cachedAuth, user: updatedUser };
    
    setUser(updatedUser);
    setCachedAuth(updatedAuthData);
  }, [user, cachedAuth, setCachedAuth]);

  /**
   * Vérifie le statut d'authentification
   */
  const checkAuthStatus = useCallback(async (): Promise<boolean> => {
    try {
      if (!cachedAuth) return false;

      if (!isTokenValid(cachedAuth)) {
        clearAuthData();
        return false;
      }

      // Rafraîchir le token si nécessaire
      const refreshSuccess = await refreshTokenIfNeeded();
      if (!refreshSuccess) {
        return false;
      }

      // Valider le token côté serveur
      if (authService && typeof authService.validateToken === 'function') {
        const isValid = await authService.validateToken();
        if (!isValid) {
          clearAuthData();
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la vérification du statut d\'auth:', error);
      clearAuthData();
      return false;
    }
  }, [cachedAuth, isTokenValid, clearAuthData, refreshTokenIfNeeded]);

  // ==============================================
  // INITIALISATION ET EFFETS
  // ==============================================

  /**
   * Initialise l'authentification au chargement
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);

        // Vérifier s'il y a des données en cache
        if (cachedAuth) {
          // Vérifier la validité du token
          if (isTokenValid(cachedAuth)) {
            // Restaurer l'état d'authentification
            setUser(cachedAuth.user);
            setToken(cachedAuth.token);
            apiClient.setAuthToken(cachedAuth.token);

            // Vérifier le statut côté serveur
            const isValid = await checkAuthStatus();
            if (!isValid) {
              clearAuthData();
            }
          } else {
            // Token expiré, nettoyer le cache
            clearAuthData();
          }
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'auth:', error);
        clearAuthData();
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    if (!isInitialized) {
      initializeAuth();
    }
  }, [cachedAuth, isTokenValid, checkAuthStatus, clearAuthData, isInitialized]);

  /**
   * Rafraîchissement automatique du token
   */
  useEffect(() => {
    if (!user || !isInitialized) return;

    const refreshInterval = setInterval(async () => {
      await refreshTokenIfNeeded();
    }, 60000); // Vérifier toutes les minutes

    return () => clearInterval(refreshInterval);
  }, [user, refreshTokenIfNeeded, isInitialized]);

  /**
   * Nettoyage automatique si l'utilisateur n'a pas "Remember Me"
   */
  useEffect(() => {
    if (!rememberMe && user) {
      const handleBeforeUnload = () => {
        // Ne pas nettoyer immédiatement, laisser la session active
        // Le nettoyage se fera à l'expiration du token
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
    
    // Retourner une fonction de nettoyage vide si la condition n'est pas remplie
    return () => {};
  }, [rememberMe, user]);

  /**
   * Détection de changement d'onglet pour la synchronisation
   */
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CACHE_KEYS.USER) {
        if (e.newValue === null) {
          // L'utilisateur s'est déconnecté dans un autre onglet
          clearAuthData();
        } else {
          // L'utilisateur s'est connecté dans un autre onglet
          try {
            const newAuthData: CachedAuthData = JSON.parse(e.newValue);
            if (isTokenValid(newAuthData)) {
              setUser(newAuthData.user);
              setToken(newAuthData.token);
              apiClient.setAuthToken(newAuthData.token);
            }
          } catch (error) {
            console.error('Erreur lors de la synchronisation inter-onglets:', error);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [clearAuthData, isTokenValid]);

  // ==============================================
  // HELPERS POUR L'AUTORISATION
  // ==============================================

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   */
  const hasRole = useCallback((role: Role): boolean => {
    if (!user) return false;
    return user.role === role;
  }, [user]);

  /**
   * Vérifie si l'utilisateur a une permission spécifique
   */
  const hasPermission = useCallback((resource: keyof ResourcePermissions, action: string): boolean => {
    if (!user) return false;

    // Logique de permissions basée sur les rôles
    switch (user.role) {
      case Role.ADMIN:
        return true; // Admin a tous les droits

      case Role.FORMATEUR:
        // Formateur peut gérer les cours mais pas les utilisateurs
        const formateurPermissions = [
          'classes:read', 'classes:create', 'classes:update',
          'modules:read', 'modules:create', 'modules:update',
          'lectures:read', 'lectures:create', 'lectures:update',
          'evaluations:read', 'evaluations:create', 'evaluations:update', 'evaluations:grade',
          'submissions:read', 'submissions:view_all',
          'statistics:read', 'statistics:view_own',
        ];
        return formateurPermissions.includes(`${resource}:${action}`);

      case Role.STUDENT:
        // Étudiant peut seulement consulter et soumettre
        const studentPermissions = [
          'classes:read', 'modules:read', 'lectures:read', 'lectures:view',
          'evaluations:read', 'evaluations:submit',
          'submissions:read', 'submissions:create',
          'statistics:view_own',
        ];
        return studentPermissions.includes(`${resource}:${action}`);

      default:
        return false;
    }
  }, [user]);

  /**
   * Vérifie si l'utilisateur peut accéder à une route
   */
  const canAccess = useCallback((route: string): boolean => {
    if (!user) return false;

    // Routes publiques
    const publicRoutes = ['/about', '/contact', '/pricing', '/features'];
    if (publicRoutes.some(r => route.startsWith(r))) return true;

    // Routes d'authentification (accessible seulement si non connecté)
    const authRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password'];
    if (authRoutes.some(r => route.startsWith(r))) return !user;

    // Routes du dashboard
    if (route.startsWith('/dashboard/admin')) {
      return hasRole(Role.ADMIN);
    }
    if (route.startsWith('/dashboard/formateur')) {
      return hasRole(Role.FORMATEUR) || hasRole(Role.ADMIN);
    }
    if (route.startsWith('/dashboard/student')) {
      return hasRole(Role.STUDENT) || hasRole(Role.FORMATEUR) || hasRole(Role.ADMIN);
    }

    // Routes nécessitant un paiement
    const paidRoutes = ['/classes', '/modules', '/lectures'];
    if (paidRoutes.some(r => route.startsWith(r))) {
      return user.hasPaid || hasRole(Role.ADMIN) || hasRole(Role.FORMATEUR);
    }

    return true;
  }, [user, hasRole]);

  // ==============================================
  // VALEUR DU CONTEXTE
  // ==============================================

  const contextValue: ExtendedAuthContextValue = {
    // État
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,

    // Actions
    login,
    logout,
    register,
    updateUser,
    checkAuthStatus,

    // Helpers d'autorisation
    hasRole,
    hasPermission,
    canAccess,
  };

  // Ne pas rendre le provider tant que l'initialisation n'est pas terminée
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white mb-2">Tous Statisticien Academy</h2>
          <p className="text-slate-300">Initialisation...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// ==============================================
// HOOK D'UTILISATION DU CONTEXTE
// ==============================================

/**
 * Hook pour utiliser le contexte d'authentification
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  
  return context;
}

// ==============================================
// HOOKS UTILITAIRES D'AUTHENTIFICATION
// ==============================================

/**
 * Hook pour vérifier si l'utilisateur est connecté
 */
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}

/**
 * Hook pour récupérer l'utilisateur actuel
 */
export function useCurrentUser(): AuthUser | null {
  const { user } = useAuth();
  return user;
}

/**
 * Hook pour vérifier les rôles
 */
export function useRole() {
  const { user, hasRole } = useAuth();
  return {
    user,
    role: user?.role || null,
    isAdmin: hasRole(Role.ADMIN),
    isFormateur: hasRole(Role.FORMATEUR),
    isStudent: hasRole(Role.STUDENT),
    hasRole,
  };
}

/**
 * Hook pour vérifier les permissions
 */
export function usePermissions() {
  const { user, hasPermission, canAccess } = useAuth();
  return {
    user,
    hasPermission,
    canAccess,
    canManageUsers: hasPermission('users', 'read'),
    canManageClasses: hasPermission('classes', 'create'),
    canGradeEvaluations: hasPermission('evaluations', 'grade'),
    canViewStatistics: hasPermission('statistics', 'read'),
  };
}

/**
 * Hook pour les actions d'authentification
 */
export function useAuthActions() {
  const { login, logout, register, updateUser, checkAuthStatus } = useAuth();
  return {
    login,
    logout,
    register,
    updateUser,
    checkAuthStatus,
  };
}

/**
 * Hook pour surveiller les changements de statut d'authentification
 */
export function useAuthWatcher(callback: (isAuthenticated: boolean) => void) {
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    callback(isAuthenticated);
  }, [isAuthenticated, callback]);
}

// ==============================================
// COMPOSANTS UTILITAIRES
// ==============================================

/**
 * Composant pour afficher du contenu uniquement si l'utilisateur est connecté
 */
export function AuthenticatedOnly({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : null;
}

/**
 * Composant pour afficher du contenu uniquement si l'utilisateur n'est pas connecté
 */
export function UnauthenticatedOnly({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : null;
}

/**
 * Composant pour afficher du contenu basé sur le rôle
 */
export function RoleGuard({ 
  role, 
  children, 
  fallback 
}: { 
  role: Role | Role[]; 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { hasRole } = useAuth();
  
  const hasRequiredRole = Array.isArray(role) 
    ? role.some(r => hasRole(r))
    : hasRole(role);
  
  return hasRequiredRole ? <>{children}</> : <>{fallback}</>;
}

/**
 * Composant pour afficher du contenu basé sur les permissions
 */
export function PermissionGuard({ 
  resource, 
  action, 
  children, 
  fallback 
}: { 
  resource: keyof ResourcePermissions; 
  action: string; 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { hasPermission } = useAuth();
  
  return hasPermission(resource, action) ? <>{children}</> : <>{fallback}</>;
}

/**
 * Composant pour afficher un message de chargement pendant l'authentification
 */
export function AuthLoadingGuard({ 
  children, 
  fallback 
}: { 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { isLoading } = useAuth();
  
  if (isLoading) {
    return fallback ? <>{fallback}</> : (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-300">Chargement...</p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}