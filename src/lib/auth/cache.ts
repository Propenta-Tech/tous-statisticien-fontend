// src/lib/auth/cache.ts
/**
 * Cache utilisateur - Tous Statisticien Academy
 * Gestion du cache d'authentification avec persistance intelligente
 */

import { AuthUser, CachedUser, UserPreferences } from '@/types/auth';

// ==============================================
// CONSTANTES DE CACHE
// ==============================================

const CACHE_KEYS = {
  USER: 'tous_statisticien_user',
  TOKEN: 'tous_statisticien_token',
  PREFERENCES: 'tous_statisticien_preferences',
  SESSION: 'tous_statisticien_session',
  REMEMBER_ME: 'tous_statisticien_remember_me',
  LAST_ACTIVITY: 'tous_statisticien_last_activity',
  DEVICE_ID: 'tous_statisticien_device_id',
} as const;

const CACHE_VERSION = '1.0.0';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const REMEMBER_ME_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 jours

// ==============================================
// INTERFACES POUR LE CACHE
// ==============================================

interface CacheData {
  version: string;
  timestamp: number;
  data: any;
  expiresAt?: number;
}

interface SessionInfo {
  id: string;
  userId: string;
  createdAt: number;
  lastActivity: number;
  deviceId: string;
  userAgent: string;
  ipAddress?: string;
}

interface CacheStats {
  size: number;
  itemCount: number;
  lastCleanup: number;
  hitRate: number;
  missRate: number;
}

// ==============================================
// CLASSE PRINCIPALE DU CACHE
// ==============================================

export class AuthCache {
  private storage: Storage;
  private memoryCache: Map<string, any> = new Map();
  private hitCount = 0;
  private missCount = 0;
  private lastCleanup = 0;

  constructor(useSessionStorage = false) {
    this.storage = typeof window !== 'undefined' 
      ? (useSessionStorage ? sessionStorage : localStorage)
      : ({
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
          clear: () => {},
          length: 0,
          key: () => null,
        } as Storage);
  }

  // ==============================================
  // MÉTHODES DE BASE
  // ==============================================

  /**
   * Stocke des données dans le cache
   */
  set<T>(key: string, data: T, expiresIn?: number): void {
    const cacheData: CacheData = {
      version: CACHE_VERSION,
      timestamp: Date.now(),
      data,
      expiresAt: expiresIn ? Date.now() + expiresIn : undefined,
    };

    try {
      // Cache en mémoire
      this.memoryCache.set(key, cacheData);

      // Cache persistant
      this.storage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Erreur lors de la sauvegarde en cache:', error);
      this.handleQuotaError();
    }
  }

  /**
   * Récupère des données du cache
   */
  get<T>(key: string): T | null {
    try {
      // Vérifier d'abord le cache en mémoire
      let cacheData = this.memoryCache.get(key);
      
      if (!cacheData) {
        // Vérifier le cache persistant
        const stored = this.storage.getItem(key);
        if (stored) {
          cacheData = JSON.parse(stored);
          this.memoryCache.set(key, cacheData);
        }
      }

      if (!cacheData) {
        this.missCount++;
        return null;
      }

      // Vérifier la version
      if (cacheData.version !== CACHE_VERSION) {
        this.remove(key);
        this.missCount++;
        return null;
      }

      // Vérifier l'expiration
      if (cacheData.expiresAt && Date.now() > cacheData.expiresAt) {
        this.remove(key);
        this.missCount++;
        return null;
      }

      this.hitCount++;
      return cacheData.data;
    } catch (error) {
      console.warn('Erreur lors de la lecture du cache:', error);
      this.missCount++;
      return null;
    }
  }

  /**
   * Supprime une entrée du cache
   */
  remove(key: string): void {
    this.memoryCache.delete(key);
    this.storage.removeItem(key);
  }

  /**
   * Vide complètement le cache
   */
  clear(): void {
    this.memoryCache.clear();
    Object.values(CACHE_KEYS).forEach(key => {
      this.storage.removeItem(key);
    });
  }

  /**
   * Vérifie si une clé existe dans le cache
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  // ==============================================
  // MÉTHODES SPÉCIALISÉES POUR L'AUTHENTIFICATION
  // ==============================================

  /**
   * Sauvegarde les données utilisateur
   */
  setUser(user: AuthUser, token: string, rememberMe: boolean = false): void {
    const expiresIn = rememberMe ? REMEMBER_ME_DURATION : SESSION_TIMEOUT;
    
    const cachedUser: CachedUser = {
      ...user,
      token,
      expiresAt: Date.now() + expiresIn,
    };

    this.set(CACHE_KEYS.USER, cachedUser, expiresIn);
    this.set(CACHE_KEYS.TOKEN, token, expiresIn);
    this.set(CACHE_KEYS.REMEMBER_ME, rememberMe);
    this.updateLastActivity();
  }

  /**
   * Récupère les données utilisateur
   */
  getUser(): CachedUser | null {
    return this.get<CachedUser>(CACHE_KEYS.USER);
  }

  /**
   * Récupère le token d'authentification
   */
  getToken(): string | null {
    return this.get<string>(CACHE_KEYS.TOKEN);
  }

  /**
   * Vérifie si l'utilisateur a choisi "Se souvenir de moi"
   */
  getRememberMe(): boolean {
    return this.get<boolean>(CACHE_KEYS.REMEMBER_ME) || false;
  }

  /**
   * Met à jour les données utilisateur partiellement
   */
  updateUser(updates: Partial<AuthUser>): void {
    const currentUser = this.getUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      this.setUser(updatedUser, currentUser.token, this.getRememberMe());
    }
  }

  /**
   * Supprime toutes les données d'authentification
   */
  clearAuth(): void {
    this.remove(CACHE_KEYS.USER);
    this.remove(CACHE_KEYS.TOKEN);
    this.remove(CACHE_KEYS.REMEMBER_ME);
    this.remove(CACHE_KEYS.SESSION);
    this.remove(CACHE_KEYS.LAST_ACTIVITY);
  }

  // ==============================================
  // GESTION DES PRÉFÉRENCES UTILISATEUR
  // ==============================================

  /**
   * Sauvegarde les préférences utilisateur
   */
  setPreferences(preferences: UserPreferences): void {
    this.set(CACHE_KEYS.PREFERENCES, preferences);
  }

  /**
   * Récupère les préférences utilisateur
   */
  getPreferences(): UserPreferences | null {
    return this.get<UserPreferences>(CACHE_KEYS.PREFERENCES);
  }

  /**
   * Met à jour une préférence spécifique
   */
  updatePreference<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ): void {
    const currentPrefs = this.getPreferences() || this.getDefaultPreferences();
    const updatedPrefs = { ...currentPrefs, [key]: value };
    this.setPreferences(updatedPrefs);
  }

  /**
   * Récupère les préférences par défaut
   */
  private getDefaultPreferences(): UserPreferences {
    return {
      language: 'fr',
      timezone: 'Africa/Douala',
      theme: 'light',
      notifications: {
        email: true,
        push: false,
        sms: false,
        marketing: false,
        evaluationReminders: true,
        gradeNotifications: true,
        classAnnouncements: true,
      },
      privacy: {
        profileVisibility: 'private',
        showEmail: false,
        showPhone: false,
        allowAnalytics: true,
      },
    };
  }

  // ==============================================
  // GESTION DES SESSIONS
  // ==============================================

  /**
   * Crée une nouvelle session
   */
  createSession(userId: string): SessionInfo {
    const session: SessionInfo = {
      id: this.generateSessionId(),
      userId,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      deviceId: this.getOrCreateDeviceId(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
    };

    this.set(CACHE_KEYS.SESSION, session);
    return session;
  }

  /**
   * Récupère la session actuelle
   */
  getSession(): SessionInfo | null {
    return this.get<SessionInfo>(CACHE_KEYS.SESSION);
  }

  /**
   * Met à jour l'activité de la session
   */
  updateLastActivity(): void {
    const session = this.getSession();
    if (session) {
      session.lastActivity = Date.now();
      this.set(CACHE_KEYS.SESSION, session);
    }
    this.set(CACHE_KEYS.LAST_ACTIVITY, Date.now());
  }

  /**
   * Vérifie si la session est expirée
   */
  isSessionExpired(): boolean {
    const session = this.getSession();
    if (!session) return true;

    const timeSinceActivity = Date.now() - session.lastActivity;
    return timeSinceActivity > SESSION_TIMEOUT;
  }

  /**
   * Génère un ID de session unique
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Récupère ou crée un ID d'appareil unique
   */
  private getOrCreateDeviceId(): string {
    let deviceId = this.get<string>(CACHE_KEYS.DEVICE_ID);
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.set(CACHE_KEYS.DEVICE_ID, deviceId, REMEMBER_ME_DURATION);
    }
    return deviceId;
  }

  // ==============================================
  // VALIDATION ET SÉCURITÉ
  // ==============================================

  /**
   * Valide l'intégrité des données utilisateur
   */
  validateUserData(): boolean {
    const user = this.getUser();
    const token = this.getToken();

    if (!user || !token) return false;

    // Vérifier que les données sont cohérentes
    if (user.token !== token) {
      this.clearAuth();
      return false;
    }

    // Vérifier l'expiration
    if (user.expiresAt && Date.now() > user.expiresAt) {
      this.clearAuth();
      return false;
    }

    return true;
  }

  /**
   * Nettoie les données expirées
   */
  cleanup(): void {
    const now = Date.now();
    
    // Nettoyer le cache mémoire expiré
    for (const [key, cacheData] of this.memoryCache.entries()) {
      if (cacheData.expiresAt && now > cacheData.expiresAt) {
        this.memoryCache.delete(key);
      }
    }

    // Nettoyer le stockage persistant
    Object.values(CACHE_KEYS).forEach(key => {
      const data = this.get(key);
      if (data === null) {
        this.remove(key);
      }
    });

    this.lastCleanup = now;
  }

  /**
   * Gère les erreurs de quota de stockage
   */
  private handleQuotaError(): void {
    try {
      // Supprimer les anciennes entrées pour faire de la place
      this.cleanup();
      
      // Si toujours pas de place, supprimer les données non critiques
      this.remove(CACHE_KEYS.PREFERENCES);
      
      console.warn('Quota de stockage atteint, données nettoyées');
    } catch (error) {
      console.error('Impossible de nettoyer le cache:', error);
    }
  }

  // ==============================================
  // STATISTIQUES ET MONITORING
  // ==============================================

  /**
   * Récupère les statistiques du cache
   */
  getStats(): CacheStats {
    const totalRequests = this.hitCount + this.missCount;
    
    return {
      size: this.calculateCacheSize(),
      itemCount: this.memoryCache.size,
      lastCleanup: this.lastCleanup,
      hitRate: totalRequests > 0 ? (this.hitCount / totalRequests) * 100 : 0,
      missRate: totalRequests > 0 ? (this.missCount / totalRequests) * 100 : 0,
    };
  }

  /**
   * Calcule la taille approximative du cache
   */
  private calculateCacheSize(): number {
    let size = 0;
    Object.values(CACHE_KEYS).forEach(key => {
      const item = this.storage.getItem(key);
      if (item) {
        size += item.length * 2; // Approximation UTF-16
      }
    });
    return size;
  }

  /**
   * Réinitialise les statistiques
   */
  resetStats(): void {
    this.hitCount = 0;
    this.missCount = 0;
    this.lastCleanup = Date.now();
  }

  // ==============================================
  // SYNCHRONISATION INTER-ONGLETS
  // ==============================================

  /**
   * Écoute les changements de stockage pour synchroniser les onglets
   */
  startSyncListener(callback: (event: StorageEvent) => void): () => void {
    if (typeof window === 'undefined') return () => {};

    const handler = (event: StorageEvent) => {
      if (Object.values(CACHE_KEYS).includes(event.key as any)) {
        callback(event);
      }
    };

    window.addEventListener('storage', handler);
    
    return () => {
      window.removeEventListener('storage', handler);
    };
  }

  /**
   * Synchronise le cache avec les autres onglets
   */
  syncWithOtherTabs(): void {
    // Déclencher un événement de stockage pour synchroniser les autres onglets
    this.set('sync_trigger', Date.now(), 1000);
  }

  // ==============================================
  // EXPORT/IMPORT DES DONNÉES
  // ==============================================

  /**
   * Exporte toutes les données du cache
   */
  exportData(): Record<string, any> {
    const data: Record<string, any> = {};
    
    Object.values(CACHE_KEYS).forEach(key => {
      const value = this.get(key);
      if (value !== null) {
        data[key] = value;
      }
    });
    
    return data;
  }

  /**
   * Importe des données dans le cache
   */
  importData(data: Record<string, any>): void {
    Object.entries(data).forEach(([key, value]) => {
      if (Object.values(CACHE_KEYS).includes(key as any)) {
        this.set(key, value);
      }
    });
  }

  /**
   * Sauvegarde les données critiques avant déconnexion
   */
  backupCriticalData(): string {
    const criticalData = {
      preferences: this.getPreferences(),
      deviceId: this.get(CACHE_KEYS.DEVICE_ID),
      rememberMe: this.getRememberMe(),
    };
    
    return JSON.stringify(criticalData);
  }

  /**
   * Restaure les données critiques après reconnexion
   */
  restoreCriticalData(backup: string): void {
    try {
      const data = JSON.parse(backup);
      
      if (data.preferences) {
        this.setPreferences(data.preferences);
      }
      
      if (data.deviceId) {
        this.set(CACHE_KEYS.DEVICE_ID, data.deviceId, REMEMBER_ME_DURATION);
      }
      
      if (data.rememberMe !== undefined) {
        this.set(CACHE_KEYS.REMEMBER_ME, data.rememberMe);
      }
    } catch (error) {
      console.error('Erreur lors de la restauration des données:', error);
    }
  }
}

// ==============================================
// INSTANCE GLOBALE ET HELPERS
// ==============================================

/**
 * Instance globale du cache d'authentification
 */
export const authCache = new AuthCache();

/**
 * Instance pour le cache de session (non persistant)
 */
export const sessionCache = new AuthCache(true);

/**
 * Utilitaires pour la gestion du cache
 */
export const CacheUtils = {
  /**
   * Vérifie si le stockage local est disponible
   */
  isStorageAvailable(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Estime l'espace de stockage utilisé
   */
  getStorageUsage(): { used: number; total: number; available: number } {
    if (typeof navigator === 'undefined' || !navigator.storage?.estimate) {
      return { used: 0, total: 0, available: 0 };
    }

    // Cette API n'est pas encore largement supportée
    // En attendant, on fait une estimation basée sur les données stockées
    let used = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        used += (key.length + (value?.length || 0)) * 2; // UTF-16
      }
    }

    // Estimation approximative de la limite (5-10MB pour la plupart des navigateurs)
    const total = 10 * 1024 * 1024; // 10MB
    const available = total - used;

    return { used, total, available };
  },

  /**
   * Nettoie le cache de manière sélective
   */
  smartCleanup(): void {
    const usage = CacheUtils.getStorageUsage();
    const usagePercentage = (usage.used / usage.total) * 100;

    // Si on utilise plus de 80% de l'espace, nettoyer
    if (usagePercentage > 80) {
      authCache.cleanup();
      sessionCache.cleanup();
    }
  },

  /**
   * Migre les données d'une ancienne version du cache
   */
  migrateCache(fromVersion: string, toVersion: string): void {
    // Logique de migration selon les versions
    if (fromVersion === '0.9.0' && toVersion === '1.0.0') {
      // Exemple de migration
      const oldUserData = localStorage.getItem('old_user_key');
      if (oldUserData) {
        try {
          const userData = JSON.parse(oldUserData);
          authCache.setUser(userData.user, userData.token, userData.rememberMe);
          localStorage.removeItem('old_user_key');
        } catch (error) {
          console.error('Erreur lors de la migration du cache:', error);
        }
      }
    }
  },

  /**
   * Valide l'intégrité de toutes les données en cache
   */
  validateAllData(): boolean {
    try {
      // Vérifier que les données critiques sont valides
      const user = authCache.getUser();
      const token = authCache.getToken();
      const session = authCache.getSession();

      if (user && token) {
        // Vérifier la cohérence entre user et token
        if (user.token !== token) {
          console.warn('Incohérence détectée entre user et token');
          return false;
        }
      }

      if (session) {
        // Vérifier que la session n'est pas corrompue
        if (!session.id || !session.userId) {
          console.warn('Session corrompue détectée');
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la validation des données:', error);
      return false;
    }
  },
};

/**
 * Hook pour utiliser le cache d'authentification dans les composants React
 */
export function useAuthCache() {
  const [cacheStats, setCacheStats] = React.useState<CacheStats | null>(null);

  React.useEffect(() => {
    // Mettre à jour les stats périodiquement
    const updateStats = () => {
      setCacheStats(authCache.getStats());
    };

    updateStats();
    const interval = setInterval(updateStats, 30000); // Toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  return {
    cache: authCache,
    stats: cacheStats,
    utils: CacheUtils,
  };
}

/**
 * Hook pour synchroniser le cache entre les onglets
 */
export function useCacheSync() {
  React.useEffect(() => {
    const cleanup = authCache.startSyncListener((event) => {
      if (event.key === CACHE_KEYS.USER) {
        // L'utilisateur a changé dans un autre onglet
        window.dispatchEvent(new CustomEvent('auth-sync', {
          detail: { type: 'user_changed', data: event.newValue }
        }));
      }
    });

    return cleanup;
  }, []);
}

/**
 * Middleware pour nettoyer automatiquement le cache
 */
export function setupCacheCleanup(): void {
  if (typeof window === 'undefined') return;

  // Nettoyer au chargement de la page
  authCache.cleanup();

  // Nettoyer avant la fermeture de la page
  window.addEventListener('beforeunload', () => {
    if (!authCache.getRememberMe()) {
      // Si "Se souvenir de moi" n'est pas coché, nettoyer certaines données
      authCache.remove(CACHE_KEYS.SESSION);
      authCache.remove(CACHE_KEYS.LAST_ACTIVITY);
    }
  });

  // Nettoyer périodiquement
  setInterval(() => {
    authCache.cleanup();
    CacheUtils.smartCleanup();
  }, 5 * 60 * 1000); // Toutes les 5 minutes

  // Nettoyer quand la page perd le focus (changement d'onglet)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      authCache.updateLastActivity();
    }
  });
}

/**
 * Configuration du cache pour l'environnement de production
 */
export function configureCacheForProduction(): void {
  // Désactiver les logs en production
  if (process.env.NODE_ENV === 'production') {
    console.warn = () => {};
  }

  // Configurer le nettoyage automatique plus agressif en production
  setInterval(() => {
    CacheUtils.smartCleanup();
  }, 60000); // Toutes les minutes

  // Valider les données au démarrage
  if (!CacheUtils.validateAllData()) {
    authCache.clear();
    console.info('Cache réinitialisé en raison de données invalides');
  }
}

/**
 * Gestionnaire d'erreurs pour le cache
 */
export function handleCacheError(error: Error, context: string): void {
  console.error(`Erreur de cache dans ${context}:`, error);

  // En cas d'erreur critique, nettoyer le cache
  if (error.name === 'QuotaExceededError' || error.message.includes('quota')) {
    CacheUtils.smartCleanup();
  }

  // Autres types d'erreurs pourraient nécessiter un nettoyage complet
  if (error.name === 'SecurityError' || error.message.includes('corrupt')) {
    authCache.clear();
  }
}

// ==============================================
// TYPES ET EXPORTS
// ==============================================

export type { CacheData, SessionInfo, CacheStats };

/**
 * Constantes exportées pour utilisation externe
 */
export const CACHE_CONSTANTS = {
  VERSION: CACHE_VERSION,
  SESSION_TIMEOUT,
  REMEMBER_ME_DURATION,
  KEYS: CACHE_KEYS,
} as const;

/**
 * Interface pour les événements de cache
 */
export interface CacheEvent {
  type: 'user_changed' | 'token_expired' | 'session_expired' | 'cache_cleared';
  data?: any;
  timestamp: number;
}

/**
 * Émetteur d'événements pour le cache
 */
export class CacheEventEmitter {
  private listeners: Map<string, Array<(event: CacheEvent) => void>> = new Map();

  on(type: CacheEvent['type'], listener: (event: CacheEvent) => void): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type)!.push(listener);
  }

  off(type: CacheEvent['type'], listener: (event: CacheEvent) => void): void {
    const listeners = this.listeners.get(type);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit(type: CacheEvent['type'], data?: any): void {
    const listeners = this.listeners.get(type);
    if (listeners) {
      const event: CacheEvent = {
        type,
        data,
        timestamp: Date.now(),
      };
      listeners.forEach(listener => listener(event));
    }
  }
}

/**
 * Instance globale de l'émetteur d'événements
 */
export const cacheEvents = new CacheEventEmitter();

// Déclaration pour l'import React (nécessaire pour les hooks)
declare const React: typeof import('react');