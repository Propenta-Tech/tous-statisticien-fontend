// src/lib/auth/guards.tsx
/**
 * Guards de protection - Tous Statisticien Academy
 * Composants pour protéger les routes et contrôler l'accès
 */

'use client';

import React, { useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './context';
import { Role } from '@/types';
import { ResourcePermissions } from '@/types/auth';
import { toast } from 'sonner';
import { Shield, Lock, UserX, AlertTriangle } from 'lucide-react';

// ==============================================
// TYPES POUR LES GUARDS
// ==============================================

interface RouteGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
  requireRoles?: Role | Role[];
  requirePermission?: {
    resource: keyof ResourcePermissions;
    action: string;
  };
  requirePayment?: boolean;
  showError?: boolean;
}

interface ProtectedPageProps {
  children: React.ReactNode;
  requiredRole?: Role | Role[];
  requiredPermission?: {
    resource: keyof ResourcePermissions;
    action: string;
  };
  requirePayment?: boolean;
  fallbackPath?: string;
}

// ==============================================
// COMPOSANTS D'ERREUR ET CHARGEMENT
// ==============================================

/**
 * Composant d'erreur d'accès refusé
 */
function AccessDeniedError({ 
  title = "Accès refusé", 
  message = "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
  icon: Icon = Lock,
  action
}: {
  title?: string;
  message?: string;
  icon?: React.ComponentType<any>;
  action?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon className="w-10 h-10 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-4">{title}</h1>
          <p className="text-slate-300 mb-6 leading-relaxed">{message}</p>
          
          {action ? action : (
            <button
              onClick={() => window.history.back()}
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Retour
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Composant d'erreur de paiement requis
 */
function PaymentRequiredError() {
  const router = useRouter();
  
  return (
    <AccessDeniedError
      title="Paiement requis"
      message="Vous devez effectuer un paiement pour accéder à ce contenu premium."
      icon={AlertTriangle}
      action={
        <div className="space-y-3">
          <button
            onClick={() => router.push('/payment')}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Effectuer un paiement
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Retour au dashboard
          </button>
        </div>
      }
    />
  );
}

/**
 * Composant d'erreur de connexion requise
 */
function LoginRequiredError() {
  const router = useRouter();
  const pathname = usePathname();
  
  return (
    <AccessDeniedError
      title="Connexion requise"
      message="Vous devez vous connecter pour accéder à cette page."
      icon={UserX}
      action={
        <div className="space-y-3">
          <button
            onClick={() => router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`)}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Se connecter
          </button>
          <button
            onClick={() => router.push('/auth/register')}
            className="w-full bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Créer un compte
          </button>
        </div>
      }
    />
  );
}

/**
 * Composant de chargement pendant la vérification
 */
function AuthLoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-white mb-2">Vérification des accès...</h2>
        <p className="text-slate-300">Patientez un instant</p>
      </div>
    </div>
  );
}

// ==============================================
// GUARD PRINCIPAL GÉNÉRIQUE
// ==============================================

/**
 * Guard générique pour protéger des composants
 */
export function RouteGuard({
  children,
  fallback,
  redirectTo,
  requireAuth = false,
  requireRoles,
  requirePermission,
  requirePayment = false,
  showError = true,
}: RouteGuardProps) {
  const { isAuthenticated, user, isLoading, hasRole, hasPermission: checkPermission } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Pendant le chargement
  if (isLoading) {
    return fallback || <AuthLoadingSpinner />;
  }

  // Vérification de l'authentification
  if (requireAuth && !isAuthenticated) {
    if (redirectTo) {
      router.push(redirectTo);
      return <AuthLoadingSpinner />;
    }
    return showError ? <LoginRequiredError /> : (fallback || null);
  }

  // Vérification des rôles
  if (requireRoles && user) {
    const roles = Array.isArray(requireRoles) ? requireRoles : [requireRoles];
    const hasRequiredRole = roles.some(role => hasRole(role));
    
    if (!hasRequiredRole) {
      if (redirectTo) {
        router.push(redirectTo);
        return <AuthLoadingSpinner />;
      }
      return showError ? (
        <AccessDeniedError
          title="Rôle insuffisant"
          message={`Vous devez avoir l'un des rôles suivants : ${roles.join(', ')}`}
          icon={Shield}
        />
      ) : (fallback || null);
    }
  }

  // Vérification des permissions
  if (requirePermission && user) {
    const hasRequiredPermission = checkPermission(
      requirePermission.resource as keyof ResourcePermissions,
      requirePermission.action
    );
    
    if (!hasRequiredPermission) {
      if (redirectTo) {
        router.push(redirectTo);
        return <AuthLoadingSpinner />;
      }
      return showError ? (
        <AccessDeniedError
          title="Permission insuffisante"
          message={`Vous n'avez pas la permission ${requirePermission.action} sur ${requirePermission.resource}`}
          icon={Shield}
        />
      ) : (fallback || null);
    }
  }

  // Vérification du paiement
  if (requirePayment && user && !user.hasPaid && !hasRole(Role.ADMIN) && !hasRole(Role.FORMATEUR)) {
    if (redirectTo) {
      router.push(redirectTo);
      return <AuthLoadingSpinner />;
    }
    return showError ? <PaymentRequiredError /> : (fallback || null);
  }

  return <>{children}</>;
}

// ==============================================
// GUARDS SPÉCIALISÉS
// ==============================================

/**
 * Guard pour les pages nécessitant une authentification
 */
export function AuthGuard({ 
  children, 
  fallback,
  redirectTo = '/auth/login'
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}) {
  return (
    <RouteGuard
      requireAuth
      redirectTo={redirectTo}
      fallback={fallback}
    >
      {children}
    </RouteGuard>
  );
}

/**
 * Guard pour les administrateurs uniquement
 */
export function AdminGuard({ 
  children, 
  fallback,
  redirectTo
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}) {
  return (
    <RouteGuard
      requireAuth
      requireRoles={Role.ADMIN}
      redirectTo={redirectTo}
      fallback={fallback}
    >
      {children}
    </RouteGuard>
  );
}

/**
 * Guard pour les formateurs et administrateurs
 */
export function FormateurGuard({ 
  children, 
  fallback,
  redirectTo
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}) {
  return (
    <RouteGuard
      requireAuth
      requireRoles={[Role.FORMATEUR, Role.ADMIN]}
      redirectTo={redirectTo}
      fallback={fallback}
    >
      {children}
    </RouteGuard>
  );
}

/**
 * Guard pour le contenu premium (paiement requis)
 */
export function PremiumGuard({ 
  children, 
  fallback,
  redirectTo
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}) {
  return (
    <RouteGuard
      requireAuth
      requirePayment
      redirectTo={redirectTo}
      fallback={fallback}
    >
      {children}
    </RouteGuard>
  );
}

/**
 * Guard pour les pages publiques (redirection si connecté)
 */
export function GuestGuard({ 
  children, 
  redirectTo = '/dashboard'
}: {
  children: React.ReactNode;
  redirectTo?: string;
}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Rediriger vers le dashboard approprié selon le rôle
      const dashboardPath = user.role === Role.ADMIN 
        ? '/dashboard/admin' 
        : user.role === Role.FORMATEUR 
        ? '/dashboard/formateur' 
        : '/dashboard/student';
      
      router.push(redirectTo.includes('dashboard') ? dashboardPath : redirectTo);
    }
  }, [isAuthenticated, isLoading, user, router, redirectTo]);

  if (isLoading) {
    return <AuthLoadingSpinner />;
  }

  if (isAuthenticated) {
    return <AuthLoadingSpinner />;
  }

  return <>{children}</>;
}

// ==============================================
// GUARD DE PROTECTION DE PAGE COMPLÈTE
// ==============================================

/**
 * Guard complet pour protéger une page entière
 */
export function ProtectedPage({
  children,
  requiredRole,
  requiredPermission,
  requirePayment = false,
  fallbackPath,
}: ProtectedPageProps) {
  const { isAuthenticated, user, isLoading, hasRole, hasPermission } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    // Vérification de l'authentification
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!user) return;

    // Vérification des rôles
    if (requiredRole) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      const hasRequiredRole = roles.some(role => hasRole(role));
      
      if (!hasRequiredRole) {
        toast.error('Accès refusé', {
          description: 'Vous n\'avez pas les permissions nécessaires',
          className: 'bg-red-50 text-red-900 border-red-200',
        });
        router.push(fallbackPath || '/dashboard');
        return;
      }
    }

    // Vérification des permissions
    if (requiredPermission) {
      const hasRequiredPermission = hasPermission(
        requiredPermission.resource,
        requiredPermission.action
      );
      
      if (!hasRequiredPermission) {
        toast.error('Permission insuffisante', {
          description: `Vous n'avez pas la permission ${requiredPermission.action} sur ${requiredPermission.resource}`,
          className: 'bg-red-50 text-red-900 border-red-200',
        });
        router.push(fallbackPath || '/dashboard');
        return;
      }
    }

    // Vérification du paiement
    if (requirePayment && !user.hasPaid && !hasRole(Role.ADMIN) && !hasRole(Role.FORMATEUR)) {
      toast.warning('Paiement requis', {
        description: 'Vous devez effectuer un paiement pour accéder à ce contenu',
        className: 'bg-amber-50 text-amber-900 border-amber-200',
      });
      router.push('/payment');
      return;
    }
  }, [
    isAuthenticated,
    user,
    isLoading,
    requiredRole,
    requiredPermission,
    requirePayment,
    hasRole,
    hasPermission,
    router,
    pathname,
    fallbackPath,
  ]);

  if (isLoading) {
    return <AuthLoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <AuthLoadingSpinner />;
  }

  return <>{children}</>;
}

// ==============================================
// GUARDS DE REDIRECTION CONDITIONNELLE
// ==============================================

/**
 * Redirige automatiquement vers le bon dashboard selon le rôle
 */
export function RoleBasedRedirect() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      switch (user.role) {
        case 'ADMIN':
          router.push('/dashboard/admin');
          break;
        case 'FORMATEUR':
          router.push('/dashboard/formateur');
          break;
        case 'STUDENT':
          router.push('/dashboard/student');
          break;
        default:
          router.push('/dashboard');
      }
    }
  }, [user, isLoading, router]);

  return <AuthLoadingSpinner />;
}

/**
 * Guard pour rediriger les utilisateurs non payants
 */
export function PaymentRedirect() {
  const { user, isLoading, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && !user.hasPaid && !hasRole(Role.ADMIN) && !hasRole(Role.FORMATEUR)) {
      router.push('/payment');
    }
  }, [user, isLoading, hasRole, router]);

  return <AuthLoadingSpinner />;
}

// ==============================================
// COMPOSANT D'AIDE POUR LE DEBUGGING
// ==============================================

/**
 * Composant de debug pour afficher les informations d'authentification
 * (à utiliser uniquement en développement)
 */
export function AuthDebugInfo() {
  const { user, isAuthenticated, isLoading, hasRole, hasPermission } = useAuth();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm">
      <h4 className="font-bold mb-2">Debug Auth Info</h4>
      <div className="space-y-1">
        <div>Loading: {isLoading ? 'true' : 'false'}</div>
        <div>Authenticated: {isAuthenticated ? 'true' : 'false'}</div>
        <div>User: {user ? `${user.firstName} ${user.lastName} (${user.role})` : 'null'}</div>
        <div>Has Paid: {user ? (user.hasPaid ? 'true' : 'false') : 'null'}</div>
        <div>Is Admin: {hasRole(Role.ADMIN) ? 'true' : 'false'}</div>
        <div>Is Formateur: {hasRole(Role.FORMATEUR) ? 'true' : 'false'}</div>
        <div>Is Student: {hasRole(Role.STUDENT) ? 'true' : 'false'}</div>
        <div>Can Manage Users: {hasPermission('users', 'read') ? 'true' : 'false'}</div>
        <div>Can Grade: {hasPermission('evaluations', 'grade') ? 'true' : 'false'}</div>
      </div>
    </div>
  );
}

// ==============================================
// EXPORTS PERSONNALISÉS POUR DES CAS SPÉCIFIQUES
// ==============================================

/**
 * HOC pour protéger automatiquement un composant de page
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    requiredRole?: Role | Role[];
    requiredPermission?: { resource: keyof ResourcePermissions; action: string };
    requirePayment?: boolean;
    fallbackPath?: string;
  } = {}
) {
  const AuthenticatedComponent = (props: P) => {
    return (
      <ProtectedPage
        requiredRole={options.requiredRole}
        requiredPermission={options.requiredPermission}
        requirePayment={options.requirePayment}
        fallbackPath={options.fallbackPath}
      >
        <Component {...props} />
      </ProtectedPage>
    );
  };

  AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
  return AuthenticatedComponent;
}

/**
 * HOC pour protéger automatiquement un composant avec un rôle admin
 */
export function withAdminAuth<P extends object>(Component: React.ComponentType<P>) {
  return withAuth(Component, { requiredRole: Role.ADMIN });
}

/**
 * HOC pour protéger automatiquement un composant avec un rôle formateur
 */
export function withFormateurAuth<P extends object>(Component: React.ComponentType<P>) {
  return withAuth(Component, { requiredRole: [Role.FORMATEUR, Role.ADMIN] });
}

/**
 * HOC pour protéger automatiquement un composant avec paiement requis
 */
export function withPremiumAuth<P extends object>(Component: React.ComponentType<P>) {
  return withAuth(Component, { requirePayment: true });
}

// ==============================================
// GUARDS POUR LES API ROUTES (côté serveur)
// ==============================================

/**
 * Type pour les options de validation côté serveur
 */
export interface ServerAuthOptions {
  requiredRole?: Role | Role[];
  requiredPermission?: { resource: keyof ResourcePermissions; action: string };
  requirePayment?: boolean;
}

/**
 * Utilitaire pour valider l'authentification côté serveur
 * (à utiliser dans les API routes)
 */
export function validateServerAuth(
  request: Request,
  options: ServerAuthOptions = {}
): {
  isValid: boolean;
  user?: any;
  error?: string;
} {
  // Cette fonction sera utilisée côté serveur
  // L'implémentation complète dépendra de votre setup serveur
  
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { isValid: false, error: 'Token d\'authentification manquant' };
  }

  const token = authHeader.substring(7);
  
  try {
    // Ici vous devrez implémenter la validation du JWT côté serveur
    // Ceci est un exemple simplifié
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Vérifier l'expiration
    if (payload.exp * 1000 < Date.now()) {
      return { isValid: false, error: 'Token expiré' };
    }

    // Vérifier les rôles si requis
    if (options.requiredRole) {
      const roles = Array.isArray(options.requiredRole) ? options.requiredRole : [options.requiredRole];
      if (!roles.includes(payload.role)) {
        return { isValid: false, error: 'Rôle insuffisant' };
      }
    }

    // Vérifier le paiement si requis
    if (options.requirePayment && !payload.hasPaid && payload.role !== 'ADMIN' && payload.role !== 'FORMATEUR') {
      return { isValid: false, error: 'Paiement requis' };
    }

    return { isValid: true, user: payload };
  } catch (error) {
    return { isValid: false, error: 'Token invalide' };
  }
}

// ==============================================
// HOOKS UTILITAIRES POUR LES GUARDS
// ==============================================

/**
 * Hook pour surveiller l'accès à une ressource
 */
export function useAccessControl(
  resource: keyof ResourcePermissions,
  action: string
): {
  hasAccess: boolean;
  isLoading: boolean;
  error?: string;
} {
  const { hasPermission, isLoading, user } = useAuth();

  return {
    hasAccess: user ? hasPermission(resource, action) : false,
    isLoading,
    error: !user && !isLoading ? 'Utilisateur non connecté' : undefined,
  };
}

/**
 * Hook pour surveiller l'accès basé sur le rôle
 */
export function useRoleAccess(
  requiredRole: Role | Role[]
): {
  hasAccess: boolean;
  isLoading: boolean;
  userRole?: Role;
} {
  const { hasRole, isLoading, user } = useAuth();

  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  const hasRequiredRole = roles.some(role => hasRole(role));

  return {
    hasAccess: hasRequiredRole,
    isLoading,
    userRole: user?.role,
  };
}

/**
 * Hook pour surveiller l'accès au contenu premium
 */
export function usePremiumAccess(): {
  hasAccess: boolean;
  isLoading: boolean;
  hasPaid: boolean;
  canBypass: boolean;
} {
  const { user, isLoading, hasRole } = useAuth();

  const canBypass = hasRole(Role.ADMIN) || hasRole(Role.FORMATEUR);
  const hasPaid = user?.hasPaid || false;
  const hasAccess = hasPaid || canBypass;

  return {
    hasAccess,
    isLoading,
    hasPaid,
    canBypass,
  };
}

/**
 * Hook pour la navigation conditionnelle basée sur les permissions
 */
export function useConditionalNavigation() {
  const { user, hasRole, hasPermission, canAccess } = useAuth();
  const router = useRouter();

  const navigateIfAllowed = useCallback((path: string) => {
    if (canAccess(path)) {
      router.push(path);
    } else {
      toast.error('Accès refusé', {
        description: 'Vous n\'avez pas les permissions pour accéder à cette page',
        className: 'bg-red-50 text-red-900 border-red-200',
      });
    }
  }, [canAccess, router]);

  const navigateToRoleDashboard = useCallback(() => {
    if (!user) return;

    switch (user.role) {
      case Role.ADMIN:
        router.push('/dashboard/admin');
        break;
      case Role.FORMATEUR:
        router.push('/dashboard/formateur');
        break;
      case Role.STUDENT:
        router.push('/dashboard/student');
        break;
      default:
        router.push('/dashboard');
    }
  }, [user, router]);

  return {
    navigateIfAllowed,
    navigateToRoleDashboard,
    canNavigateTo: canAccess,
  };
}

// ==============================================
// CONSTANTES ET CONFIGURATION
// ==============================================

/**
 * Configuration des routes protégées
 */
export const PROTECTED_ROUTES = {
  // Routes d'administration
  ADMIN: [
    '/dashboard/admin',
    '/admin',
    '/users/manage',
    '/statistics',
    '/settings',
  ],
  
  // Routes de formateur
  FORMATEUR: [
    '/dashboard/formateur',
    '/classes/manage',
    '/evaluations/create',
    '/submissions/grade',
  ],
  
  // Routes premium (paiement requis)
  PREMIUM: [
    '/classes',
    '/modules',
    '/lectures/video',
    '/evaluations/participate',
  ],
  
  // Routes publiques (pas de protection)
  PUBLIC: [
    '/',
    '/about',
    '/contact',
    '/pricing',
    '/features',
  ],
  
  // Routes d'authentification (accessible uniquement si non connecté)
  AUTH: [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
  ],
} as const;

/**
 * Messages d'erreur standardisés
 */
export const ACCESS_ERROR_MESSAGES = {
  NOT_AUTHENTICATED: 'Vous devez vous connecter pour accéder à cette page',
  INSUFFICIENT_ROLE: 'Votre rôle ne vous permet pas d\'accéder à cette page',
  INSUFFICIENT_PERMISSION: 'Vous n\'avez pas les permissions nécessaires',
  PAYMENT_REQUIRED: 'Un paiement est requis pour accéder à ce contenu',
  TOKEN_EXPIRED: 'Votre session a expiré, veuillez vous reconnecter',
  ACCOUNT_DISABLED: 'Votre compte a été désactivé',
} as const;