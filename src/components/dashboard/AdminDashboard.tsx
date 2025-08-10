"use client"
import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { ProgressWidget } from '@/components/dashboard/ProgressWidget';
import { NotificationPanel } from '@/components/dashboard/NotificationPanel';
import { AreaChart } from '@/components/charts/AreaChart';
import { BarChart } from '@/components/charts/BarChart';
import { LineChart } from '@/components/charts/LineChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { PieChart } from '@/components/charts/PieChart';
import { ProgressChart } from '@/components/charts/ProgressChart';
import { MetricCard } from '@/components/charts/MetricCard';
import { statisticsService } from '@/lib/api/statistics';
import { useAuth } from '@/lib/auth/context';
import { Loader2, Users, DollarSign, BookOpen, TrendingUp, Eye, Clock, Award } from 'lucide-react';
import { toast } from 'sonner';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await statisticsService.getAdminDashboard();
        setDashboardData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch dashboard data');
        toast.error('Erreur de chargement', {
          description: err.message || 'Impossible de charger les données du tableau de bord.',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary-navy" />
        <p className="ml-3 text-primary-navy">Chargement du tableau de bord...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg text-red-800">
        <h3 className="font-bold text-lg">Erreur de chargement</h3>
        <p>{error}</p>
      </div>
    );
  }

  // Données pour les charts
  const userGrowthData = dashboardData?.userStats?.userGrowthTrend?.map((item: any) => ({
    name: item.date,
    'Nouveaux utilisateurs': item.count,
  })) || [];

  const revenueTrendData = dashboardData?.financialStats?.revenueTrend?.map((item: any) => ({
    name: item.date,
    'Revenus': item.amount,
  })) || [];

  const engagementData = dashboardData?.engagementStats?.engagementTrend?.map((item: any) => ({
    name: item.date,
    'Temps moyen': item.avgTime,
    'Pages vues': item.pageViews,
  })) || [];

  // Données pour DonutChart - Répartition des utilisateurs par rôle
  const userRoleData = [
    { name: 'Étudiants', value: dashboardData?.userStats?.studentsCount || 0, color: '#1e293b' },
    { name: 'Formateurs', value: dashboardData?.userStats?.formateursCount || 0, color: '#fbbf24' },
    { name: 'Admins', value: dashboardData?.userStats?.adminsCount || 0, color: '#10b981' },
  ];

  // Données pour PieChart - Répartition des paiements
  const paymentStatusData = [
    { name: 'Payés', value: dashboardData?.financialStats?.paidPayments || 0, color: '#10b981' },
    { name: 'En attente', value: dashboardData?.financialStats?.pendingPayments || 0, color: '#fbbf24' },
    { name: 'Échoués', value: dashboardData?.financialStats?.failedPayments || 0, color: '#ef4444' },
  ];

  // Données pour ProgressChart - Progression des modules
  const moduleProgressData = [
    {
      label: 'Modules complétés',
      value: dashboardData?.educationalStats?.completedModules || 0,
      maxValue: dashboardData?.educationalStats?.totalModules || 1,
      description: 'Modules terminés par les étudiants',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      label: 'Taux de réussite',
      value: Math.round((dashboardData?.educationalStats?.averageCompletionRate || 0) * 100),
      maxValue: 100,
      description: 'Pourcentage de réussite global',
      icon: <Award className="w-4 h-4" />,
    },
    {
      label: 'Temps d\'engagement',
      value: Math.round((dashboardData?.engagementStats?.averageSessionTime || 0) / 60),
      maxValue: 120, // 2 heures max
      description: 'Temps moyen de session (minutes)',
      icon: <Clock className="w-4 h-4" />,
    },
  ];

  // Métriques détaillées
  const detailedMetrics = [
    {
      title: 'Nouveaux utilisateurs',
      value: dashboardData?.userStats?.newUsersThisMonth || 0,
      description: 'Ce mois',
      icon: <Users className="w-5 h-5" />,
      trend: {
        value: dashboardData?.userStats?.userGrowthRate || 0,
        isPositive: (dashboardData?.userStats?.userGrowthRate || 0) > 0,
        period: 'vs mois dernier',
      },
      color: 'success' as const,
    },
    {
      title: 'Revenus mensuels',
      value: `${dashboardData?.financialStats?.monthlyRevenue || 0}€`,
      description: 'Ce mois',
      icon: <DollarSign className="w-5 h-5" />,
      trend: {
        value: dashboardData?.financialStats?.revenueGrowthRate || 0,
        isPositive: (dashboardData?.financialStats?.revenueGrowthRate || 0) > 0,
        period: 'vs mois dernier',
      },
      color: 'warning' as const,
    },
    {
      title: 'Taux d\'engagement',
      value: `${Math.round((dashboardData?.engagementStats?.engagementRate || 0) * 100)}%`,
      description: 'Utilisateurs actifs',
      icon: <Eye className="w-5 h-5" />,
      trend: {
        value: dashboardData?.engagementStats?.engagementGrowthRate || 0,
        isPositive: (dashboardData?.engagementStats?.engagementGrowthRate || 0) > 0,
        period: 'vs semaine dernière',
      },
      color: 'info' as const,
    },
    {
      title: 'Temps moyen',
      value: `${Math.round((dashboardData?.engagementStats?.averageSessionTime || 0) / 60)}min`,
      description: 'Par session',
      icon: <Clock className="w-5 h-5" />,
      trend: {
        value: dashboardData?.engagementStats?.sessionTimeGrowthRate || 0,
        isPositive: (dashboardData?.engagementStats?.sessionTimeGrowthRate || 0) > 0,
        period: 'vs semaine dernière',
      },
      color: 'primary' as const,
    },
  ];

  // Stats pour StatsOverview
  const statsData = {
    users: dashboardData?.userStats?.totalUsers || 0,
    classes: dashboardData?.educationalStats?.totalClasses || 0,
    lectures: dashboardData?.educationalStats?.totalLectures || 0,
    revenue: `${dashboardData?.financialStats?.totalRevenue || 0}€`,
  };

  return (
    <>
      <PageHeader
        title={`Bienvenue, ${user?.firstName || 'Admin'}!`}
        description="Aperçu de l'activité et des statistiques de la plateforme."
      />

      <Section dense className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsOverview stats={statsData} />
      </Section>

      <Section title="Métriques Détaillées" dense className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {detailedMetrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            description={metric.description}
            icon={metric.icon}
            trend={metric.trend}
            color={metric.color}
            size="md"
          />
        ))}
      </Section>

      <Section title="Tendances et Activités" dense className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Section variant="card" title="Évolution des revenus" description="Revenus générés sur les 30 derniers jours.">
            <AreaChart
              data={revenueTrendData}
              xKey="name"
              series={[{ key: 'Revenus', name: 'Revenus', color: '#fbbf24' }]}
            />
          </Section>
        </div>
        <Section variant="card" title="Activités Récentes" description="Dernières actions sur la plateforme.">
          <RecentActivity />
        </Section>
      </Section>

      <Section title="Statistiques Détaillées" dense className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section variant="card" title="Croissance des Utilisateurs" description="Nouveaux inscrits par période.">
          <BarChart
            data={userGrowthData}
            xKey="name"
            series={[{ key: 'Nouveaux utilisateurs', name: 'Nouveaux utilisateurs', color: '#1e293b' }]}
          />
        </Section>
        <Section variant="card" title="Engagement des Utilisateurs" description="Temps moyen et pages vues.">
          <LineChart
            data={engagementData}
            xKey="name"
            series={[
              { key: 'Temps moyen', name: 'Temps moyen (min)', color: '#1e293b' },
              { key: 'Pages vues', name: 'Pages vues', color: '#fbbf24' },
            ]}
          />
        </Section>
      </Section>

      <Section title="Répartition et Progression" dense className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Section variant="card" title="Répartition des Utilisateurs" description="Par type de compte.">
          <DonutChart
            data={userRoleData}
            height={250}
            showLegend={true}
            showTooltip={true}
          />
        </Section>
        <Section variant="card" title="Statut des Paiements" description="Répartition des transactions.">
          <PieChart
            data={paymentStatusData}
            height={250}
            showLegend={true}
            showTooltip={true}
          />
        </Section>
        <Section variant="card" title="Progression Globale" description="Indicateurs de performance.">
          <ProgressChart
            data={moduleProgressData}
            showPercentages={true}
            showValues={true}
            animate={true}
            size="md"
          />
        </Section>
      </Section>

      <Section title="Actions Rapides et Notifications" dense className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section variant="card" title="Actions Rapides" description="Accès rapide aux tâches courantes.">
          <QuickActions />
        </Section>
        <Section variant="card" title="Notifications" description="Messages importants et alertes.">
          <NotificationPanel />
        </Section>
      </Section>
    </>
  );
};

