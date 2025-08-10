// src/lib/auth/permissions.ts
/**
 * Gestion des permissions - Tous Statisticien Academy
 * Système de permissions basé sur les rôles (RBAC)
 */

import { Role } from '@/types';
import { AuthUser } from '@/types/auth';

// ==============================================
// TYPES DE PERMISSIONS
// ==============================================

export type Resource = 
  | 'users'
  | 'classes'
  | 'modules'
  | 'lectures'
  | 'evaluations'
  | 'submissions'
  | 'payments'
  | 'resources'
  | 'statistics'
  | 'settings'
  | 'dashboard';

export type Action = 
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'view'
  | 'view_all'
  | 'view_own'
  | 'manage'
  | 'grade'
  | 'submit'
  | 'enroll'
  | 'download'
  | 'upload'
  | 'publish'
  | 'archive'
  | 'export'
  | 'import';

export interface Permission {
  resource: Resource;
  action: Action;
  conditions?: PermissionCondition[];
}

export interface PermissionCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'gt' | 'lt' | 'in' | 'not_in';
  value: any;
}

export interface RolePermissions {
  role: Role;
  permissions: Permission[];
  inherits?: Role[];
}

// ==============================================
// DÉFINITION DES PERMISSIONS PAR RÔLE
// ==============================================

/**
 * Permissions pour le rôle ADMIN
 */
const ADMIN_PERMISSIONS: Permission[] = [
  // Gestion complète des utilisateurs
  { resource: 'users', action: 'create' },
  { resource: 'users', action: 'read' },
  { resource: 'users', action: 'update' },
  { resource: 'users', action: 'delete' },
  { resource: 'users', action: 'view_all' },
  { resource: 'users', action: 'manage' },
  { resource: 'users', action: 'export' },
  { resource: 'users', action: 'import' },

  // Gestion complète des classes virtuelles
  { resource: 'classes', action: 'create' },
  { resource: 'classes', action: 'read' },
  { resource: 'classes', action: 'update' },
  { resource: 'classes', action: 'delete' },
  { resource: 'classes', action: 'view_all' },
  { resource: 'classes', action: 'manage' },
  { resource: 'classes', action: 'publish' },
  { resource: 'classes', action: 'archive' },

  // Gestion complète des modules
  { resource: 'modules', action: 'create' },
  { resource: 'modules', action: 'read' },
  { resource: 'modules', action: 'update' },
  { resource: 'modules', action: 'delete' },
  { resource: 'modules', action: 'view_all' },
  { resource: 'modules', action: 'manage' },
  { resource: 'modules', action: 'publish' },

  // Gestion complète des lectures
  { resource: 'lectures', action: 'create' },
  { resource: 'lectures', action: 'read' },
  { resource: 'lectures', action: 'update' },
  { resource: 'lectures', action: 'delete' },
  { resource: 'lectures', action: 'view_all' },
  { resource: 'lectures', action: 'view' },
  { resource: 'lectures', action: 'upload' },
  { resource: 'lectures', action: 'publish' },

  // Gestion complète des évaluations
  { resource: 'evaluations', action: 'create' },
  { resource: 'evaluations', action: 'read' },
  { resource: 'evaluations', action: 'update' },
  { resource: 'evaluations', action: 'delete' },
  { resource: 'evaluations', action: 'view_all' },
  { resource: 'evaluations', action: 'grade' },
  { resource: 'evaluations', action: 'publish' },

  // Gestion complète des soumissions
  { resource: 'submissions', action: 'read' },
  { resource: 'submissions', action: 'view_all' },
  { resource: 'submissions', action: 'grade' },
  { resource: 'submissions', action: 'delete' },
  { resource: 'submissions', action: 'export' },

  // Gestion complète des paiements
  { resource: 'payments', action: 'read' },
  { resource: 'payments', action: 'view_all' },
  { resource: 'payments', action: 'update' },
  { resource: 'payments', action: 'delete' },
  { resource: 'payments', action: 'export' },

  // Gestion complète des ressources
  { resource: 'resources', action: 'create' },
  { resource: 'resources', action: 'read' },
  { resource: 'resources', action: 'update' },
  { resource: 'resources', action: 'delete' },
  { resource: 'resources', action: 'view_all' },
  { resource: 'resources', action: 'upload' },
  { resource: 'resources', action: 'download' },
  { resource: 'resources', action: 'publish' },

  // Accès aux statistiques complètes
  { resource: 'statistics', action: 'read' },
  { resource: 'statistics', action: 'view_all' },
  { resource: 'statistics', action: 'export' },

  // Gestion des paramètres système
  { resource: 'settings', action: 'read' },
  { resource: 'settings', action: 'update' },
  { resource: 'settings', action: 'manage' },

  // Accès au dashboard admin
  { resource: 'dashboard', action: 'view' },
];

/**
 * Permissions pour le rôle FORMATEUR
 */
const FORMATEUR_PERMISSIONS: Permission[] = [
  // Lecture des utilisateurs (étudiants uniquement)
  { 
    resource: 'users', 
    action: 'read',
    conditions: [{ field: 'role', operator: 'equals', value: 'STUDENT' }]
  },
  { 
    resource: 'users', 
    action: 'view_own',
  },

  // Gestion des classes (créées par lui ou assignées)
  { resource: 'classes', action: 'create' },
  { resource: 'classes', action: 'read' },
  { 
    resource: 'classes', 
    action: 'update',
    conditions: [{ field: 'createdBy', operator: 'equals', value: '${user.id}' }]
  },
  { 
    resource: 'classes', 
    action: 'delete',
    conditions: [{ field: 'createdBy', operator: 'equals', value: '${user.id}' }]
  },
  { resource: 'classes', action: 'view_own' },
  { resource: 'classes', action: 'publish' },

  // Gestion des modules
  { resource: 'modules', action: 'create' },
  { resource: 'modules', action: 'read' },
  { resource: 'modules', action: 'update' },
  { resource: 'modules', action: 'delete' },
  { resource: 'modules', action: 'view_own' },
  { resource: 'modules', action: 'publish' },

  // Gestion des lectures
  { resource: 'lectures', action: 'create' },
  { resource: 'lectures', action: 'read' },
  { resource: 'lectures', action: 'update' },
  { resource: 'lectures', action: 'delete' },
  { resource: 'lectures', action: 'view' },
  { resource: 'lectures', action: 'upload' },
  { resource: 'lectures', action: 'publish' },

  // Gestion des évaluations
  { resource: 'evaluations', action: 'create' },
  { resource: 'evaluations', action: 'read' },
  { resource: 'evaluations', action: 'update' },
  { resource: 'evaluations', action: 'delete' },
  { resource: 'evaluations', action: 'grade' },
  { resource: 'evaluations', action: 'publish' },

  // Lecture et notation des soumissions
  { resource: 'submissions', action: 'read' },
  { resource: 'submissions', action: 'view_own' },
  { resource: 'submissions', action: 'grade' },

  // Lecture des paiements (limité)
  { resource: 'payments', action: 'read' },
  { resource: 'payments', action: 'view_own' },

  // Gestion des ressources
  { resource: 'resources', action: 'create' },
  { resource: 'resources', action: 'read' },
  { resource: 'resources', action: 'update' },
  { resource: 'resources', action: 'delete' },
  { resource: 'resources', action: 'upload' },
  { resource: 'resources', action: 'download' },
  { resource: 'resources', action: 'publish' },

  // Statistiques propres
  { resource: 'statistics', action: 'read' },
  { resource: 'statistics', action: 'view_own' },

  // Accès au dashboard formateur
  { resource: 'dashboard', action: 'view' },
];

/**
 * Permissions pour le rôle STUDENT
 */
const STUDENT_PERMISSIONS: Permission[] = [
  // Lecture du profil personnel uniquement
  { resource: 'users', action: 'view_own' },
  { 
    resource: 'users', 
    action: 'update',
    conditions: [{ field: 'id', operator: 'equals', value: '${user.id}' }]
  },

  // Lecture des classes auxquelles il est inscrit
  { resource: 'classes', action: 'read' },
  { resource: 'classes', action: 'view' },
  { resource: 'classes', action: 'enroll' },

  // Lecture des modules des classes inscrites
  { resource: 'modules', action: 'read' },
  { resource: 'modules', action: 'view' },

  // Accès aux lectures (selon paiement)
  { resource: 'lectures', action: 'read' },
  { resource: 'lectures', action: 'view' },
  { resource: 'lectures', action: 'download' },

  // Participation aux évaluations
  { resource: 'evaluations', action: 'read' },
  { resource: 'evaluations', action: 'view' },
  { resource: 'evaluations', action: 'submit' },

  // Gestion de ses propres soumissions
  { resource: 'submissions', action: 'create' },
  { resource: 'submissions', action: 'read' },
  { resource: 'submissions', action: 'view_own' },
  { 
    resource: 'submissions', 
    action: 'update',
    conditions: [{ field: 'personId', operator: 'equals', value: '${user.id}' }]
  },

  // Accès à ses paiements
  { resource: 'payments', action: 'read' },
  { resource: 'payments', action: 'view_own' },
  { resource: 'payments', action: 'create' },

  // Accès aux ressources publiques
  { resource: 'resources', action: 'read' },
  { resource: 'resources', action: 'view' },
  { resource: 'resources', action: 'download' },

  // Statistiques personnelles
  { resource: 'statistics', action: 'view_own' },

  // Accès au dashboard étudiant
  { resource: 'dashboard', action: 'view' },
];

/**
 * Configuration des rôles et leurs permissions
 */
export const ROLE_PERMISSIONS: Record<Role, RolePermissions> = {
  [Role.ADMIN]: {
    role: Role.ADMIN,
    permissions: ADMIN_PERMISSIONS,
  },
  [Role.FORMATEUR]: {
    role: Role.FORMATEUR,
    permissions: FORMATEUR_PERMISSIONS,
  },
  [Role.STUDENT]: {
    role: Role.STUDENT,
    permissions: STUDENT_PERMISSIONS,
  },
};

// ==============================================
// FONCTIONS DE VÉRIFICATION DES PERMISSIONS
// ==============================================

/**
 * Vérifie si un utilisateur a une permission spécifique
 */
export function hasPermission(
  user: AuthUser | null,
  resource: Resource,
  action: Action,
  context?: Record<string, any>
): boolean {
  if (!user) return false;

  const rolePermissions = ROLE_PERMISSIONS[user.role];
  if (!rolePermissions) return false;

  // Vérifier les permissions directes
  const permission = rolePermissions.permissions.find(
    p => p.resource === resource && p.action === action
  );

  if (!permission) return false;

  // Vérifier les conditions si présentes
  if (permission.conditions && permission.conditions.length > 0) {
    return evaluateConditions(permission.conditions, user, context);
  }

  return true;
}

/**
 * Vérifie si un utilisateur a l'un des rôles requis
 */
export function hasAnyRole(user: AuthUser | null, roles: Role[]): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}

/**
 * Vérifie si un utilisateur a tous les rôles requis
 */
export function hasAllRoles(user: AuthUser | null, roles: Role[]): boolean {
  if (!user) return false;
  // Pour un système à rôle unique, on vérifie juste le rôle de l'utilisateur
  return roles.length === 1 && roles[0] === user.role;
}

/**
 * Récupère toutes les permissions d'un utilisateur
 */
export function getUserPermissions(user: AuthUser | null): Permission[] {
  if (!user) return [];

  const rolePermissions = ROLE_PERMISSIONS[user.role];
  if (!rolePermissions) return [];

  return rolePermissions.permissions;
}

/**
 * Vérifie si un utilisateur peut accéder à une ressource avec n'importe quelle action
 */
export function canAccessResource(user: AuthUser | null, resource: Resource): boolean {
  if (!user) return false;

  const userPermissions = getUserPermissions(user);
  return userPermissions.some(p => p.resource === resource);
}

/**
 * Récupère les actions autorisées sur une ressource
 */
export function getAllowedActions(user: AuthUser | null, resource: Resource): Action[] {
  if (!user) return [];

  const userPermissions = getUserPermissions(user);
  return userPermissions
    .filter(p => p.resource === resource)
    .map(p => p.action);
}

// ==============================================
// FONCTIONS D'ÉVALUATION DES CONDITIONS
// ==============================================

/**
 * Évalue les conditions d'une permission
 */
function evaluateConditions(
  conditions: PermissionCondition[],
  user: AuthUser,
  context?: Record<string, any>
): boolean {
  return conditions.every(condition => evaluateCondition(condition, user, context));
}

/**
 * Évalue une condition individuelle
 */
function evaluateCondition(
  condition: PermissionCondition,
  user: AuthUser,
  context?: Record<string, any>
): boolean {
  const { field, operator, value } = condition;

  // Résoudre la valeur du champ
  let fieldValue = resolveFieldValue(field, user, context);
  let expectedValue = resolveValue(value, user, context);

  switch (operator) {
    case 'equals':
      return fieldValue === expectedValue;
    
    case 'not_equals':
      return fieldValue !== expectedValue;
    
    case 'contains':
      return Array.isArray(fieldValue) 
        ? fieldValue.includes(expectedValue)
        : String(fieldValue).includes(String(expectedValue));
    
    case 'gt':
      return Number(fieldValue) > Number(expectedValue);
    
    case 'lt':
      return Number(fieldValue) < Number(expectedValue);
    
    case 'in':
      return Array.isArray(expectedValue) && expectedValue.includes(fieldValue);
    
    case 'not_in':
      return Array.isArray(expectedValue) && !expectedValue.includes(fieldValue);
    
    default:
      return false;
  }
}

/**
 * Résout la valeur d'un champ à partir du contexte
 */
function resolveFieldValue(field: string, user: AuthUser, context?: Record<string, any>): any {
  // Champs utilisateur
  if (field.startsWith('user.')) {
    const userField = field.substring(5);
    return (user as any)[userField];
  }

  // Champs de contexte
  if (context && field in context) {
    return context[field];
  }

  return undefined;
}

/**
 * Résout une valeur avec support des templates
 */
function resolveValue(value: any, user: AuthUser, context?: Record<string, any>): any {
  if (typeof value === 'string' && value.startsWith('${')) {
    // Template de variable
    const variable = value.slice(2, -1);
    return resolveFieldValue(variable, user, context);
  }

  return value;
}

// ==============================================
// HELPERS POUR LES COMPOSANTS
// ==============================================

/**
 * Hook pour vérifier les permissions dans les composants
 */
export function usePermissionCheck() {
  return {
    hasPermission,
    hasAnyRole,
    hasAllRoles,
    canAccessResource,
    getAllowedActions,
    getUserPermissions,
  };
}

/**
 * Vérification de permission simplifiée pour l'UI
 */
export function checkUIPermission(
  user: AuthUser | null,
  resource: Resource,
  action: Action
): boolean {
  // Permissions spéciales pour l'affichage UI
  if (!user) return false;

  // L'admin peut tout voir
  if (user.role === Role.ADMIN) return true;

  // Vérifications spécifiques selon le contexte
  switch (resource) {
    case 'dashboard':
      return true; // Tous les utilisateurs connectés peuvent voir leur dashboard

    case 'classes':
      if (action === 'view' || action === 'read') {
        return user.hasPaid || (user.role as Role) === Role.FORMATEUR || (user.role as Role) === Role.ADMIN;
      }
      break;

    case 'lectures':
      if (action === 'view') {
        return user.hasPaid || (user.role as Role) === Role.FORMATEUR || (user.role as Role) === Role.ADMIN;
      }
      break;

    case 'evaluations':
      if (action === 'submit') {
        return user.hasPaid || (user.role as Role) === Role.FORMATEUR || (user.role as Role) === Role.ADMIN;
      }
      break;
  }

  return hasPermission(user, resource, action);
}

// ==============================================
// CONSTANTES UTILES
// ==============================================

/**
 * Permissions communes utilisées fréquemment
 */
export const COMMON_PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: { resource: 'dashboard' as Resource, action: 'view' as Action },
  
  // Gestion des utilisateurs
  MANAGE_USERS: { resource: 'users' as Resource, action: 'manage' as Action },
  CREATE_USER: { resource: 'users' as Resource, action: 'create' as Action },
  
  // Gestion des classes
  MANAGE_CLASSES: { resource: 'classes' as Resource, action: 'manage' as Action },
  CREATE_CLASS: { resource: 'classes' as Resource, action: 'create' as Action },
  VIEW_CLASSES: { resource: 'classes' as Resource, action: 'view' as Action },
  
  // Gestion des évaluations
  CREATE_EVALUATION: { resource: 'evaluations' as Resource, action: 'create' as Action },
  GRADE_EVALUATION: { resource: 'evaluations' as Resource, action: 'grade' as Action },
  SUBMIT_EVALUATION: { resource: 'evaluations' as Resource, action: 'submit' as Action },
  
  // Gestion des contenus
  UPLOAD_CONTENT: { resource: 'lectures' as Resource, action: 'upload' as Action },
  VIEW_CONTENT: { resource: 'lectures' as Resource, action: 'view' as Action },
  
  // Statistiques
  VIEW_STATISTICS: { resource: 'statistics' as Resource, action: 'view_all' as Action },
  VIEW_OWN_STATISTICS: { resource: 'statistics' as Resource, action: 'view_own' as Action },
} as const;

/**
 * Groupes de permissions pour des rôles spécifiques
 */
export const PERMISSION_GROUPS = {
  CONTENT_MANAGEMENT: [
    COMMON_PERMISSIONS.CREATE_CLASS,
    COMMON_PERMISSIONS.UPLOAD_CONTENT,
    COMMON_PERMISSIONS.CREATE_EVALUATION,
  ],
  
  GRADING: [
    COMMON_PERMISSIONS.GRADE_EVALUATION,
    { resource: 'submissions' as Resource, action: 'view_all' as Action },
  ],
  
  ADMINISTRATION: [
    COMMON_PERMISSIONS.MANAGE_USERS,
    COMMON_PERMISSIONS.MANAGE_CLASSES,
    COMMON_PERMISSIONS.VIEW_STATISTICS,
  ],
  
  STUDENT_BASIC: [
    COMMON_PERMISSIONS.VIEW_CLASSES,
    COMMON_PERMISSIONS.VIEW_CONTENT,
    COMMON_PERMISSIONS.SUBMIT_EVALUATION,
    COMMON_PERMISSIONS.VIEW_OWN_STATISTICS,
  ],
} as const;

/**
 * Hiérarchie des rôles (du plus bas au plus haut privilège)
 */
export const ROLE_HIERARCHY: Record<Role, number> = {
  [Role.STUDENT]: 1,
  [Role.FORMATEUR]: 2,
  [Role.ADMIN]: 3,
};

/**
 * Vérifie si un rôle a un niveau de privilège supérieur ou égal à un autre
 */
export function roleHasLevel(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Récupère le niveau de privilège d'un rôle
 */
export function getRoleLevel(role: Role): number {
  return ROLE_HIERARCHY[role] || 0;
}

// ==============================================
// FONCTIONS DE VALIDATION AVANCÉES
// ==============================================

/**
 * Vérifie si un utilisateur peut effectuer une action sur une entité spécifique
 */
export function canPerformActionOnEntity(
  user: AuthUser | null,
  resource: Resource,
  action: Action,
  entity: { createdBy?: string; ownerId?: string; personId?: string },
  additionalContext?: Record<string, any>
): boolean {
  if (!user) return false;

  // L'admin peut tout faire
  if (user.role === 'ADMIN') return true;

  // Vérifier les permissions de base
  if (!hasPermission(user, resource, action)) return false;

  // Vérifications spécifiques selon l'action
  switch (action) {
    case 'update':
    case 'delete':
      // L'utilisateur ne peut modifier/supprimer que ses propres entités
      return entity.createdBy === user.id || 
             entity.ownerId === user.id || 
             entity.personId === user.id;

    case 'view_own':
      // L'utilisateur ne peut voir que ses propres entités
      return entity.createdBy === user.id || 
             entity.ownerId === user.id || 
             entity.personId === user.id;

    case 'grade':
      // Les formateurs peuvent noter les soumissions de leurs classes
      if (user.role === 'FORMATEUR') {
        // Ici, vous devriez vérifier si l'évaluation appartient à une classe du formateur
        // Cette logique dépend de votre structure de données
        return true; // Simplifié pour l'exemple
      }
      return false;

    default:
      return true;
  }
}

/**
 * Vérifie les permissions avec des règles métier complexes
 */
export function checkAdvancedPermission(
  user: AuthUser | null,
  permission: {
    resource: Resource;
    action: Action;
    context?: Record<string, any>;
    businessRules?: Array<(user: AuthUser, context?: Record<string, any>) => boolean>;
  }
): boolean {
  if (!user) return false;

  // Vérifier les permissions de base
  if (!hasPermission(user, permission.resource, permission.action, permission.context)) {
    return false;
  }

  // Appliquer les règles métier si présentes
  if (permission.businessRules) {
    return permission.businessRules.every(rule => rule(user, permission.context));
  }

  return true;
}

// ==============================================
// RÈGLES MÉTIER PRÉDÉFINIES
// ==============================================

/**
 * Règles métier communes
 */
export const BUSINESS_RULES = {
  /**
   * Vérifie si l'utilisateur a payé ou peut contourner le paiement
   */
  requirePaymentOrBypass: (user: AuthUser): boolean => {
    return user.hasPaid || user.role === 'ADMIN' || user.role === 'FORMATEUR';
  },

  /**
   * Vérifie si l'utilisateur peut accéder aux contenus premium
   */
  canAccessPremiumContent: (user: AuthUser): boolean => {
    return BUSINESS_RULES.requirePaymentOrBypass(user);
  },

  /**
   * Vérifie si l'utilisateur peut créer du contenu
   */
  canCreateContent: (user: AuthUser): boolean => {
    return user.role === 'ADMIN' || user.role === 'FORMATEUR';
  },

  /**
   * Vérifie si l'utilisateur peut voir les statistiques globales
   */
  canViewGlobalStats: (user: AuthUser): boolean => {
    return user.role === 'ADMIN';
  },

  /**
   * Vérifie si l'utilisateur peut gérer d'autres utilisateurs
   */
  canManageOtherUsers: (user: AuthUser): boolean => {
    return user.role === 'ADMIN';
  },

  /**
   * Vérifie si l'utilisateur peut noter les soumissions
   */
  canGradeSubmissions: (user: AuthUser, context?: Record<string, any>): boolean => {
    if (user.role === 'ADMIN') return true;
    if (user.role === 'FORMATEUR') {
      // Ici, vous pourriez vérifier si le formateur a créé l'évaluation
      // ou si il est assigné à la classe
      return true; // Simplifié
    }
    return false;
  },

  /**
   * Vérifie si l'utilisateur peut accéder aux données financières
   */
  canAccessFinancialData: (user: AuthUser): boolean => {
    return user.role === 'ADMIN';
  },

  /**
   * Vérifie si l'utilisateur peut modifier les paramètres système
   */
  canModifySystemSettings: (user: AuthUser): boolean => {
    return user.role === 'ADMIN';
  },
} as const;

// ==============================================
// FONCTIONS UTILITAIRES POUR L'UI
// ==============================================

/**
 * Génère les permissions d'affichage pour les menus
 */
export function getMenuPermissions(user: AuthUser | null): {
  showAdminMenu: boolean;
  showFormateurMenu: boolean;
  showStudentMenu: boolean;
  showUserManagement: boolean;
  showStatistics: boolean;
  showSettings: boolean;
  showContent: boolean;
  showGrading: boolean;
} {
  if (!user) {
    return {
      showAdminMenu: false,
      showFormateurMenu: false,
      showStudentMenu: false,
      showUserManagement: false,
      showStatistics: false,
      showSettings: false,
      showContent: false,
      showGrading: false,
    };
  }

  const isAdmin = user.role === 'ADMIN';
  const isFormateur = user.role === 'FORMATEUR';
  const isStudent = user.role === 'STUDENT';

  return {
    showAdminMenu: isAdmin,
    showFormateurMenu: isFormateur || isAdmin,
    showStudentMenu: isStudent || isFormateur || isAdmin,
    showUserManagement: hasPermission(user, 'users', 'manage'),
    showStatistics: hasPermission(user, 'statistics', 'read'),
    showSettings: hasPermission(user, 'settings', 'read'),
    showContent: hasPermission(user, 'lectures', 'create') || hasPermission(user, 'classes', 'create'),
    showGrading: hasPermission(user, 'evaluations', 'grade'),
  };
}

/**
 * Génère les permissions d'action pour les boutons
 */
export function getActionPermissions(user: AuthUser | null, entityType: Resource): {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canView: boolean;
  canManage: boolean;
} {
  if (!user) {
    return {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canView: false,
      canManage: false,
    };
  }

  return {
    canCreate: hasPermission(user, entityType, 'create'),
    canEdit: hasPermission(user, entityType, 'update'),
    canDelete: hasPermission(user, entityType, 'delete'),
    canView: hasPermission(user, entityType, 'read'),
    canManage: hasPermission(user, entityType, 'manage'),
  };
}

/**
 * Filtre une liste d'entités selon les permissions de l'utilisateur
 */
export function filterEntitiesByPermission<T extends { createdBy?: string; ownerId?: string }>(
  entities: T[],
  user: AuthUser | null,
  resource: Resource,
  action: Action = 'read'
): T[] {
  if (!user) return [];

  // L'admin voit tout
  if (user.role === 'ADMIN') return entities;

  // Vérifier les permissions de base
  if (!hasPermission(user, resource, action)) return [];

  // Filtrer selon les règles de propriété
  if (action === 'view_own' || action === 'update' || action === 'delete') {
    return entities.filter(entity => 
      entity.createdBy === user.id || entity.ownerId === user.id
    );
  }

  return entities;
}

// ==============================================
// EXPORTS DES UTILITAIRES
// ==============================================

export const PermissionUtils = {
  hasPermission,
  hasAnyRole,
  hasAllRoles,
  getUserPermissions,
  canAccessResource,
  getAllowedActions,
  canPerformActionOnEntity,
  checkAdvancedPermission,
  checkUIPermission,
  roleHasLevel,
  getRoleLevel,
  getMenuPermissions,
  getActionPermissions,
  filterEntitiesByPermission,
} as const;

export const BusinessRules = BUSINESS_RULES;
export const PermissionGroups = PERMISSION_GROUPS;
export const CommonPermissions = COMMON_PERMISSIONS;