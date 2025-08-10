"use client"
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  Play, 
  Pause, 
  Clock, 
  FileText, 
  Video, 
  Headphones, 
  Monitor, 
  HelpCircle,
  CheckCircle,
  Lock,
  Download,
  Eye,
  MessageSquare,
  Star,
  Calendar,
  User,
  BookOpen,
  TrendingUp,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Tooltip } from '@/components/ui/Tooltip';
import { Lecture, LectureType } from '@/types';
import { lectureService, formatLectureType, getLectureTypeIcon, formatLectureDuration, calculateLectureProgress } from '@/lib/api/lecture';
import { useAuth } from '@/hooks/useAuth';

interface LectureCardProps {
  lecture: Lecture;
  className?: string;
  showProgress?: boolean;
  showMetadata?: boolean;
  showActions?: boolean;
  showStats?: boolean;
  onClick?: (lecture: Lecture) => void;
  onPlay?: (lecture: Lecture) => void;
  onDownload?: (lecture: Lecture) => void;
  onComment?: (lecture: Lecture) => void;
  variant?: 'default' | 'compact' | 'detailed' | 'minimal';
  loading?: boolean;
  userRole?: 'student' | 'admin' | 'formateur';
  moduleProgress?: { completed: boolean; progress: number };
  userHasPaid?: boolean;
}

interface LectureProgress {
  watchedDuration: number;
  totalDuration: number;
  progress: number;
  completed: boolean;
  lastPosition: number;
  viewCount: number;
}

interface LectureStats {
  totalViews: number;
  uniqueViewers: number;
  averageWatchTime: number;
  completionRate: number;
  commentsCount: number;
  averageRating: number;
}

const typeConfig = {
  VIDEO: {
    icon: <Video className="w-5 h-5" />,
    color: 'bg-red-100 text-red-700 border-red-200',
    badgeColor: 'bg-red-500',
    label: 'Vidéo',
  },
  PDF: {
    icon: <FileText className="w-5 h-5" />,
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    badgeColor: 'bg-blue-500',
    label: 'Document PDF',
  },
  AUDIO: {
    icon: <Headphones className="w-5 h-5" />,
    color: 'bg-green-100 text-green-700 border-green-200',
    badgeColor: 'bg-green-500',
    label: 'Audio',
  },
  TEXT: {
    icon: <FileText className="w-5 h-5" />,
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    badgeColor: 'bg-gray-500',
    label: 'Texte',
  },
  INTERACTIVE: {
    icon: <Monitor className="w-5 h-5" />,
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    badgeColor: 'bg-purple-500',
    label: 'Interactif',
  },
  DOCUMENT: {
    icon: <FileText className="w-5 h-5" />,
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    badgeColor: 'bg-orange-500',
    label: 'Document',
  },
  PRESENTATION: {
    icon: <FileText className="w-5 h-5" />,
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    badgeColor: 'bg-indigo-500',
    label: 'Présentation',
  },
  QUIZ: {
    icon: <HelpCircle className="w-5 h-5" />,
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    badgeColor: 'bg-yellow-500',
    label: 'Quiz',
  },
};

const LectureCard: React.FC<LectureCardProps> = ({
  lecture,
  className,
  showProgress = true,
  showMetadata = true,
  showActions = true,
  showStats = false,
  onClick,
  onPlay,
  onDownload,
  onComment,
  variant = 'default',
  loading = false,
  userRole = 'student',
  moduleProgress,
  userHasPaid = false,
}) => {
  const auth = useAuth() as any;
  const user = auth?.user;
  const [progress, setProgress] = useState<LectureProgress | null>(null);
  const [stats, setStats] = useState<LectureStats | null>(null);
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isAccessible, setIsAccessible] = useState(true);

  const type = typeConfig[lecture.type] || typeConfig.TEXT;

  // Vérifier l'accessibilité de la lecture
  useEffect(() => {
    const checkAccessibility = () => {
      if (lecture.type === 'TEXT') {
        setIsAccessible(true);
        return;
      }
      
      if (userRole === 'admin' || userRole === 'formateur') {
        setIsAccessible(true);
        return;
      }
      
      if (userHasPaid) {
        setIsAccessible(true);
        return;
      }
      
      if (moduleProgress?.completed) {
        setIsAccessible(true);
        return;
      }
      
      setIsAccessible(false);
    };

    checkAccessibility();
  }, [lecture.type, userRole, userHasPaid, moduleProgress]);

  // Charger la progression de l'utilisateur
  useEffect(() => {
    if (!showProgress || !user?.id || !isAccessible) return;

    const loadProgress = async () => {
      setIsLoadingProgress(true);
      try {
        const progressData = await lectureService.getLectureProgress(lecture.id, user.id);
        setProgress(progressData);
      } catch (error) {
        console.error('Erreur lors du chargement de la progression:', error);
      } finally {
        setIsLoadingProgress(false);
      }
    };

    loadProgress();
  }, [lecture.id, user?.id, showProgress, isAccessible]);

  // Charger les statistiques (admin seulement)
  useEffect(() => {
    if (!showStats || userRole !== 'admin') return;

    const loadStats = async () => {
      setIsLoadingStats(true);
      try {
        const statsData = await lectureService.getLectureStats(lecture.id);
        setStats(statsData);
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    loadStats();
  }, [lecture.id, showStats, userRole]);

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

  const handlePlay = () => {
    if (!isAccessible) return;
    onPlay?.(lecture);
  };

  const handleDownload = async () => {
    if (!isAccessible) return;
    
    try {
      const blob = await lectureService.downloadLecture(lecture.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${lecture.title}.${lecture.type.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      onDownload?.(lecture);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    }
  };

  const handleComment = () => {
    onComment?.(lecture);
  };

  const CardContent = () => (
    <Card 
      className={cn(
        "p-4 transition-all duration-200",
        onClick && "cursor-pointer hover:shadow-lg hover:scale-105",
        !isAccessible && "opacity-60",
        className
      )}
      onClick={() => onClick?.(lecture)}
    >
      {/* En-tête avec titre et type */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <div className={cn("p-2 rounded-lg border", type.color)}>
              {type.icon}
            </div>
            <h3 className={cn(
              "font-semibold text-gray-900 truncate",
              variant === 'compact' ? "text-sm" : "text-base"
            )}>
              {lecture.title}
            </h3>
            {!isAccessible && (
              <Lock className="w-4 h-4 text-gray-400" />
            )}
          </div>
          
          <p className="text-xs text-gray-500">
            {type.label}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 ml-2">
          {lecture.duration && (
            <div className="flex items-center space-x-1 text-xs text-gray-600">
              <Clock className="w-3 h-3" />
              <span>{formatLectureDuration(lecture.duration)}</span>
            </div>
          )}
          <Badge variant="solid" className={type.badgeColor}>
            {type.label}
          </Badge>
        </div>
      </div>

      {/* Progression */}
      {showProgress && isAccessible && (
        <div className="mb-3">
          {isLoadingProgress ? (
            <div className="h-2 bg-gray-200 rounded animate-pulse"></div>
          ) : progress ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Progression</span>
                <span className="font-medium">{progress.progress}%</span>
              </div>
              <ProgressBar 
                value={progress.progress} 
                max={100}
                className="h-2"
                                  color={progress.completed ? 'success' : 'primary'}
              />
              {progress.completed && (
                <div className="flex items-center space-x-1 text-xs text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  <span>Terminé</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-gray-500">Aucune progression</div>
          )}
        </div>
      )}

      {/* Métadonnées */}
      {showMetadata && variant !== 'compact' && (
        <div className="grid grid-cols-2 gap-3 mb-3">
          {lecture.module && (
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <BookOpen className="w-3 h-3" />
              <span className="truncate">{lecture.module.title}</span>
            </div>
          )}
          
          {lecture.createdBy && (
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <User className="w-3 h-3" />
              <span className="truncate">
                {lecture.createdBy.firstName} {lecture.createdBy.lastName}
              </span>
            </div>
          )}

          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <Calendar className="w-3 h-3" />
            <span>
              {new Date(lecture.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </span>
          </div>

          {lecture.size && (
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <FileText className="w-3 h-3" />
              <span>{(lecture.size / 1024 / 1024).toFixed(1)} MB</span>
            </div>
          )}
        </div>
      )}

      {/* Statistiques (admin seulement) */}
      {showStats && userRole === 'admin' && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Statistiques</h4>
          {isLoadingStats ? (
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Vues:</span>
                <span className="ml-1 font-medium">{stats.totalViews}</span>
              </div>
              <div>
                <span className="text-gray-500">Taux de complétion:</span>
                <span className="ml-1 font-medium">{stats.completionRate}%</span>
              </div>
              <div>
                <span className="text-gray-500">Temps moyen:</span>
                <span className="ml-1 font-medium">{formatLectureDuration(stats.averageWatchTime)}</span>
              </div>
              <div>
                <span className="text-gray-500">Commentaires:</span>
                <span className="ml-1 font-medium">{stats.commentsCount}</span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-gray-500">Aucune statistique disponible</div>
          )}
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isAccessible ? (
              <>
                <Tooltip content="Lire la lecture">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handlePlay}
                    className="flex items-center space-x-1"
                  >
                    <Play className="w-3 h-3" />
                    <span>Lire</span>
                  </Button>
                </Tooltip>
                
                {lecture.type !== 'TEXT' && (
                  <Tooltip content="Télécharger">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDownload}
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                  </Tooltip>
                )}
                
                <Tooltip content="Commenter">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleComment}
                  >
                    <MessageSquare className="w-3 h-3" />
                  </Button>
                </Tooltip>
              </>
            ) : (
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Lock className="w-3 h-3" />
                <span>Paiement requis</span>
              </div>
            )}
          </div>
          
          {onClick && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onClick(lecture)}
            >
              <ExternalLink className="w-3 h-3" />
            </Button>
          )}
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
            {lecture.duration && (
              <div>
                <span className="text-gray-500">Durée:</span>
                <span className="ml-1 font-medium">{formatLectureDuration(lecture.duration)}</span>
              </div>
            )}
            <div>
              <span className="text-gray-500">Créé:</span>
              <span className="ml-1 font-medium">
                {new Date(lecture.createdAt).toLocaleDateString('fr-FR')}
              </span>
            </div>
            {lecture.updatedAt && (
              <div>
                <span className="text-gray-500">Modifié:</span>
                <span className="ml-1 font-medium">
                  {new Date(lecture.updatedAt).toLocaleDateString('fr-FR')}
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

export { LectureCard };
