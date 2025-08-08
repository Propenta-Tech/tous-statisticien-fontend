// ==============================================
// TYPES DATABASE - TOUS STATISTICIEN ACADEMY
// ==============================================
// Types pour les schémas de base de données et les opérations CRUD

import {
  Person,
  VirtualClass,
  Module,
  Lecture,
  Evaluation,
  Submission,
  Payment,
  Resource,
  UserStatistic,
  VirtualClassUser,
  Role,
  PaymentStatus,
  LectureType,
  EvaluationType,
  ResourceType
} from './index';

// ==============================================
// TYPES DE BASE POUR LES ENTITÉS DATABASE
// ==============================================

// Interface de base pour toutes les entités avec ID UUID
export interface DatabaseEntity {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Interface pour les entités avec audit (créateur/modificateur)
export interface AuditableEntity extends DatabaseEntity {
  createdById?: string;
  updatedById?: string;
}

// ==============================================
// SCHÉMAS DATABASE (mapping exact avec les entités Java)
// ==============================================

// Table "person"
export interface PersonSchema extends DatabaseEntity {
  lastName: string;
  firstName: string;
  email: string;
  password: string;
  role: Role;
  hasPaid: boolean;
  phone?: string;
  country?: string;
  lastLogin?: Date | string;
}

// Table "virtual_class"
export interface VirtualClassSchema extends AuditableEntity {
  name: string;
  level: string;
  description: string;
}

// Table "module"
export interface ModuleSchema extends AuditableEntity {
  title: string;
  classId: string; // FK vers virtual_class
  order: number; // order_number dans la DB
}

// Table "lecture"
export interface LectureSchema extends AuditableEntity {
  title: string;
  type: LectureType;
  url: string; // max 500 chars
  moduleId: string; // FK vers module
}

// Table "evaluation"
export interface EvaluationSchema extends AuditableEntity {
  title: string;
  moduleId: string; // FK vers module
  type: EvaluationType;
  startDate: Date | string;
  endDate: Date | string;
}

// Table "submission"
export interface SubmissionSchema extends DatabaseEntity {
  evaluationId: string; // FK vers evaluation
  personId: string; // FK vers person
  fileUrl: string;
  grade: number; // float
  feedback?: string;
  updatedById?: string; // FK vers person (correcteur)
}

// Table "payment"
export interface PaymentSchema extends DatabaseEntity {
  personId: string; // FK vers person
  amount: number; // decimal(10,2)
  status: PaymentStatus;
}

// Table "resource"
export interface ResourceSchema extends AuditableEntity {
  title: string;
  type: ResourceType;
  fileUrl: string;
  description?: string;
}

// Table "user_statistic"
export interface UserStatisticSchema {
  id: string;
  personId: string; // FK vers person
  moduleId: string; // FK vers module
  progression: number; // float
  averageGrade: number; // float
}

// Table "virtual_class_user"
export interface VirtualClassUserSchema extends DatabaseEntity {
  personId: string; // FK vers person
  virtualClassId: string; // FK vers virtual_class
}

// ==============================================
// TYPES POUR LES RELATIONS DATABASE
// ==============================================

// Relation Person avec ses entités liées
export interface PersonWithRelations extends PersonSchema {
  createdClasses?: VirtualClassSchema[];
  payments?: PaymentSchema[];
  submissions?: SubmissionSchema[];
  statistics?: UserStatisticSchema[];
  virtualClassUsers?: VirtualClassUserSchema[];
}

// Relation VirtualClass avec ses modules
export interface VirtualClassWithModules extends VirtualClassSchema {
  modules?: ModuleWithLectures[];
  virtualClassUsers?: VirtualClassUserSchema[];
  studentsCount?: number;
}

// Relation Module avec lectures et évaluations
export interface ModuleWithLectures extends ModuleSchema {
  lectures?: LectureSchema[];
  evaluations?: EvaluationWithSubmissions[];
  userStatistics?: UserStatisticSchema[];
}

// Relation Evaluation avec soumissions
export interface EvaluationWithSubmissions extends EvaluationSchema {
  submissions?: SubmissionWithPerson[];
  submissionsCount?: number;
}

// Relation Submission avec Person
export interface SubmissionWithPerson extends SubmissionSchema {
  person?: PersonSchema;
  evaluation?: EvaluationSchema;
}

// ==============================================
// TYPES POUR LES REQUÊTES DATABASE
// ==============================================

// Types pour les opérations CREATE (sans ID et timestamps)
export type CreatePersonData = Omit<PersonSchema, 'id' | 'createdAt' | 'updatedAt' | 'lastLogin'>;
export type CreateVirtualClassData = Omit<VirtualClassSchema, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateModuleData = Omit<ModuleSchema, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateLectureData = Omit<LectureSchema, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateEvaluationData = Omit<EvaluationSchema, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateSubmissionData = Omit<SubmissionSchema, 'id' | 'createdAt' | 'updatedAt'>;
export type CreatePaymentData = Omit<PaymentSchema, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateResourceData = Omit<ResourceSchema, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateUserStatisticData = Omit<UserStatisticSchema, 'id'>;
export type CreateVirtualClassUserData = Omit<VirtualClassUserSchema, 'id' | 'createdAt' | 'updatedAt'>;

// Types pour les opérations UPDATE (ID requis, autres champs optionnels)
export type UpdatePersonData = { id: string } & Partial<Omit<PersonSchema, 'id' | 'createdAt' | 'updatedAt'>>;
export type UpdateVirtualClassData = { id: string } & Partial<Omit<VirtualClassSchema, 'id' | 'createdAt' | 'updatedAt'>>;
export type UpdateModuleData = { id: string } & Partial<Omit<ModuleSchema, 'id' | 'createdAt' | 'updatedAt'>>;
export type UpdateLectureData = { id: string } & Partial<Omit<LectureSchema, 'id' | 'createdAt' | 'updatedAt'>>;
export type UpdateEvaluationData = { id: string } & Partial<Omit<EvaluationSchema, 'id' | 'createdAt' | 'updatedAt'>>;
export type UpdateSubmissionData = { id: string } & Partial<Omit<SubmissionSchema, 'id' | 'createdAt' | 'updatedAt'>>;
export type UpdatePaymentData = { id: string } & Partial<Omit<PaymentSchema, 'id' | 'createdAt' | 'updatedAt'>>;
export type UpdateResourceData = { id: string } & Partial<Omit<ResourceSchema, 'id' | 'createdAt' | 'updatedAt'>>;
export type UpdateUserStatisticData = { id: string } & Partial<Omit<UserStatisticSchema, 'id'>>;

// ==============================================
// TYPES POUR LES REQUÊTES AVEC FILTRES
// ==============================================

// Base pour toutes les requêtes avec filtres
export interface DatabaseQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// Filtres spécifiques par entité
export interface PersonQuery extends DatabaseQuery {
  role?: Role;
  hasPaid?: boolean;
  country?: string;
  search?: string; // recherche dans firstName, lastName, email
  createdAfter?: Date | string;
  lastLoginAfter?: Date | string;
}

export interface VirtualClassQuery extends DatabaseQuery {
  level?: string;
  search?: string; // recherche dans name, description
  createdBy?: string;
  hasStudents?: boolean;
}

export interface ModuleQuery extends DatabaseQuery {
  classId?: string;
  search?: string; // recherche dans title
  createdBy?: string;
  orderMin?: number;
  orderMax?: number;
}

export interface LectureQuery extends DatabaseQuery {
  moduleId?: string;
  type?: LectureType;
  search?: string; // recherche dans title
  createdBy?: string;
}

export interface EvaluationQuery extends DatabaseQuery {
  moduleId?: string;
  type?: EvaluationType;
  search?: string; // recherche dans title
  startDateAfter?: Date | string;
  endDateBefore?: Date | string;
  isActive?: boolean; // entre startDate et endDate
  createdBy?: string;
}

export interface SubmissionQuery extends DatabaseQuery {
  evaluationId?: string;
  personId?: string;
  hasGrade?: boolean;
  gradeMin?: number;
  gradeMax?: number;
  submittedAfter?: Date | string;
}

export interface PaymentQuery extends DatabaseQuery {
  personId?: string;
  status?: PaymentStatus;
  amountMin?: number;
  amountMax?: number;
  createdAfter?: Date | string;
}

export interface ResourceQuery extends DatabaseQuery {
  type?: ResourceType;
  search?: string; // recherche dans title, description
  createdBy?: string;
}

// ==============================================
// TYPES POUR LES RÉPONSES DATABASE
// ==============================================

// Réponse paginée générique
export interface DatabasePaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Résultat d'opération CRUD
export interface DatabaseOperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  affectedRows?: number;
}

// ==============================================
// TYPES POUR LES AGRÉGATIONS ET STATISTIQUES
// ==============================================

// Agrégations par rôle
export interface UsersByRoleAggregation {
  role: Role;
  count: number;
}

// Agrégations par statut de paiement
export interface PaymentsByStatusAggregation {
  status: PaymentStatus;
  count: number;
  totalAmount: number;
}

// Statistiques de soumission par évaluation
export interface SubmissionStatsByEvaluation {
  evaluationId: string;
  evaluationTitle: string;
  totalSubmissions: number;
  averageGrade: number;
  maxGrade: number;
  minGrade: number;
}

// Statistiques de progression par module
export interface ProgressionStatsByModule {
  moduleId: string;
  moduleTitle: string;
  studentsCount: number;
  averageProgression: number;
  completedCount: number; // progression = 100%
}

// ==============================================
// TYPES POUR LES TRANSACTIONS
// ==============================================

export interface DatabaseTransaction {
  id: string;
  operations: DatabaseOperation[];
  status: 'pending' | 'committed' | 'rolled_back';
  createdAt: Date;
  completedAt?: Date;
}

export interface DatabaseOperation {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  data: any;
  conditions?: Record<string, any>;
}

// ==============================================
// TYPES POUR LES INDEX ET CONTRAINTES
// ==============================================

// Définition des index pour optimisation des requêtes
export interface DatabaseIndex {
  name: string;
  table: string;
  columns: string[];
  unique?: boolean;
  type?: 'btree' | 'hash' | 'gin' | 'gist';
}

// Contraintes de clés étrangères
export interface ForeignKeyConstraint {
  name: string;
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT';
  onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT';
}

// ==============================================
// TYPES POUR LA MIGRATION ET LE SCHÉMA
// ==============================================

export interface DatabaseMigration {
  version: string;
  name: string;
  up: string[]; // SQL statements
  down: string[]; // SQL statements for rollback
  createdAt: Date;
  appliedAt?: Date;
}

export interface TableSchema {
  name: string;
  columns: ColumnDefinition[];
  indexes: DatabaseIndex[];
  constraints: ForeignKeyConstraint[];
}

export interface ColumnDefinition {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue?: any;
  isPrimaryKey?: boolean;
  isUnique?: boolean;
  length?: number;
  precision?: number;
  scale?: number;
}

// ==============================================
// TYPES POUR LES VUES ET PROCÉDURES
// ==============================================

// Vue pour les statistiques utilisateur enrichies
export interface UserStatsView {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  totalClasses: number;
  completedModules: number;
  totalSubmissions: number;
  averageGrade: number;
  lastActivity: Date | string;
}

// Vue pour les classes avec statistiques
export interface ClassStatsView {
  classId: string;
  className: string;
  level: string;
  modulesCount: number;
  studentsCount: number;
  completionRate: number;
  averageGrade: number;
  createdAt: Date | string;
}

// ==============================================
// CONSTANTES DATABASE
// ==============================================

export const DATABASE_TABLES = {
  PERSON: 'person',
  VIRTUAL_CLASS: 'virtual_class',
  MODULE: 'module',
  LECTURE: 'lecture',
  EVALUATION: 'evaluation',
  SUBMISSION: 'submission',
  PAYMENT: 'payment',
  RESOURCE: 'resource',
  USER_STATISTIC: 'user_statistic',
  VIRTUAL_CLASS_USER: 'virtual_class_user',
} as const;

export const DATABASE_CONSTRAINTS = {
  FK_MODULE_CLASS: 'fk_module_virtual_class',
  FK_LECTURE_MODULE: 'fk_lecture_module',
  FK_EVALUATION_MODULE: 'fk_evaluation_module',
  FK_SUBMISSION_EVALUATION: 'fk_submission_evaluation',
  FK_SUBMISSION_PERSON: 'fk_submission_person',
  FK_PAYMENT_PERSON: 'fk_payment_person',
  FK_USER_STATISTIC_PERSON: 'fk_user_statistic_person',
  FK_USER_STATISTIC_MODULE: 'fk_user_statistic_module',
  FK_VIRTUAL_CLASS_USER_PERSON: 'fk_virtual_class_user_person',
  FK_VIRTUAL_CLASS_USER_CLASS: 'fk_virtual_class_user_virtual_class',
} as const;

// ==============================================
// TYPES UTILITAIRES POUR LE DATABASE
// ==============================================

// Type pour mapper les entités Java vers les types TypeScript
export type EntityToSchema<T> = T extends Person ? PersonSchema
  : T extends VirtualClass ? VirtualClassSchema
  : T extends Module ? ModuleSchema
  : T extends Lecture ? LectureSchema
  : T extends Evaluation ? EvaluationSchema
  : T extends Submission ? SubmissionSchema
  : T extends Payment ? PaymentSchema
  : T extends Resource ? ResourceSchema
  : T extends UserStatistic ? UserStatisticSchema
  : T extends VirtualClassUser ? VirtualClassUserSchema
  : never;

// Type pour les clés étrangères
export type ForeignKeys<T> = {
  [K in keyof T]: T[K] extends string ? K extends `${string}Id` ? K : never : never;
}[keyof T];

// Type pour les champs obligatoires dans une entité
export type RequiredFields<T> = {
  [K in keyof T]-?: T[K] extends undefined ? never : K;
}[keyof T];

// Type pour les champs optionnels dans une entité
export type OptionalFields<T> = {
  [K in keyof T]-?: T[K] extends undefined ? K : never;
}[keyof T];