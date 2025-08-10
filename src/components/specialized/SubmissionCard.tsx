"use client"
import React from 'react';
import { cn } from '@/lib/utils';
import { FileText, CheckCircle, Clock, AlertCircle, Award, Calendar, User, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface Submission {
  id: string;
  evaluationId: string;
  evaluationTitle: string;
  evaluationType: 'quiz' | 'exam' | 'assignment' | 'project';
  studentId: string;
  studentName: string;
  studentEmail: string;
  status: 'draft' | 'submitted' | 'graded' | 'late' | 'overdue';
  submittedAt: string;
  gradedAt?: string;
  score?: number;
  maxScore?: number;
  percentage?: number;
  grade?: string;
  feedback?: string;
  timeSpent?: number; // en minutes
  attempts?: number;
  files?: Array<{
    id: string;
    name: string;
    size: number;
    url: string;
  }>;
  answers?: Record<string, any>;
  isLate: boolean;
  lateMinutes?: number;
}

interface SubmissionCardProps {
  submission: Submission;
  className?: string;
  showDetails?: boolean;
  showFeedback?: boolean;
  showFiles?: boolean;
  onGrade?: (submission: Submission) => void;
  onView?: (submission: Submission) => void;
  onClick?: (submission: Submission) => void;
  variant?: 'default' | 'compact' | 'detailed';
  loading?: boolean;
  userRole?: 'student' | 'formateur' | 'admin';
}

const statusConfig = {
  draft: {
    label: 'Brouillon',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    badgeColor: 'bg-gray-500',
    icon: <FileText className="w-4 h-4" />,
  },
  submitted: {
    label: 'Soumis',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    badgeColor: 'bg-blue-500',
    icon: <CheckCircle className="w-4 h-4" />,
  },
  graded: {
    label: 'Noté',
    color: 'bg-green-100 text-green-700 border-green-200',
    badgeColor: 'bg-green-500',
    icon: <Award className="w-4 h-4" />,
  },
  late: {
    label: 'En retard',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    badgeColor: 'bg-amber-500',
    icon: <AlertCircle className="w-4 h-4" />,
  },
  overdue: {
    label: 'En retard',
    color: 'bg-red-100 text-red-700 border-red-200',
    badgeColor: 'bg-red-500',
    icon: <AlertCircle className="w-4 h-4" />,
  },
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
    icon: <FileText className="w-4 h-4" />,
    label: 'Devoir',
    color: 'bg-green-100 text-green-700',
  },
  project: {
    icon: <Award className="w-4 h-4" />,
    label: 'Projet',
    color: 'bg-purple-100 text-purple-700',
  },
};

const getScoreColor = (percentage: number) => {
  if (percentage >= 80) return 'text-green-600';
  if (percentage >= 60) return 'text-blue-600';
  if (percentage >= 40) return 'text-amber-600';
  return 'text-red-600';
};

const getScoreLabel = (percentage: number) => {
  if (percentage >= 80) return 'Excellent';
  if (percentage >= 60) return 'Bon';
  if (percentage >= 40) return 'Moyen';
  return 'À améliorer';
};

export const SubmissionCard: React.FC<SubmissionCardProps> = ({
  submission,
  className,
  showDetails = true,
  showFeedback = true,
  showFiles = true,
  onGrade,
  onView,
  onClick,
  variant = 'default',
  loading = false,
  userRole = 'student',
}) => {
  const status = statusConfig[submission.status];
  const type = typeConfig[submission.evaluationType];
  const scoreColor = submission.percentage ? getScoreColor(submission.percentage) : '';
  const scoreLabel = submission.percentage ? getScoreLabel(submission.percentage) : '';

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
        submission.isLate && "border-amber-200 bg-amber-50",
        className
      )}
      onClick={() => onClick?.(submission)}
    >
      {/* En-tête avec titre et statut */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <div className={cn("p-2 rounded-lg border", status.color)}>
              {status.icon}
            </div>
            <h3 className={cn(
              "font-semibold text-gray-900 truncate",
              variant === 'compact' ? "text-sm" : "text-base"
            )}>
              {submission.evaluationTitle}
            </h3>
          </div>
          
          <p className="text-xs text-gray-500">
            Soumis par {submission.studentName}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 ml-2">
          <Badge variant="solid" className={status.badgeColor}>
            {status.label}
          </Badge>
          {submission.isLate && (
            <Badge variant="outline" className="bg-amber-100 text-amber-700">
              +{submission.lateMinutes || 0}min
            </Badge>
          )}
        </div>
      </div>

      {/* Informations principales */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <div className={cn("p-1 rounded", type.color)}>
            {type.icon}
          </div>
          <span>{type.label}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <Calendar className="w-3 h-3" />
          <span>
            {new Date(submission.submittedAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>

        {submission.timeSpent && (
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <Clock className="w-3 h-3" />
            <span>{submission.timeSpent} min</span>
          </div>
        )}

        {submission.attempts && (
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <User className="w-3 h-3" />
            <span>Tentative {submission.attempts}</span>
          </div>
        )}
      </div>

      {/* Score et progression */}
      {submission.percentage !== undefined && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Score</span>
            <span className={cn("text-lg font-bold", scoreColor)}>
              {submission.score}/{submission.maxScore} ({submission.percentage.toFixed(1)}%)
            </span>
          </div>
          
          <div className="space-y-2">
            <ProgressBar 
              progress={submission.percentage} 
              className="h-3"
              color={submission.percentage >= 80 ? 'green' : submission.percentage >= 60 ? 'blue' : submission.percentage >= 40 ? 'amber' : 'red'}
            />
            
            <p className={cn("text-xs font-medium", scoreColor)}>
              {scoreLabel}
            </p>
          </div>
        </div>
      )}

      {/* Fichiers joints */}
      {showFiles && submission.files && submission.files.length > 0 && variant !== 'compact' && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Fichiers joints</h4>
          <div className="space-y-1">
            {submission.files.map((file, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="text-gray-600 truncate">{file.name}</span>
                <span className="font-medium">{(file.size / 1024).toFixed(1)} KB</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feedback */}
      {showFeedback && submission.feedback && variant !== 'compact' && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-xs font-medium text-gray-700 mb-1">Commentaires</h4>
          <p className="text-sm text-gray-600 line-clamp-2">
            {submission.feedback}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {userRole === 'formateur' && submission.status === 'submitted' && onGrade && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onGrade(submission)}
            >
              Noter
            </Button>
          )}
          
          {onView && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onView(submission)}
            >
              Voir détails
            </Button>
          )}
        </div>
        
        {submission.gradedAt && (
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Award className="w-3 h-3" />
            <span>
              Noté le {new Date(submission.gradedAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short'
              })}
            </span>
          </div>
        )}
      </div>

      {/* Variant détaillé */}
      {variant === 'detailed' && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-500">Type:</span>
              <span className="ml-1 font-medium">{type.label}</span>
            </div>
            <div>
              <span className="text-gray-500">Statut:</span>
              <span className="ml-1 font-medium">{status.label}</span>
            </div>
            <div>
              <span className="text-gray-500">Soumis:</span>
              <span className="ml-1 font-medium">
                {new Date(submission.submittedAt).toLocaleDateString('fr-FR')}
              </span>
            </div>
            {submission.gradedAt && (
              <div>
                <span className="text-gray-500">Noté:</span>
                <span className="ml-1 font-medium">
                  {new Date(submission.gradedAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );

  return <CardContent />;
};
