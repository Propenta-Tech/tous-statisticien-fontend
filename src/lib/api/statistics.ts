/**
 * Service pour la gestion des statistiques
 * Tous Statisticien Academy
 */

import { apiClient } from './client';
import { ApiResponse } from '@/types/api';

/**
 * Interface pour les statistiques utilisateurs globales
 */
interface GlobalUserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  usersByRole: Record<string, number>;
  usersByCountry: Record<string, number>;
  userGrowthTrend: Array<{
    date: string;
    count: number;
  }>;
}

/**
 * Interface pour les statistiques financières
 */
interface FinancialStats {
  totalRevenue: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  revenueThisYear: number;
  averageOrderValue: number;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  revenueTrend: Array<{
    date: string;
    amount: number;
    transactions: number;
  }>;
  revenueByMethod: Record<string, number>;
}

/**
 * Interface pour les statistiques pédagogiques
 */
interface EducationalStats {
  totalClasses: number;
  totalModules: number;
  totalLectures: number;
  totalEvaluations: number;
  totalSubmissions: number;
  averageCompletionRate: number;
  averageGrade: number;
  mostPopularClasses: Array<{
    id: string;
    name: string;
    enrollments: number;
    completionRate: number;
  }>;
  contentCreationTrend: Array<{
    date: string;
    classes: number;
    modules: number;
    lectures: number;
  }>;
}

/**
 * Interface pour les statistiques d'engagement
 */
interface EngagementStats {
  totalVideoViews: number;
  totalWatchTime: number;
  averageSessionDuration: number;
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  userRetentionRate: number;
  engagementTrend: Array<{
    date: string;
    activeUsers: number;
    sessionDuration: number;
    videoViews: number;
  }>;
  topPerformingContent: Array<{
    id: string;
    title: string;
    type: 'lecture' | 'module' | 'class';
    views: number;
    engagement: number;
  }>;
}

/**
 * Interface pour les statistiques personnelles d'un étudiant
 */
interface StudentPersonalStats {
  totalClasses: number;
  completedClasses: number;
  inProgressClasses: number;
  totalModules: number;
  completedModules: number;
  totalLectures: number;
  completedLectures: number;
  totalWatchTime: number;
  averageGrade: number;
  totalSubmissions: number;
  onTimeSubmissions: number;
  lateSubmissions: number;
  currentStreak: number;
  longestStreak: number;
  progressTrend: Array<{
    date: string;
    completedLectures: number;
    grade: number;
  }>;
  gradeDistribution: Record<string, number>;
}

/**
 * Interface pour les achievements d'un étudiant
 */
interface StudentAchievements {
  totalAchievements: number;
  recentAchievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    earnedAt: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  }>;
  progressToNext: Array<{
    id: string;
    title: string;
    description: string;
    progress: number;
    target: number;
  }>;
  milestones: {
    firstClass: string | null;
    firstModule: string | null;
    firstPerfectScore: string | null;
    hundredHoursWatched: string | null;
  };
}

/**
 * Service pour les statistiques
 */
export class StatisticsService {
  /**
   * Récupère les statistiques utilisateurs globales (Admin)
   * GET /api/statistics/admin/users
   */
  async getGlobalUserStatistics(): Promise<GlobalUserStats> {
    try {
      const response = await apiClient.get<GlobalUserStats>('/statistics/admin/users');
      return response.data!;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques utilisateurs:', error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques financières (Admin)
   * GET /api/statistics/admin/financial
   */
  async getFinancialStatistics(): Promise<FinancialStats> {
    try {
      const response = await apiClient.get<FinancialStats>('/statistics/admin/financial');
      return response.data!;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques financières:', error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques pédagogiques (Admin)
   * GET /api/statistics/admin/educational
   */
  async getEducationalStatistics(): Promise<EducationalStats> {
    try {
      const response = await apiClient.get<EducationalStats>('/statistics/admin/educational');
      return response.data!;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques pédagogiques:', error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques d'engagement (Admin)
   * GET /api/statistics/admin/engagement
   */
  async getEngagementStatistics(): Promise<EngagementStats> {
    try {
      const response = await apiClient.get<EngagementStats>('/statistics/admin/engagement');
      return response.data!;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques d\'engagement:', error);
      throw error;
    }
  }

  /**
   * Récupère le dashboard admin complet
   * GET /api/statistics/admin/dashboard
   */
  async getAdminDashboard(): Promise<{
    userStats: GlobalUserStats;
    financialStats: FinancialStats;
    educationalStats: EducationalStats;
    engagementStats: EngagementStats;
  }> {
    try {
      const response = await apiClient.get<{
        userStats: GlobalUserStats;
        financialStats: FinancialStats;
        educationalStats: EducationalStats;
        engagementStats: EngagementStats;
      }>('/statistics/admin/dashboard');
      return response.data!;
    } catch (error) {
      console.error('Erreur lors de la récupération du dashboard admin:', error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques personnelles d'un étudiant
   * GET /api/statistics/student/{studentId}/personal
   */
  async getStudentPersonalStatistics(studentId: string): Promise<StudentPersonalStats> {
    try {
      const response = await apiClient.get<StudentPersonalStats>(`/statistics/student/${studentId}/personal`);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la récupération des statistiques de l'étudiant ${studentId}:`, error);
      throw error;
    }
  }

  /**
   * Récupère la comparaison avec la moyenne de la classe
   * GET /api/statistics/student/{studentId}/module/{moduleId}/comparison
   */
  async getClassComparison(studentId: string, moduleId: string): Promise<{
    studentGrade: number;
    classAverage: number;
    studentRank: number;
    totalStudents: number;
    percentile: number;
    comparison: 'above' | 'below' | 'equal';
    gradeDistribution: Array<{
      range: string;
      count: number;
      percentage: number;
    }>;
  }> {
    try {
      const response = await apiClient.get<{
        studentGrade: number;
        classAverage: number;
        studentRank: number;
        totalStudents: number;
        percentile: number;
        comparison: 'above' | 'below' | 'equal';
        gradeDistribution: Array<{
          range: string;
          count: number;
          percentage: number;
        }>;
      }>(`/statistics/student/${studentId}/module/${moduleId}/comparison`);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la comparaison pour l'étudiant ${studentId}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les achievements d'un étudiant
   * GET /api/statistics/student/{studentId}/achievements
   */
  async getStudentAchievements(studentId: string): Promise<StudentAchievements> {
    try {
      const response = await apiClient.get<StudentAchievements>(`/statistics/student/${studentId}/achievements`);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la récupération des achievements de l'étudiant ${studentId}:`, error);
      throw error;
    }
  }

  /**
   * Récupère le dashboard étudiant complet
   * GET /api/statistics/student/{studentId}/dashboard
   */
  async getStudentDashboard(studentId: string): Promise<{
    personalStats: StudentPersonalStats;
    achievements: StudentAchievements;
  }> {
    try {
      const response = await apiClient.get<{
        personalStats: StudentPersonalStats;
        achievements: StudentAchievements;
      }>(`/statistics/student/${studentId}/dashboard`);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la récupération du dashboard de l'étudiant ${studentId}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques d'une classe spécifique
   * GET /api/statistics/class/{classId}
   */
  async getClassStatistics(classId: string): Promise<{
    totalStudents: number;
    activeStudents: number;
    completionRate: number;
    averageGrade: number;
    totalModules: number;
    completedModules: number;
    totalLectures: number;
    totalWatchTime: number;
    studentProgress: Array<{
      studentId: string;
      studentName: string;
      progress: number;
      grade: number;
      lastActivity: string;
    }>;
    moduleStats: Array<{
      moduleId: string;
      moduleName: string;
      completionRate: number;
      averageGrade: number;
    }>;
  }> {
    try {
      const response = await apiClient.get<{
        totalStudents: number;
        activeStudents: number;
        completionRate: number;
        averageGrade: number;
        totalModules: number;
        completedModules: number;
        totalLectures: number;
        totalWatchTime: number;
        studentProgress: Array<{
          studentId: string;
          studentName: string;
          progress: number;
          grade: number;
          lastActivity: string;
        }>;
        moduleStats: Array<{
          moduleId: string;
          moduleName: string;
          completionRate: number;
          averageGrade: number;
        }>;
      }>(`/statistics/class/${classId}`);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la récupération des statistiques de la classe ${classId}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques d'un module spécifique
   * GET /api/statistics/module/{moduleId}
   */
  async getModuleStatistics(moduleId: string): Promise<{
    totalStudents: number;
    completionRate: number;
    averageGrade: number;
    totalLectures: number;
    averageWatchTime: number;
    dropoffPoints: Array<{
      lectureId: string;
      lectureTitle: string;
      dropoffRate: number;
    }>;
    engagementData: Array<{
      lectureId: string;
      lectureTitle: string;
      views: number;
      averageWatchTime: number;
      completionRate: number;
    }>;
  }> {
    try {
      const response = await apiClient.get<{
        totalStudents: number;
        completionRate: number;
        averageGrade: number;
        totalLectures: number;
        averageWatchTime: number;
        dropoffPoints: Array<{
          lectureId: string;
          lectureTitle: string;
          dropoffRate: number;
        }>;
        engagementData: Array<{
          lectureId: string;
          lectureTitle: string;
          views: number;
          averageWatchTime: number;
          completionRate: number;
        }>;
      }>(`/statistics/module/${moduleId}`);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la récupération des statistiques du module ${moduleId}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques d'une évaluation
   * GET /api/statistics/evaluation/{evaluationId}
   */
  async getEvaluationStatistics(evaluationId: string): Promise<{
    totalSubmissions: number;
    averageScore: number;
    averageTime: number;
    passRate: number;
    distribution: Record<string, number>;
    questionAnalysis: Array<{
      questionId: string;
      question: string;
      correctAnswers: number;
      incorrectAnswers: number;
      averageScore: number;
      difficulty: 'easy' | 'medium' | 'hard';
    }>;
    topPerformers: Array<{
      studentId: string;
      studentName: string;
      score: number;
      percentage: number;
      timeSpent: number;
    }>;
  }> {
    try {
      const response = await apiClient.get<{
        totalSubmissions: number;
        averageScore: number;
        averageTime: number;
        passRate: number;
        distribution: Record<string, number>;
        questionAnalysis: Array<{
          questionId: string;
          question: string;
          correctAnswers: number;
          incorrectAnswers: number;
          averageScore: number;
          difficulty: 'easy' | 'medium' | 'hard';
        }>;
        topPerformers: Array<{
          studentId: string;
          studentName: string;
          score: number;
          percentage: number;
          timeSpent: number;
        }>;
      }>(`/statistics/evaluation/${evaluationId}`);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la récupération des statistiques de l'évaluation ${evaluationId}:`, error);
      throw error;
    }
  }

  /**
   * Génère un rapport personnalisé
   * POST /api/statistics/reports/generate
   */
  async generateCustomReport(data: {
    reportType: 'user' | 'financial' | 'educational' | 'engagement';
    dateFrom: string;
    dateTo: string;
    filters?: Record<string, unknown>;
    format: 'json' | 'csv' | 'pdf';
  }): Promise<Blob | Record<string, unknown>> {
    try {
      if (data.format === 'json') {
        const response = await apiClient.post<Record<string, unknown>>('/statistics/reports/generate', data);
        return response.data!;
      } else {
        const response = await fetch(`${apiClient['baseUrl']}/statistics/reports/generate`, {
          method: 'POST',
          headers: apiClient['prepareHeaders'](),
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        return await response.blob();
      }
    } catch (error) {
      console.error('Erreur lors de la génération du rapport personnalisé:', error);
      throw error;
    }
  }

  /**
   * Récupère les tendances de performance
   * GET /api/statistics/trends
   */
  async getPerformanceTrends(filters?: {
    dateFrom?: string;
    dateTo?: string;
    classId?: string;
    moduleId?: string;
  }): Promise<{
    enrollmentTrend: Array<{
      date: string;
      enrollments: number;
    }>;
    completionTrend: Array<{
      date: string;
      completions: number;
      completionRate: number;
    }>;
    gradeTrend: Array<{
      date: string;
      averageGrade: number;
      submissions: number;
    }>;
    engagementTrend: Array<{
      date: string;
      activeUsers: number;
      totalSessions: number;
      averageSessionDuration: number;
    }>;
  }> {
    try {
      const params: Record<string, string> = {};
      if (filters?.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters?.dateTo) params.dateTo = filters.dateTo;
      if (filters?.classId) params.classId = filters.classId;
      if (filters?.moduleId) params.moduleId = filters.moduleId;

      const response = await apiClient.get<{
        enrollmentTrend: Array<{
          date: string;
          enrollments: number;
        }>;
        completionTrend: Array<{
          date: string;
          completions: number;
          completionRate: number;
        }>;
        gradeTrend: Array<{
          date: string;
          averageGrade: number;
          submissions: number;
        }>;
        engagementTrend: Array<{
          date: string;
          activeUsers: number;
          totalSessions: number;
          averageSessionDuration: number;
        }>;
      }>('/statistics/trends', params);
      return response.data!;
    } catch (error) {
      console.error('Erreur lors de la récupération des tendances de performance:', error);
      throw error;
    }
  }

  /**
   * Récupère les métriques en temps réel
   * GET /api/statistics/realtime
   */
  async getRealtimeMetrics(): Promise<{
    currentOnlineUsers: number;
    todayNewRegistrations: number;
    todayCompletions: number;
    todayRevenue: number;
    activeStreams: number;
    systemHealth: {
      status: 'healthy' | 'warning' | 'critical';
      uptime: number;
      responseTime: number;
      errorRate: number;
    };
  }> {
    try {
      const response = await apiClient.get<{
        currentOnlineUsers: number;
        todayNewRegistrations: number;
        todayCompletions: number;
        todayRevenue: number;
        activeStreams: number;
        systemHealth: {
          status: 'healthy' | 'warning' | 'critical';
          uptime: number;
          responseTime: number;
          errorRate: number;
        };
      }>('/statistics/realtime');
      return response.data!;
    } catch (error) {
      console.error('Erreur lors de la récupération des métriques en temps réel:', error);
      throw error;
    }
  }
}

/**
 * Instance par défaut du service des statistiques
 */
export const statisticsService = new StatisticsService();

/**
 * Helper pour formater les pourcentages
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Helper pour formater les durées en secondes
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
};

/**
 * Helper pour formater les nombres avec séparateurs
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('fr-FR').format(value);
};

/**
 * Helper pour calculer la croissance en pourcentage
 */
export const calculateGrowthRate = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Helper pour obtenir la couleur d'une métrique selon sa performance
 */
export const getMetricColor = (value: number, benchmarks: {
  excellent: number;
  good: number;
  poor: number;
}): string => {
  if (value >= benchmarks.excellent) return 'green';
  if (value >= benchmarks.good) return 'blue';
  if (value >= benchmarks.poor) return 'yellow';
  return 'red';
};

/**
 * Helper pour générer des labels de dates pour les graphiques
 */
export const generateDateLabels = (startDate: string, endDate: string, interval: 'day' | 'week' | 'month'): string[] => {
  const labels: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const current = new Date(start);

  while (current <= end) {
    labels.push(current.toISOString().split('T')[0]);
    
    switch (interval) {
      case 'day':
        current.setDate(current.getDate() + 1);
        break;
      case 'week':
        current.setDate(current.getDate() + 7);
        break;
      case 'month':
        current.setMonth(current.getMonth() + 1);
        break;
    }
  }

  return labels;
};

/**
 * Helper pour calculer la médiane d'un tableau de nombres
 */
export const calculateMedian = (numbers: number[]): number => {
  const sorted = [...numbers].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  
  return sorted[middle];
};