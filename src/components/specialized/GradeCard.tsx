"use client"
import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, Award, BookOpen, Target, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface Grade {
  id: string;
  evaluationId: string;
  evaluationTitle: string;
  evaluationType: 'quiz' | 'exam' | 'assignment' | 'project';
  score: number;
  maxScore: number;
  percentage: number;
  grade: string;
  feedback?: string;
  submittedAt: string;
  correctedAt?: string;
  moduleId?: string;
  moduleName?: string;
  weight?: number; // poids dans la moyenne
  isLatest?: boolean;
  trend?: 'up' | 'down' | 'stable';
}

interface GradeCardProps {
  grade: Grade;
  className?: string;
  showDetails?: boolean;
  showTrend?: boolean;
  showFeedback?: boolean;
  showModule?: boolean;
  onClick?: (grade: Grade) => void;
  variant?: 'default' | 'compact' | 'detailed';
  loading?: boolean;
  showWeight?: boolean;
}

const gradeConfig = {
  A: { label: 'Excellent', color: 'bg-green-100 text-green-700 border-green-200', badgeColor: 'bg-green-500' },
  B: { label: 'Bon', color: 'bg-blue-100 text-blue-700 border-blue-200', badgeColor: 'bg-blue-500' },
  C: { label: 'Moyen', color: 'bg-amber-100 text-amber-700 border-amber-200', badgeColor: 'bg-amber-500' },
  D: { label: 'Insuffisant', color: 'bg-red-100 text-red-700 border-red-200', badgeColor: 'bg-red-500' },
  F: { label: 'Échec', color: 'bg-red-100 text-red-700 border-red-200', badgeColor: 'bg-red-500' },
};

const typeConfig = {
  quiz: {
    icon: <BookOpen className="w-4 h-4" />,
    label: 'Quiz',
    color: 'bg-blue-100 text-blue-700',
  },
  exam: {
    icon: <Award className="w-4 h-4" />,
    label: 'Examen',
    color: 'bg-red-100 text-red-700',
  },
  assignment: {
    icon: <Target className="w-4 h-4" />,
    label: 'Devoir',
    color: 'bg-green-100 text-green-700',
  },
  project: {
    icon: <Award className="w-4 h-4" />,
    label: 'Projet',
    color: 'bg-purple-100 text-purple-700',
  },
};

const getGradeColor = (percentage: number) => {
  if (percentage >= 80) return 'text-green-600';
  if (percentage >= 60) return 'text-blue-600';
  if (percentage >= 40) return 'text-amber-600';
  return 'text-red-600';
};

const getGradeLabel = (percentage: number) => {
  if (percentage >= 80) return 'Excellent';
  if (percentage >= 60) return 'Bon';
  if (percentage >= 40) return 'Moyen';
  return 'À améliorer';
};

export const GradeCard: React.FC<GradeCardProps> = ({
  grade,
  className,
  showDetails = true,
  showTrend = true,
  showFeedback = true,
  showModule = true,
  onClick,
  variant = 'default',
  loading = false,
  showWeight = false,
}) => {
  const gradeInfo = gradeConfig[grade.grade as keyof typeof gradeConfig] || gradeConfig.C;
  const type = typeConfig[grade.evaluationType];
  const gradeColor = getGradeColor(grade.percentage);
  const gradeLabel = getGradeLabel(grade.percentage);

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendLabel = (trend?: string) => {
    switch (trend) {
      case 'up':
        return 'En progression';
      case 'down':
        return 'En baisse';
      default:
        return 'Stable';
    }
  };

  if (loading) {
    return (
      <Card className={cn("p-4 animate-pulse", className)}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          <div className="flex items-center space-x-4">
            <div className="h-3 bg-gray-200 rounded w-20"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </Card>
    );
  }

  const CardContent = () => (
    <Card 
      className={cn(
        "p-4 transition-all duration-200",
        onClick && "cursor-pointer hover:shadow-lg hover:scale-105",
        grade.isLatest && "ring-2 ring-blue-200",
        className
      )}
      onClick={() => onClick?.(grade)}
    >
      {/* En-tête avec titre et note */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <div className={cn("p-1 rounded", type.color)}>
              {type.icon}
            </div>
            <h3 className={cn(
              "font-semibold text-gray-900 truncate",
              variant === 'compact' ? "text-sm" : "text-base"
            )}>
              {grade.evaluationTitle}
            </h3>
            {grade.isLatest && (
              <Badge variant="solid" className="bg-blue-500 text-xs">
                Dernier
              </Badge>
            )}
          </div>
          
          {showModule && grade.moduleName && (
            <p className="text-xs text-gray-500">
              Module: {grade.moduleName}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-2 ml-2">
          <Badge variant="solid" className={gradeInfo.badgeColor}>
            {grade.grade}
          </Badge>
          {showWeight && grade.weight && (
            <Badge variant="outline" className="text-xs">
              {grade.weight}%
            </Badge>
          )}
        </div>
      </div>

      {/* Score et pourcentage */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Score</span>
          <span className={cn("text-lg font-bold", gradeColor)}>
            {grade.score}/{grade.maxScore}
          </span>
        </div>
        
        <div className="space-y-2">
          <ProgressBar 
            progress={grade.percentage} 
            className="h-3"
            color={grade.percentage >= 80 ? 'green' : grade.percentage >= 60 ? 'blue' : grade.percentage >= 40 ? 'amber' : 'red'}
          />
          
          <div className="flex items-center justify-between">
            <span className={cn("text-sm font-medium", gradeColor)}>
              {grade.percentage.toFixed(1)}% - {gradeLabel}
            </span>
            
            {showTrend && (
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                {getTrendIcon(grade.trend)}
                <span>{getTrendLabel(grade.trend)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Informations supplémentaires */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <Clock className="w-3 h-3" />
          <span>
            {new Date(grade.submittedAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>
        
        {grade.correctedAt && (
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <Award className="w-3 h-3" />
            <span>
              Corrigé le {new Date(grade.correctedAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short'
              })}
            </span>
          </div>
        )}
      </div>

      {/* Feedback */}
      {showFeedback && grade.feedback && variant !== 'compact' && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-xs font-medium text-gray-700 mb-1">Commentaires</h4>
          <p className="text-sm text-gray-600 line-clamp-2">
            {grade.feedback}
          </p>
        </div>
      )}

      {/* Variant détaillé */}
      {variant === 'detailed' && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-500">Type:</span>
              <span className="ml-1 font-medium">{type.label}</span>
            </div>
            <div>
              <span className="text-gray-500">Note:</span>
              <span className="ml-1 font-medium">{grade.grade} ({grade.percentage.toFixed(1)}%)</span>
            </div>
            {grade.weight && (
              <div>
                <span className="text-gray-500">Poids:</span>
                <span className="ml-1 font-medium">{grade.weight}%</span>
              </div>
            )}
            <div>
              <span className="text-gray-500">Soumis:</span>
              <span className="ml-1 font-medium">
                {new Date(grade.submittedAt).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {onClick && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <button
            className="w-full text-sm text-primary-navy hover:text-primary-navy/80 font-medium"
            onClick={(e) => {
              e.stopPropagation();
              onClick(grade);
            }}
          >
            Voir les détails
          </button>
        </div>
      )}
    </Card>
  );

  return <CardContent />;
};
