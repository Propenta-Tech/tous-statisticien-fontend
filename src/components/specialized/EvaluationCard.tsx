"use client"
import React from 'react';
import { cn } from '@/lib/utils';
import { Clock, CheckCircle, XCircle, AlertCircle, FileText, Award, Calendar, Users } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface Evaluation {
  id: string;
  title: string;
  description?: string;
  type: 'quiz' | 'exam' | 'assignment' | 'project';
  status: 'draft' | 'published' | 'active' | 'completed' | 'archived';
  dueDate?: string;
  timeLimit?: number; // en minutes
  totalQuestions?: number;
  maxScore?: number;
  passingScore?: number;
  attempts?: number;
  maxAttempts?: number;
  averageScore?: number;
  totalSubmissions?: number;
  isCompleted?: boolean;
  userScore?: number;
  userAttempts?: number;
  lastAttemptDate?: string;
  moduleId?: string;
  moduleName?: string;
  tags?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface EvaluationCardProps {
  evaluation: Evaluation;
  className?: string;
  showDetails?: boolean;
  showProgress?: boolean;
  showStats?: boolean;
  onClick?: (evaluation: Evaluation) => void;
  variant?: 'default' | 'compact' | 'detailed';
  loading?: boolean;
  userRole?: 'student' | 'formateur' | 'admin';
}

const typeConfig = {
  quiz: {
    icon: <FileText className="w-5 h-5" />,
    label: 'Quiz',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    badgeColor: 'bg-blue-500',
  },
  exam: {
    icon: <Award className="w-5 h-5" />,
    label: 'Examen',
    color: 'bg-red-100 text-red-700 border-red-200',
    badgeColor: 'bg-red-500',
  },
  assignment: {
    icon: <FileText className="w-5 h-5" />,
    label: 'Devoir',
    color: 'bg-green-100 text-green-700 border-green-200',
    badgeColor: 'bg-green-500',
  },
  project: {
    icon: <Award className="w-5 h-5" />,
    label: 'Projet',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    badgeColor: 'bg-purple-500',
  },
};

const statusConfig = {
  draft: {
    label: 'Brouillon',
    color: 'bg-gray-100 text-gray-700',
    icon: <AlertCircle className="w-4 h-4" />,
  },
  published: {
    label: 'Publié',
    color: 'bg-blue-100 text-blue-700',
    icon: <CheckCircle className="w-4 h-4" />,
  },
  active: {
    label: 'Actif',
    color: 'bg-green-100 text-green-700',
    icon: <CheckCircle className="w-4 h-4" />,
  },
  completed: {
    label: 'Terminé',
    color: 'bg-amber-100 text-amber-700',
    icon: <Award className="w-4 h-4" />,
  },
  archived: {
    label: 'Archivé',
    color: 'bg-gray-100 text-gray-600',
    icon: <XCircle className="w-4 h-4" />,
  },
};

const difficultyConfig = {
  easy: {
    label: 'Facile',
    color: 'bg-green-100 text-green-700',
  },
  medium: {
    label: 'Moyen',
    color: 'bg-amber-100 text-amber-700',
  },
  hard: {
    label: 'Difficile',
    color: 'bg-red-100 text-red-700',
  },
};

const EvaluationCard: React.FC<EvaluationCardProps> = ({
  evaluation,
  className,
  showDetails = true,
  showProgress = true,
  showStats = true,
  onClick,
  variant = 'default',
  loading = false,
  userRole = 'student',
}) => {
  const type = typeConfig[evaluation.type];
  const status = statusConfig[evaluation.status];
  const difficulty = evaluation.difficulty ? difficultyConfig[evaluation.difficulty] : null;
  
  const isOverdue = evaluation.dueDate && new Date(evaluation.dueDate) < new Date();
  const isCompleted = evaluation.isCompleted;
  const hasAttempts = evaluation.userAttempts && evaluation.maxAttempts;
  const attemptsRemaining = hasAttempts ? (evaluation.maxAttempts || 0) - (evaluation.userAttempts || 0) : null;
  const scorePercentage = evaluation.userScore && evaluation.maxScore 
    ? (evaluation.userScore / evaluation.maxScore) * 100 
    : null;

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreLabel = (percentage: number) => {
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 60) return 'Bon';
    if (percentage >= 40) return 'Moyen';
    return 'À améliorer';
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
        isOverdue && !isCompleted && "border-red-200 bg-red-50",
        className
      )}
      onClick={() => onClick?.(evaluation)}
    >
      {/* En-tête */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={cn("p-2 rounded-lg border", type.color)}>
            {type.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "font-semibold text-gray-900 truncate",
              variant === 'compact' ? "text-sm" : "text-base"
            )}>
              {evaluation.title}
            </h3>
            {evaluation.moduleName && (
              <p className="text-xs text-gray-500 mt-1">
                Module: {evaluation.moduleName}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-2">
          <Badge variant="solid" className={type.badgeColor}>
            {type.label}
          </Badge>
          {difficulty && (
            <Badge variant="outline" className={difficulty.color}>
              {difficulty.label}
            </Badge>
          )}
        </div>
      </div>

      {/* Description */}
      {showDetails && evaluation.description && variant !== 'compact' && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {evaluation.description}
        </p>
      )}

      {/* Informations principales */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {evaluation.dueDate && (
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <Calendar className="w-3 h-3" />
            <span>
              {new Date(evaluation.dueDate).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </span>
          </div>
        )}
        
        {evaluation.timeLimit && (
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <Clock className="w-3 h-3" />
            <span>{evaluation.timeLimit} min</span>
          </div>
        )}

        {evaluation.totalQuestions && (
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <FileText className="w-3 h-3" />
            <span>{evaluation.totalQuestions} questions</span>
          </div>
        )}

        {hasAttempts && (
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <Users className="w-3 h-3" />
            <span>{evaluation.userAttempts}/{evaluation.maxAttempts} tentatives</span>
          </div>
        )}
      </div>

      {/* Score et progression */}
      {showProgress && (isCompleted || userRole !== 'student') && (
        <div className="mb-3">
          {scorePercentage !== null ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Votre score</span>
                <span className={cn("text-sm font-bold", getScoreColor(scorePercentage))}>
                  {evaluation.userScore}/{evaluation.maxScore} ({scorePercentage.toFixed(1)}%)
                </span>
              </div>
              <ProgressBar 
                value={scorePercentage} 
                max={100}
                className="h-2"
                color={scorePercentage >= 80 ? 'success' : scorePercentage >= 60 ? 'warning' : 'danger'}
              />
              <p className={cn("text-xs font-medium", getScoreColor(scorePercentage))}>
                {getScoreLabel(scorePercentage)}
              </p>
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-sm text-gray-500">Aucun score disponible</p>
            </div>
          )}
        </div>
      )}

      {/* Statistiques (pour formateurs/admins) */}
      {showStats && userRole !== 'student' && evaluation.totalSubmissions && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Statistiques</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-500">Soumissions:</span>
              <span className="ml-1 font-medium">{evaluation.totalSubmissions}</span>
            </div>
            {evaluation.averageScore && (
              <div>
                <span className="text-gray-500">Moyenne:</span>
                <span className="ml-1 font-medium">{evaluation.averageScore.toFixed(1)}%</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Statut et actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={cn("flex items-center space-x-1 text-xs", status.color)}>
            {status.icon}
            <span>{status.label}</span>
          </div>
          
          {isOverdue && !isCompleted && (
            <Badge variant="solid" className="bg-red-500 text-xs">
              En retard
            </Badge>
          )}
          
          {isCompleted && (
            <Badge variant="solid" className="bg-green-500 text-xs">
              Terminé
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {userRole === 'student' && !isCompleted && evaluation.status === 'active' && (
            <Button
              size="sm"
              variant="primary"
              disabled={hasAttempts && attemptsRemaining === 0 ? true : false}
              onClick={() => onClick?.(evaluation)}
            >
              {hasAttempts && attemptsRemaining === 0 ? 'Plus de tentatives' : 'Commencer'}
            </Button>
          )}
          
          {userRole !== 'student' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onClick?.(evaluation)}
            >
              Voir détails
            </Button>
          )}
        </div>
      </div>

      {/* Tags */}
      {evaluation.tags && evaluation.tags.length > 0 && variant === 'detailed' && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-1">
            {evaluation.tags.map((tag, index) => (
              <Badge key={index} variant="ghost" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );

  return <CardContent />;
};

export { EvaluationCard }
