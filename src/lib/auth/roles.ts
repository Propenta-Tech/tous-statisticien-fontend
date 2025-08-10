// src/lib/auth/roles.ts
/**
 * Définition des rôles - Tous Statisticien Academy
 * Configuration et métadonnées des rôles utilisateur
 */

import { Role } from '@/types';
import { LucideIcon, Shield, GraduationCap, Users, BookOpen, BarChart3, Settings, User } from 'lucide-react';

// ==============================================
// INTERFACES DE DÉFINITION DES RÔLES
// ==============================================

export interface RoleDefinition {
  name: Role;
  label: string;
  description: string;
  icon: LucideIcon;
  color: {
    bg: string;
    text: string;
    border: string;
    badge: string;
  };
  capabilities: string[];
  limitations: string[];
  dashboardPath: string;
  defaultRedirect: string;
  menuItems: MenuItem[];
  features: RoleFeatures;
  hierarchy: number;
}

export interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  badge?: string;
  children?: MenuItem[];
  requiresPremium?: boolean;
}

export interface RoleFeatures {
  canCreateContent: boolean;
  canManageUsers: boolean;
  canAccessAnalytics: boolean;
  canModifySettings: boolean;
  canGradeEvaluations: boolean;
  canAccessPremiumContent: boolean;
  canExportData: boolean;
  canManagePayments: boolean;
  canViewAllSubmissions: boolean;
  canPublishContent: boolean;
  maxStudentsPerClass?: number;
  maxClassesCreated?: number;
  storageLimit?: number; // en MB
}

// ==============================================
// DÉFINITIONS DES RÔLES
// ==============================================

/**
 * Définition complète du rôle ADMIN
 */
export const ADMIN_ROLE: RoleDefinition = {
  name: Role.ADMIN,
  label: 'Administrateur',
  description: 'Accès complet à toutes les fonctionnalités de la plateforme. Peut gérer les utilisateurs, les contenus et les paramètres système.',
  icon: Shield,
  color: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-800 border-red-200',
  },
  capabilities: [
    'Gestion complète des utilisateurs',
    'Création et gestion de toutes les classes',
    'Accès aux statistiques globales',
    'Configuration des paramètres système',
    'Gestion des paiements et facturation',
    'Export de toutes les données',
    'Modération du contenu',
    'Support client avancé',
  ],
  limitations: [
    'Responsabilité de la sécurité de la plateforme',
    'Obligation de respecter la confidentialité des données',
  ],
  dashboardPath: '/dashboard/admin',
  defaultRedirect: '/dashboard/admin',
  hierarchy: 3,
  features: {
    canCreateContent: true,
    canManageUsers: true,
    canAccessAnalytics: true,
    canModifySettings: true,
    canGradeEvaluations: true,
    canAccessPremiumContent: true,
    canExportData: true,
    canManagePayments: true,
    canViewAllSubmissions: true,
    canPublishContent: true,
  },
  menuItems: [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      href: '/dashboard/admin',
      icon: BarChart3,
      description: 'Vue d\'ensemble des statistiques',
    },
    {
      id: 'users',
      label: 'Utilisateurs',
      href: '/dashboard/admin/users',
      icon: Users,
      description: 'Gestion des comptes utilisateurs',
      children: [
        {
          id: 'users-list',
          label: 'Liste des utilisateurs',
          href: '/dashboard/admin/users',
          icon: Users,
        },
        {
          id: 'users-create',
          label: 'Créer un utilisateur',
          href: '/dashboard/admin/users/create',
          icon: User,
        },
      ],
    },
    {
      id: 'classes',
      label: 'Classes',
      href: '/dashboard/admin/classes',
      icon: GraduationCap,
      description: 'Gestion des classes virtuelles',
    },
    {
      id: 'content',
      label: 'Contenu',
      href: '/dashboard/admin/content',
      icon: BookOpen,
      description: 'Gestion des modules et lectures',
      children: [
        {
          id: 'modules',
          label: 'Modules',
          href: '/dashboard/admin/modules',
          icon: BookOpen,
        },
        {
          id: 'lectures',
          label: 'Lectures',
          href: '/dashboard/admin/lectures',
          icon: BookOpen,
        },
        {
          id: 'resources',
          label: 'Ressources',
          href: '/dashboard/admin/resources',
          icon: BookOpen,
        },
      ],
    },
    {
      id: 'evaluations',
      label: 'Évaluations',
      href: '/dashboard/admin/evaluations',
      icon: BarChart3,
      description: 'Gestion des évaluations et corrections',
    },
    {
      id: 'payments',
      label: 'Paiements',
      href: '/dashboard/admin/payments',
      icon: BarChart3,
      description: 'Suivi des paiements et facturation',
    },
    {
      id: 'statistics',
      label: 'Statistiques',
      href: '/dashboard/admin/statistics',
      icon: BarChart3,
      description: 'Analyses et rapports détaillés',
    },
    {
      id: 'settings',
      label: 'Paramètres',
      href: '/dashboard/admin/settings',
      icon: Settings,
      description: 'Configuration de la plateforme',
    },
  ],
};

/**
 * Définition complète du rôle FORMATEUR
 */
export const FORMATEUR_ROLE: RoleDefinition = {
  name: Role.FORMATEUR,
  label: 'Formateur',
  description: 'Peut créer et gérer des classes, modules et évaluations. Accès aux outils pédagogiques et de correction.',
  icon: GraduationCap,
  color: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  capabilities: [
    'Création et gestion de classes',
    'Création de modules et lectures',
    'Création et correction d\'évaluations',
    'Suivi de la progression des étudiants',
    'Accès aux statistiques de ses classes',
    'Gestion des ressources pédagogiques',
    'Communication avec les étudiants',
  ],
  limitations: [
    'Ne peut pas gérer les autres utilisateurs',
    'Accès limité aux statistiques globales',
    'Ne peut pas modifier les paramètres système',
    'Limite de 10 classes actives simultanément',
  ],
  dashboardPath: '/dashboard/formateur',
  defaultRedirect: '/dashboard/formateur',
  hierarchy: 2,
  features: {
    canCreateContent: true,
    canManageUsers: false,
    canAccessAnalytics: true,
    canModifySettings: false,
    canGradeEvaluations: true,
    canAccessPremiumContent: true,
    canExportData: true,
    canManagePayments: false,
    canViewAllSubmissions: false,
    canPublishContent: true,
    maxStudentsPerClass: 100,
    maxClassesCreated: 10,
    storageLimit: 5000, // 5GB
  },
  menuItems: [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      href: '/dashboard/formateur',
      icon: BarChart3,
      description: 'Vue d\'ensemble de vos classes',
    },
    {
      id: 'my-classes',
      label: 'Mes Classes',
      href: '/dashboard/formateur/classes',
      icon: GraduationCap,
      description: 'Gestion de vos classes',
      children: [
        {
          id: 'classes-list',
          label: 'Liste des classes',
          href: '/dashboard/formateur/classes',
          icon: GraduationCap,
        },
        {
          id: 'classes-create',
          label: 'Créer une classe',
          href: '/dashboard/formateur/classes/create',
          icon: GraduationCap,
        },
      ],
    },
    {
      id: 'content',
      label: 'Contenu',
      href: '/dashboard/formateur/content',
      icon: BookOpen,
      description: 'Gestion de vos contenus',
      children: [
        {
          id: 'modules',
          label: 'Modules',
          href: '/dashboard/formateur/modules',
          icon: BookOpen,
        },
        {
          id: 'lectures',
          label: 'Lectures',
          href: '/dashboard/formateur/lectures',
          icon: BookOpen,
        },
        {
          id: 'resources',
          label: 'Ressources',
          href: '/dashboard/formateur/resources',
          icon: BookOpen,
        },
      ],
    },
    {
      id: 'evaluations',
      label: 'Évaluations',
      href: '/dashboard/formateur/evaluations',
      icon: BarChart3,
      description: 'Créer et corriger les évaluations',
    },
    {
      id: 'submissions',
      label: 'Corrections',
      href: '/dashboard/formateur/submissions',
      icon: BarChart3,
      description: 'Corriger les travaux des étudiants',
    },
    {
      id: 'statistics',
      label: 'Statistiques',
      href: '/dashboard/formateur/statistics',
      icon: BarChart3,
      description: 'Analyses de vos classes',
    },
  ],
};

/**
 * Définition complète du rôle STUDENT
 */
export const STUDENT_ROLE: RoleDefinition = {
  name: Role.STUDENT,
  label: 'Étudiant',
  description: 'Accès aux cours, évaluations et suivi de progression. Contenu premium disponible après paiement.',
  icon: User,
  color: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    badge: 'bg-green-100 text-green-800 border-green-200',
  },
  capabilities: [
    'Accès aux classes inscrites',
    'Participation aux évaluations',
    'Suivi de sa progression personnelle',
    'Téléchargement des ressources',
    'Communication avec les formateurs',
    'Consultation de ses notes et feedback',
  ],
  limitations: [
    'Contenu premium nécessite un paiement',
    'Ne peut pas créer de contenu',
    'Accès limité aux statistiques personnelles',
    'Ne peut pas gérer d\'autres utilisateurs',
    'Limite de 5 classes simultanées',
  ],
  dashboardPath: '/dashboard/student',
  defaultRedirect: '/dashboard/student',
  hierarchy: 1,
  features: {
    canCreateContent: false,
    canManageUsers: false,
    canAccessAnalytics: false,
    canModifySettings: false,
    canGradeEvaluations: false,
    canAccessPremiumContent: false, // Dépend du paiement
    canExportData: false,
    canManagePayments: false,
    canViewAllSubmissions: false,
    canPublishContent: false,
    maxStudentsPerClass: undefined,
    maxClassesCreated: undefined,
    storageLimit: 100, // 100MB
  },
  menuItems: [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      href: '/dashboard/student',
      icon: BarChart3,
      description: 'Vue d\'ensemble de votre progression',
    },
    {
      id: 'classes',
      label: 'Mes Classes',
      href: '/dashboard/student/classes',
      icon: GraduationCap,
      description: 'Accéder à vos cours',
      requiresPremium: true,
    },
    {
      id: 'evaluations',
      label: 'Évaluations',
      href: '/dashboard/student/evaluations',
      icon: BarChart3,
      description: 'Participer aux évaluations',
      requiresPremium: true,
    },
    {
      id: 'results',
      label: 'Mes Résultats',
      href: '/dashboard/student/results',
      icon: BarChart3,
      description: 'Consulter vos notes',
    },
    {
      id: 'profile',
      label: 'Mon Profil',
      href: '/dashboard/student/profile',
      icon: User,
      description: 'Gérer votre profil',
    },
  ],
};

// ==============================================
// REGISTRE DES RÔLES
// ==============================================

export const ROLE_REGISTRY: Record<Role, RoleDefinition> = {
  ADMIN: ADMIN_ROLE,
  FORMATEUR: FORMATEUR_ROLE,
  STUDENT: STUDENT_ROLE,
};

// ==============================================
// FONCTIONS UTILITAIRES POUR LES RÔLES
// ==============================================

/**
 * Récupère la définition d'un rôle
 */
export function getRoleDefinition(role: Role): RoleDefinition {
  return ROLE_REGISTRY[role];
}

/**
 * Récupère le label d'affichage d'un rôle
 */
export function getRoleLabel(role: Role): string {
  return ROLE_REGISTRY[role]?.label || role;
}

/**
 * Récupère la description d'un rôle
 */
export function getRoleDescription(role: Role): string {
  return ROLE_REGISTRY[role]?.description || '';
}

/**
 * Récupère l'icône d'un rôle
 */
export function getRoleIcon(role: Role): LucideIcon {
  return ROLE_REGISTRY[role]?.icon || User;
}

/**
 * Récupère les couleurs d'un rôle
 */
export function getRoleColors(role: Role) {
  return ROLE_REGISTRY[role]?.color || {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
    badge: 'bg-gray-100 text-gray-800 border-gray-200',
  };
}

/**
 * Récupère le chemin du dashboard pour un rôle
 */
export function getRoleDashboardPath(role: Role): string {
  return ROLE_REGISTRY[role]?.dashboardPath || '/dashboard';
}

/**
 * Récupère les éléments de menu pour un rôle
 */
export function getRoleMenuItems(role: Role, hasPaid: boolean = false): MenuItem[] {
  const items = ROLE_REGISTRY[role]?.menuItems || [];
  
  // Filtrer les éléments premium si l'utilisateur n'a pas payé
  if (!hasPaid && role === 'STUDENT') {
    return items.filter(item => !item.requiresPremium);
  }
  
  return items;
}

/**
 * Récupère les fonctionnalités d'un rôle
 */
export function getRoleFeatures(role: Role): RoleFeatures {
  return ROLE_REGISTRY[role]?.features || {
    canCreateContent: false,
    canManageUsers: false,
    canAccessAnalytics: false,
    canModifySettings: false,
    canGradeEvaluations: false,
    canAccessPremiumContent: false,
    canExportData: false,
    canManagePayments: false,
    canViewAllSubmissions: false,
    canPublishContent: false,
  };
}

/**
 * Vérifie si un rôle a une fonctionnalité spécifique
 */
export function roleHasFeature(role: Role, feature: keyof RoleFeatures): boolean {
  const features = getRoleFeatures(role);
  return features[feature] === true;
}

/**
 * Récupère la hiérarchie d'un rôle
 */
export function getRoleHierarchy(role: Role): number {
  return ROLE_REGISTRY[role]?.hierarchy || 0;
}

/**
 * Compare deux rôles selon leur hiérarchie
 */
export function compareRoles(role1: Role, role2: Role): number {
  return getRoleHierarchy(role1) - getRoleHierarchy(role2);
}

/**
 * Vérifie si un rôle est supérieur à un autre
 */
export function isRoleHigher(role1: Role, role2: Role): boolean {
  return getRoleHierarchy(role1) > getRoleHierarchy(role2);
}

/**
 * Récupère tous les rôles triés par hiérarchie
 */
export function getAllRolesSorted(): RoleDefinition[] {
  return Object.values(ROLE_REGISTRY).sort((a, b) => b.hierarchy - a.hierarchy);
}

/**
 * Récupère tous les rôles inférieurs à un rôle donné
 */
export function getLowerRoles(role: Role): Role[] {
  const currentHierarchy = getRoleHierarchy(role);
  return Object.keys(ROLE_REGISTRY)
    .filter(r => getRoleHierarchy(r as Role) < currentHierarchy) as Role[];
}

/**
 * Récupère tous les rôles supérieurs à un rôle donné
 */
export function getHigherRoles(role: Role): Role[] {
  const currentHierarchy = getRoleHierarchy(role);
  return Object.keys(ROLE_REGISTRY)
    .filter(r => getRoleHierarchy(r as Role) > currentHierarchy) as Role[];
}

/**
 * Vérifie si un utilisateur peut gérer un autre utilisateur selon leurs rôles
 */
export function canManageUserRole(managerRole: Role, targetRole: Role): boolean {
  // Un utilisateur peut gérer les utilisateurs de niveau inférieur
  return isRoleHigher(managerRole, targetRole);
}

// ==============================================
// FONCTIONS DE NAVIGATION ET REDIRECTION
// ==============================================

/**
 * Détermine la redirection appropriée selon le rôle et le contexte
 */
export function getAppropriateRedirect(
  role: Role, 
  hasPaid: boolean = false, 
  context?: 'login' | 'register' | 'payment'
): string {
  const roleDefinition = getRoleDefinition(role);
  
  // Redirection spéciale après paiement
  if (context === 'payment' && role === 'STUDENT') {
    return '/dashboard/student/classes'; // Rediriger vers les classes après paiement
  }
  
  // Redirection spéciale après inscription
  if (context === 'register') {
    if (role === 'STUDENT' && !hasPaid) {
      return '/payment'; // Rediriger vers le paiement pour les nouveaux étudiants
    }
  }
  
  return roleDefinition.defaultRedirect;
}

/**
 * Récupère les routes accessibles pour un rôle
 */
export function getAccessibleRoutes(role: Role, hasPaid: boolean = false): string[] {
  const menuItems = getRoleMenuItems(role, hasPaid);
  const routes: string[] = [];
  
  const extractRoutes = (items: MenuItem[]) => {
    items.forEach(item => {
      if (!item.requiresPremium || hasPaid) {
        routes.push(item.href);
        if (item.children) {
          extractRoutes(item.children);
        }
      }
    });
  };
  
  extractRoutes(menuItems);
  return routes;
}

// ==============================================
// COMPOSANTS UTILITAIRES POUR L'AFFICHAGE
// ==============================================

/**
 * Génère un badge de rôle avec les bonnes couleurs
 */
export function generateRoleBadge(role: Role): {
  text: string;
  className: string;
  icon: LucideIcon;
} {
  const definition = getRoleDefinition(role);
  const colors = getRoleColors(role);
  
  return {
    text: definition.label,
    className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.badge}`,
    icon: definition.icon,
  };
}

/**
 * Génère les props pour un sélecteur de rôle
 */
export function generateRoleSelectOptions(
  currentUserRole?: Role,
  includeCurrentRole: boolean = false
): Array<{
  value: Role;
  label: string;
  description: string;
  disabled: boolean;
}> {
  return getAllRolesSorted().map(role => ({
    value: role.name,
    label: role.label,
    description: role.description,
    disabled: currentUserRole ? 
      (!includeCurrentRole && role.name === currentUserRole) ||
      !canManageUserRole(currentUserRole, role.name) : 
      false,
  }));
}

// ==============================================
// VALIDATIONS ET CONTRAINTES
// ==============================================

/**
 * Valide si une action est autorisée pour un rôle
 */
export function validateRoleAction(
  role: Role,
  action: keyof RoleFeatures,
  context?: {
    hasPaid?: boolean;
    currentUsage?: Record<string, number>;
  }
): {
  allowed: boolean;
  reason?: string;
} {
  const features = getRoleFeatures(role);
  
  // Vérifier si la fonctionnalité est activée pour le rôle
  if (!features[action]) {
    return {
      allowed: false,
      reason: `Cette action n'est pas autorisée pour le rôle ${getRoleLabel(role)}`,
    };
  }
  
  // Vérifications spéciales pour les étudiants
  if (role === 'STUDENT' && action === 'canAccessPremiumContent') {
    if (!context?.hasPaid) {
      return {
        allowed: false,
        reason: 'Un paiement est requis pour accéder au contenu premium',
      };
    }
  }
  
  // Vérifier les limites de quota
  if (context?.currentUsage) {
    const currentClassCount = context.currentUsage.classes || 0;
    const maxClasses = features.maxClassesCreated;
    
    if (action === 'canCreateContent' && maxClasses && currentClassCount >= maxClasses) {
      return {
        allowed: false,
        reason: `Limite de ${maxClasses} classes atteinte`,
      };
    }
  }
  
  return { allowed: true };
}

/**
 * Vérifie les contraintes de stockage pour un rôle
 */
export function checkStorageLimit(
  role: Role,
  currentUsage: number, // en MB
  additionalSize: number = 0 // en MB
): {
  allowed: boolean;
  limit: number;
  usage: number;
  remaining: number;
  percentage: number;
} {
  const features = getRoleFeatures(role);
  const limit = features.storageLimit || Infinity;
  const totalUsage = currentUsage + additionalSize;
  const remaining = limit - currentUsage;
  const percentage = (currentUsage / limit) * 100;
  
  return {
    allowed: totalUsage <= limit,
    limit,
    usage: currentUsage,
    remaining: Math.max(0, remaining),
    percentage: Math.min(100, percentage),
  };
}

// ==============================================
// MÉTADONNÉES ET STATISTIQUES DES RÔLES
// ==============================================

/**
 * Récupère les statistiques d'un rôle
 */
export function getRoleStats(): Record<Role, {
  userCount: number;
  activeUserCount: number;
  features: RoleFeatures;
  hierarchy: number;
}> {
  // Cette fonction pourrait être connectée à votre API pour récupérer des stats réelles
  return {
    ADMIN: {
      userCount: 0,
      activeUserCount: 0,
      features: ADMIN_ROLE.features,
      hierarchy: ADMIN_ROLE.hierarchy,
    },
    FORMATEUR: {
      userCount: 0,
      activeUserCount: 0,
      features: FORMATEUR_ROLE.features,
      hierarchy: FORMATEUR_ROLE.hierarchy,
    },
    STUDENT: {
      userCount: 0,
      activeUserCount: 0,
      features: STUDENT_ROLE.features,
      hierarchy: STUDENT_ROLE.hierarchy,
    },
  };
}

/**
 * Récupère les informations de transition entre rôles
 */
export function getRoleTransitionInfo(fromRole: Role, toRole: Role): {
  allowed: boolean;
  requirements: string[];
  warnings: string[];
  confirmationMessage: string;
} {
  const fromHierarchy = getRoleHierarchy(fromRole);
  const toHierarchy = getRoleHierarchy(toRole);
  
  // Par défaut, seuls les admins peuvent changer les rôles
  const allowed = true; // Cette logique devrait être gérée par les permissions
  
  const requirements: string[] = [];
  const warnings: string[] = [];
  
  // Avertissements spéciaux
  if (fromRole === 'ADMIN' && toRole !== 'ADMIN') {
    warnings.push('L\'utilisateur perdra ses privilèges d\'administration');
  }
  
  if (fromRole === 'FORMATEUR' && toRole === 'STUDENT') {
    warnings.push('L\'utilisateur perdra l\'accès à ses classes créées');
    warnings.push('Les classes existantes devront être réassignées');
  }
  
  if (toRole === 'STUDENT') {
    requirements.push('L\'utilisateur devra effectuer un paiement pour accéder au contenu premium');
  }
  
  const confirmationMessage = `Êtes-vous sûr de vouloir changer le rôle de ${getRoleLabel(fromRole)} vers ${getRoleLabel(toRole)} ?`;
  
  return {
    allowed,
    requirements,
    warnings,
    confirmationMessage,
  };
}

// ==============================================
// CONSTANTES UTILES
// ==============================================

/**
 * Constantes pour les types de contenu par rôle
 */
export const ROLE_CONTENT_TYPES = {
  ADMIN: ['all'],
  FORMATEUR: ['classes', 'modules', 'lectures', 'evaluations', 'resources'],
  STUDENT: ['classes', 'lectures', 'evaluations'],
} as const;

/**
 * Constantes pour les actions autorisées par rôle
 */
export const ROLE_ALLOWED_ACTIONS = {
  ADMIN: ['create', 'read', 'update', 'delete', 'manage', 'export', 'import'],
  FORMATEUR: ['create', 'read', 'update', 'delete', 'manage'],
  STUDENT: ['read', 'view', 'submit'],
} as const;

/**
 * Messages d'aide contextuels pour chaque rôle
 */
export const ROLE_HELP_MESSAGES = {
  ADMIN: {
    welcome: 'Bienvenue dans l\'espace d\'administration. Vous avez accès à toutes les fonctionnalités de la plateforme.',
    firstSteps: [
      'Configurez les paramètres de base de la plateforme',
      'Créez les premiers comptes formateurs',
      'Configurez les méthodes de paiement',
    ],
  },
  FORMATEUR: {
    welcome: 'Bienvenue dans votre espace formateur. Vous pouvez créer et gérer vos classes.',
    firstSteps: [
      'Créez votre première classe virtuelle',
      'Ajoutez des modules et des lectures',
      'Invitez vos étudiants',
    ],
  },
  STUDENT: {
    welcome: 'Bienvenue dans votre espace étudiant. Accédez à vos cours et suivez votre progression.',
    firstSteps: [
      'Consultez les classes disponibles',
      'Effectuez un paiement pour accéder au contenu premium',
      'Commencez votre première leçon',
    ],
  },
} as const;

// ==============================================
// EXPORTS GROUPÉS
// ==============================================

export const RoleUtils = {
  getRoleDefinition,
  getRoleLabel,
  getRoleDescription,
  getRoleIcon,
  getRoleColors,
  getRoleDashboardPath,
  getRoleMenuItems,
  getRoleFeatures,
  roleHasFeature,
  getRoleHierarchy,
  compareRoles,
  isRoleHigher,
  getAllRolesSorted,
  getLowerRoles,
  getHigherRoles,
  canManageUserRole,
  getAppropriateRedirect,
  getAccessibleRoutes,
  generateRoleBadge,
  generateRoleSelectOptions,
  validateRoleAction,
  checkStorageLimit,
  getRoleStats,
  getRoleTransitionInfo,
} as const;

export const RoleConstants = {
  ROLE_CONTENT_TYPES,
  ROLE_ALLOWED_ACTIONS,
  ROLE_HELP_MESSAGES,
} as const;