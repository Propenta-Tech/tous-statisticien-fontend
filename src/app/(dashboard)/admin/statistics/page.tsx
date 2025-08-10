"use client"
import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import { AreaChart } from '@/components/charts/AreaChart';
import { BarChart } from '@/components/charts/BarChart';
import { LineChart } from '@/components/charts/LineChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { PieChart } from '@/components/charts/PieChart';
import { ProgressChart } from '@/components/charts/ProgressChart';
import { MetricCard } from '@/components/charts/MetricCard';
import { statisticsService } from '@/lib/api/statistics';
import { AdminGuard } from '@/lib/auth/guards';
import { Loader2, Users, DollarSign, BookOpen, TrendingUp, Eye, Clock, Award, Calendar, Target } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminStatisticsPage() {
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        setLoading(true);
        const data = await statisticsService.getAdminDashboard();
        setStatsData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch statistics data');
        toast.error('Erreur de chargement', {
          description: err.message || 'Impossible de charger les statistiques.',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStatsData();
  }, []);

  if (loading) {
    return (
      <AdminGuard>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 animate-spin text-primary-navy" />
          <p className="ml-3 text-primary-navy">Chargement des statistiques...</p>
        </div>
      </AdminGuard>
    );
  }

  if (error) {
    return (
      <AdminGuard>
        <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <h3 className="font-bold text-lg">Erreur de chargement</h3>
          <p>{error}</p>
        </div>
      </AdminGuard>
    );
  }

  // Données pour les charts
  const userGrowthData = statsData?.userStats?.userGrowthTrend?.map((item: any) => ({
    name: item.date,
    'Nouveaux utilisateurs': item.count,
  })) || [];

  const revenueTrendData = statsData?.financialStats?.revenueTrend?.map((item: any) => ({
    name: item.date,
    'Revenus': item.amount,
  })) || [];

  const engagementData = statsData?.engagementStats?.engagementTrend?.map((item: any) => ({
    name: item.date,
    'Temps moyen': item.avgTime,
    'Pages vues': item.pageViews,
  })) || [];

  // Données pour DonutChart - Répartition des utilisateurs par rôle
  const userRoleData = [
    { name: 'Étudiants', value: statsData?.userStats?.studentsCount || 0, color: '#1e293b' },
    { name: 'Formateurs', value: statsData?.userStats?.formateursCount || 0, color: '#fbbf24' },
    { name: 'Admins', value: statsData?.userStats?.adminsCount || 0, color: '#10b981' },
  ];

  // Données pour PieChart - Répartition des paiements
  const paymentStatusData = [
    { name: 'Payés', value: statsData?.financialStats?.paidPayments || 0, color: '#10b981' },
    { name: 'En attente', value: statsData?.financialStats?.pendingPayments || 0, color: '#fbbf24' },
    { name: 'Échoués', value: statsData?.financialStats?.failedPayments || 0, color: '#ef4444' },
  ];

  // Données pour ProgressChart - Progression des modules
  const moduleProgressData = [
    {
      label: 'Modules complétés',
      value: statsData?.educationalStats?.completedModules || 0,
      maxValue: statsData?.educationalStats?.totalModules || 1,
      description: 'Modules terminés par les étudiants',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      label: 'Taux de réussite',
      value: Math.round((statsData?.educationalStats?.averageCompletionRate || 0) * 100),
      maxValue: 100,
      description: 'Pourcentage de réussite global',
      icon: <Award className="w-4 h-4" />,
    },
    {
      label: 'Temps d\'engagement',
      value: Math.round((statsData?.engagementStats?.averageSessionTime || 0) / 60),
      maxValue: 120, // 2 heures max
      description: 'Temps moyen de session (minutes)',
      icon: <Clock className="w-4 h-4" />,
    },
  ];

  // Métriques détaillées
  const detailedMetrics = [
    {
      title: 'Nouveaux utilisateurs',
      value: statsData?.userStats?.newUsersThisMonth || 0,
      description: 'Ce mois',
      icon: <Users className="w-5 h-5" />,
      trend: {
        value: statsData?.userStats?.userGrowthRate || 0,
        isPositive: (statsData?.userStats?.userGrowthRate || 0) > 0,
        period: 'vs mois dernier',
      },
      color: 'success' as const,
    },
    {
      title: 'Revenus mensuels',
      value: `${statsData?.financialStats?.monthlyRevenue || 0}€`,
      description: 'Ce mois',
      icon: <DollarSign className="w-5 h-5" />,
      trend: {
        value: statsData?.financialStats?.revenueGrowthRate || 0,
        isPositive: (statsData?.financialStats?.revenueGrowthRate || 0) > 0,
        period: 'vs mois dernier',
      },
      color: 'warning' as const,
    },
    {
      title: 'Taux d\'engagement',
      value: `${Math.round((statsData?.engagementStats?.engagementRate || 0) * 100)}%`,
      description: 'Utilisateurs actifs',
      icon: <Eye className="w-5 h-5" />,
      trend: {
        value: statsData?.engagementStats?.engagementGrowthRate || 0,
        isPositive: (statsData?.engagementStats?.engagementGrowthRate || 0) > 0,
        period: 'vs semaine dernière',
      },
      color: 'info' as const,
    },
    {
      title: 'Temps moyen',
      value: `${Math.round((statsData?.engagementStats?.averageSessionTime || 0) / 60)}min`,
      description: 'Par session',
      icon: <Clock className="w-5 h-5" />,
      trend: {
        value: statsData?.engagementStats?.sessionTimeGrowthRate || 0,
        isPositive: (statsData?.engagementStats?.sessionTimeGrowthRate || 0) > 0,
        period: 'vs semaine dernière',
      },
      color: 'primary' as const,
    },
  ];

  return (
    <AdminGuard>
      <PageHeader
        title="Statistiques Détaillées"
        description="Analyse complète des performances et de l'activité de la plateforme."
      />

      <Section dense className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <Section title="Tendances Temporelles" dense className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section variant="card" title="Évolution des Revenus" description="Revenus générés sur les 30 derniers jours.">
          <AreaChart
            data={revenueTrendData}
            xKey="name"
            series={[{ key: 'Revenus', name: 'Revenus', color: '#fbbf24' }]}
          />
        </Section>
        <Section variant="card" title="Croissance des Utilisateurs" description="Nouveaux inscrits par période.">
          <BarChart
            data={userGrowthData}
            xKey="name"
            series={[{ key: 'Nouveaux utilisateurs', name: 'Nouveaux utilisateurs', color: '#1e293b' }]}
          />
        </Section>
      </Section>

      <Section title="Engagement et Performance" dense className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

      <Section title="Répartitions et Distributions" dense className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section variant="card" title="Répartition des Utilisateurs" description="Par type de compte.">
          <DonutChart
            data={userRoleData}
            height={300}
            showLegend={true}
            showTooltip={true}
          />
        </Section>
        <Section variant="card" title="Statut des Paiements" description="Répartition des transactions.">
          <PieChart
            data={paymentStatusData}
            height={300}
            showLegend={true}
            showTooltip={true}
          />
        </Section>
      </Section>

      <Section title="Analyses Avancées" dense className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Section variant="card" title="Performance par Mois" description="Comparaison mensuelle.">
          <BarChart
            data={[
              { name: 'Jan', 'Utilisateurs': 120, 'Revenus': 1500 },
              { name: 'Fév', 'Utilisateurs': 180, 'Revenus': 2200 },
              { name: 'Mar', 'Utilisateurs': 220, 'Revenus': 2800 },
              { name: 'Avr', 'Utilisateurs': 280, 'Revenus': 3500 },
              { name: 'Mai', 'Utilisateurs': 320, 'Revenus': 4200 },
              { name: 'Juin', 'Utilisateurs': 380, 'Revenus': 4800 },
            ]}
            xKey="name"
            series={[
              { key: 'Utilisateurs', name: 'Utilisateurs', color: '#1e293b' },
              { key: 'Revenus', name: 'Revenus (€)', color: '#fbbf24' },
            ]}
          />
        </Section>
        <Section variant="card" title="Répartition des Classes" description="Par niveau de difficulté.">
          <DonutChart
            data={[
              { name: 'Débutant', value: 45, color: '#10b981' },
              { name: 'Intermédiaire', value: 35, color: '#fbbf24' },
              { name: 'Avancé', value: 20, color: '#ef4444' },
            ]}
            height={250}
            showLegend={true}
            showTooltip={true}
          />
        </Section>
        <Section variant="card" title="Taux de Rétention" description="Par cohorte d'utilisateurs.">
          <ProgressChart
            data={[
              {
                label: 'Cohorte 1 (Jan)',
                value: 85,
                maxValue: 100,
                description: 'Utilisateurs retenus après 30 jours',
                icon: <Users className="w-4 h-4" />,
              },
              {
                label: 'Cohorte 2 (Fév)',
                value: 78,
                maxValue: 100,
                description: 'Utilisateurs retenus après 30 jours',
                icon: <Users className="w-4 h-4" />,
              },
              {
                label: 'Cohorte 3 (Mar)',
                value: 92,
                maxValue: 100,
                description: 'Utilisateurs retenus après 30 jours',
                icon: <Users className="w-4 h-4" />,
              },
            ]}
            showPercentages={true}
            showValues={true}
            animate={true}
            size="sm"
          />
        </Section>
      </Section>
    </AdminGuard>
  );
}
