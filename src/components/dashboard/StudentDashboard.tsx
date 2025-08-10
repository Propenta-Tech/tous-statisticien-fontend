"use client"
import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { ProgressWidget } from '@/components/dashboard/ProgressWidget';
import { LineChart } from '@/components/charts/LineChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { PieChart } from '@/components/charts/PieChart';
import { ProgressChart } from '@/components/charts/ProgressChart';
import { MetricCard } from '@/components/charts/MetricCard';
import { useAuth } from '@/lib/auth/context';
import { statisticsService } from '@/lib/api/statistics';
import { Loader2, BookOpen, CheckCircle, Award, Clock, Target, TrendingUp, Eye, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/Card';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) {
        setError('User not authenticated or ID not available.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await statisticsService.getStudentDashboard(user.id);
        setDashboardData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch dashboard data');
        toast.error('Erreur de chargement', {
          description: err.message || 'Impossible de charger les données du tableau de bord étudiant.',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary-navy" />
        <p className="ml-3 text-primary-navy">Chargement de votre tableau de bord...</p>
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

  const personalStats = dashboardData?.personalStats;
  const achievements = dashboardData?.achievements;

  const progressTrendData = personalStats?.progressTrend?.map((item: any) => ({
    name: item.date,
    'Leçons Complétées': item.completedLectures,
    'Note Moyenne': item.grade,
  })) || [];

  // Données pour DonutChart - Répartition des notes
  const gradeDistributionData = [
    { name: 'Excellent (16-20)', value: personalStats?.excellentGrades || 0, color: '#10b981' },
    { name: 'Bon (12-15)', value: personalStats?.goodGrades || 0, color: '#fbbf24' },
    { name: 'Moyen (8-11)', value: personalStats?.averageGrades || 0, color: '#f97316' },
    { name: 'À améliorer (0-7)', value: personalStats?.poorGrades || 0, color: '#ef4444' },
  ];

  // Données pour PieChart - Répartition du temps d'étude
  const studyTimeData = [
    { name: 'Vidéos', value: personalStats?.videoTime || 0, color: '#1e293b' },
    { name: 'Exercices', value: personalStats?.exerciseTime || 0, color: '#fbbf24' },
    { name: 'Révisions', value: personalStats?.revisionTime || 0, color: '#10b981' },
    { name: 'Évaluations', value: personalStats?.evaluationTime || 0, color: '#8b5cf6' },
  ];

  // Données pour ProgressChart - Progression personnelle
  const personalProgressData = [
    {
      label: 'Modules complétés',
      value: personalStats?.completedModules || 0,
      maxValue: personalStats?.totalModules || 1,
      description: 'Modules terminés',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      label: 'Objectifs atteints',
      value: achievements?.completedGoals || 0,
      maxValue: achievements?.totalGoals || 1,
      description: 'Objectifs personnels',
      icon: <Target className="w-4 h-4" />,
    },
    {
      label: 'Temps d\'étude',
      value: Math.round((personalStats?.totalStudyTime || 0) / 60),
      maxValue: 300, // 5 heures max
      description: 'Temps total d\'étude (minutes)',
      icon: <Clock className="w-4 h-4" />,
    },
  ];

  // Métriques détaillées
  const detailedMetrics = [
    {
      title: 'Note moyenne',
      value: personalStats?.averageGrade?.toFixed(1) || 'N/A',
      description: 'Toutes matières confondues',
      icon: <Award className="w-5 h-5" />,
      trend: {
        value: personalStats?.gradeImprovement || 0,
        isPositive: (personalStats?.gradeImprovement || 0) > 0,
        period: 'vs mois dernier',
      },
      color: 'success' as const,
    },
    {
      title: 'Temps d\'étude',
      value: `${Math.round((personalStats?.totalStudyTime || 0) / 60)}min`,
      description: 'Cette semaine',
      icon: <Clock className="w-5 h-5" />,
      trend: {
        value: personalStats?.studyTimeGrowth || 0,
        isPositive: (personalStats?.studyTimeGrowth || 0) > 0,
        period: 'vs semaine dernière',
      },
      color: 'primary' as const,
    },
    {
      title: 'Leçons complétées',
      value: personalStats?.completedLectures || 0,
      description: 'Cette semaine',
      icon: <CheckCircle className="w-5 h-5" />,
      trend: {
        value: personalStats?.lectureCompletionRate || 0,
        isPositive: (personalStats?.lectureCompletionRate || 0) > 0,
        period: 'vs semaine dernière',
      },
      color: 'info' as const,
    },
    {
      title: 'Streak actuel',
      value: personalStats?.currentStreak || 0,
      description: 'Jours consécutifs',
      icon: <TrendingUp className="w-5 h-5" />,
      trend: {
        value: personalStats?.streakGrowth || 0,
        isPositive: (personalStats?.streakGrowth || 0) > 0,
        period: 'vs semaine dernière',
      },
      color: 'warning' as const,
    },
  ];

  return (
    <>
      <PageHeader
        title={`Bonjour, ${user?.firstName || 'Étudiant'}!`}
        description="Bienvenue sur votre espace personnel. Suivez votre progression et vos succès."
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

      <Section title="Votre Progression en un Coup d'Œil" dense className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Classes Inscrites</p>
            <p className="text-2xl font-bold text-primary-navy">{personalStats?.totalClasses || 0}</p>
          </div>
        </Card>
        <Card className="p-6 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Modules Complétés</p>
            <p className="text-2xl font-bold text-primary-navy">{personalStats?.completedModules || 0} / {personalStats?.totalModules || 0}</p>
          </div>
        </Card>
        <Card className="p-6 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-amber-100 text-amber-600">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Note Moyenne</p>
            <p className="text-2xl font-bold text-primary-navy">{personalStats?.averageGrade?.toFixed(1) || 'N/A'}</p>
          </div>
        </Card>
        <Card className="p-6 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Temps de Visionnage</p>
            <p className="text-2xl font-bold text-primary-navy">{Math.round((personalStats?.totalWatchTime || 0) / 60)} min</p>
          </div>
        </Card>
      </Section>

      <Section title="Votre Évolution" dense className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section variant="card" title="Progression des Leçons et Notes" description="Suivez votre évolution au fil du temps.">
          <LineChart
            data={progressTrendData}
            xKey="name"
            series={[
              { key: 'Leçons Complétées', name: 'Leçons Complétées', color: '#1e293b' },
              { key: 'Note Moyenne', name: 'Note Moyenne', color: '#fbbf24' },
            ]}
          />
        </Section>
        <Section variant="card" title="Activités Récentes" description="Vos dernières interactions avec les cours.">
          <RecentActivity />
        </Section>
      </Section>

      <Section title="Analyses Détaillées" dense className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Section variant="card" title="Répartition des Notes" description="Distribution de vos résultats.">
          <DonutChart
            data={gradeDistributionData}
            height={250}
            showLegend={true}
            showTooltip={true}
          />
        </Section>
        <Section variant="card" title="Temps d'Étude" description="Répartition de votre temps d'apprentissage.">
          <PieChart
            data={studyTimeData}
            height={250}
            showLegend={true}
            showTooltip={true}
          />
        </Section>
        <Section variant="card" title="Progression Personnelle" description="Vos indicateurs de performance.">
          <ProgressChart
            data={personalProgressData}
            showPercentages={true}
            showValues={true}
            animate={true}
            size="md"
          />
        </Section>
      </Section>

      <Section title="Vos Objectifs et Réalisations" dense className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section variant="card" title="Progrès vers les Objectifs" description="Ce qu'il vous reste à accomplir.">
          <ProgressWidget
            title="Prochain Module"
            description="Terminez le module 'Statistiques Inférentielles' pour débloquer le suivant."
            progress={75}
          />
          <ProgressWidget
            title="Prochain Examen"
            description="Préparez-vous pour l'examen final de 'Probabilités Avancées'."
            progress={20}
          />
        </Section>
        <Section variant="card" title="Vos Achievements" description="Les badges que vous avez gagnés.">
          {achievements?.recentAchievements && achievements.recentAchievements.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievements.recentAchievements.map((achievement: any) => (
                <Card key={achievement.id} className="p-4 flex items-center space-x-3">
                  <Award className="w-8 h-8 text-amber-500" />
                  <div>
                    <h4 className="font-semibold text-primary-navy">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Aucun achievement récent. Continuez à apprendre pour en débloquer !</p>
          )}
        </Section>
      </Section>
    </>
  );
};

