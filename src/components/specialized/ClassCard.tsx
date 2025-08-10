"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { 
  GraduationCap, 
  Play, 
  Clock, 
  Users, 
  CheckCircle, 
  Lock, 
  Eye, 
  Calendar,
  TrendingUp,
  BookOpen,
  FileText,
  AlertCircle,
  Star,
  ExternalLink,
  Settings
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Tooltip } from '@/components/ui/Tooltip';
import { VirtualClass } from '@/types';
import { useAuth } from '@/hooks/useAuth';

interface ClassCardProps {
  virtualClass: VirtualClass;
  className?: string;
  showProgress?: boolean;
  showStats?: boolean;
  showActions?: boolean;
  onClick?: (virtualClass: VirtualClass) => void;
  onStart?: (virtualClass: VirtualClass) => void;
  onManage?: (virtualClass: VirtualClass) => void;
  variant?: 'default' | 'compact' | 'detailed' | 'minimal';
  loading?: boolean;
  userRole?: 'student' | 'admin' | 'formateur';
  userProgress?: {
    progress: number;
    completed: boolean;
    modulesCompleted: number;
    totalModules: number;
    lecturesCompleted: number;
    totalLectures: number;
  };
  href?: string;
}

interface ClassStats {
  totalStudents: number;
  activeStudents: number;
  averageProgress: number;
  completionRate: number;
  averageGrade: number;
  totalRevenue: number;
  recentActivity: number;
}

const ClassCard: React.FC<ClassCardProps> = ({
  virtualClass,
  className,
  showProgress = true,
  showStats = false,
  showActions = true,
  onClick,
  onStart,
  onManage,
  variant = 'default',
  loading = false,
  userRole = 'student',
  userProgress,
  href,
}) => {
  const auth = useAuth() as any;
  const user = auth?.user;
  const [stats, setStats] = useState<ClassStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const targetHref = href || `/dashboard/student/classes/${virtualClass.id}`;

  // Vérifier si l'utilisateur est inscrit à cette classe
  useEffect(() => {
    if (!user?.id || !virtualClass.virtualClassUsers) return;

    const enrollment = virtualClass.virtualClassUsers.find(
      enrollment => enrollment.personId === user.id
    );
    setIsEnrolled(!!enrollment);
  }, [user?.id, virtualClass.virtualClassUsers]);

  // Charger les statistiques (admin seulement)
  useEffect(() => {
    if (!showStats || userRole !== 'admin') return;

    const loadStats = async () => {
      setIsLoadingStats(true);
      try {
        // Ici vous pouvez appeler l'API pour récupérer les stats de la classe
        // const statsData = await virtualClassService.getClassStats(virtualClass.id);
        // setStats(statsData);
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    loadStats();
  }, [virtualClass.id, showStats, userRole]);

  if (loading) {
  return (
      <Card className={cn("p-4 animate-pulse", className)}>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mt-1"></div>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </Card>
    );
  }

  const handleStart = () => {
    onStart?.(virtualClass);
  };

  const handleManage = () => {
    onManage?.(virtualClass);
  };

  const handleClick = () => {
    onClick?.(virtualClass);
  };

  const CardContent = () => (
    <Card 
      className={cn(
        "p-4 transition-all duration-200",
        onClick && "cursor-pointer hover:shadow-lg hover:scale-105",
        !isEnrolled && userRole === 'student' && "opacity-60",
        className
      )}
      onClick={() => handleClick()}
    >
      <Link href={targetHref} className="block">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 grid place-items-center shadow-glow flex-shrink-0">
          <GraduationCap className="w-5 h-5" />
        </div>
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-primary-navy font-semibold truncate group-hover:underline">
                {virtualClass.name}
              </h3>
              {!isEnrolled && userRole === 'student' && (
                <Badge variant="outline" className="text-xs">
                  Non inscrit
                </Badge>
              )}
              {isEnrolled && (
                <Badge variant="solid" className="bg-green-500 text-xs">
                  Inscrit
                </Badge>
              )}
            </div>
            
            <div className="text-xs text-gray-500 mb-2">{virtualClass.level}</div>
            
            {virtualClass.description && variant !== 'compact' && (
              <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                {virtualClass.description}
              </p>
            )}

            {/* Progression utilisateur */}
            {showProgress && userProgress && isEnrolled && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600">Votre progression</span>
                  <span className="font-medium">{userProgress.progress}%</span>
                </div>
                <ProgressBar 
                  value={userProgress.progress} 
                  max={100}
                  className="h-2"
                  color={userProgress.completed ? 'success' : 'primary'}
                />
                {userProgress.completed && (
                  <div className="flex items-center space-x-1 text-xs text-green-600 mt-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Classe terminée</span>
                  </div>
                )}
              </div>
            )}

            {/* Statistiques de la classe */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <BookOpen className="w-3 h-3" />
                <span>{virtualClass.modules?.length || 0} modules</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{virtualClass.studentsCount || 0} étudiants</span>
              </div>
              {virtualClass.createdBy && (
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span className="truncate">
                    {virtualClass.createdBy.firstName} {virtualClass.createdBy.lastName}
                  </span>
                </div>
              )}
            </div>

            {/* Métadonnées */}
            {variant !== 'compact' && (
              <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {new Date(virtualClass.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                {virtualClass.updatedAt && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      Modifié le {new Date(virtualClass.updatedAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Statistiques détaillées (admin seulement) */}
            {showStats && userRole === 'admin' && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <h4 className="text-xs font-medium text-gray-700 mb-2">Statistiques</h4>
                {isLoadingStats ? (
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ) : stats ? (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Étudiants:</span>
                      <span className="ml-1 font-medium">{stats.totalStudents}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Taux de complétion:</span>
                      <span className="ml-1 font-medium">{stats.completionRate}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Progression moyenne:</span>
                      <span className="ml-1 font-medium">{stats.averageProgress}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Revenus:</span>
                      <span className="ml-1 font-medium">{stats.totalRevenue.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-500">Aucune statistique disponible</div>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Actions */}
      {showActions && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            {isEnrolled ? (
              <>
                {userProgress && !userProgress.completed && (
                  <Tooltip content="Continuer la classe">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={handleStart}
                      className="flex items-center space-x-1"
                    >
                      <Play className="w-3 h-3" />
                      <span>Continuer</span>
                    </Button>
                  </Tooltip>
                )}
                
                {userProgress && userProgress.completed && (
                  <div className="flex items-center space-x-1 text-xs text-green-600">
                    <CheckCircle className="w-3 h-3" />
                    <span>Terminé</span>
                  </div>
                )}
              </>
            ) : userRole === 'student' ? (
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Lock className="w-3 h-3" />
                <span>Inscription requise</span>
              </div>
            ) : null}
          </div>
          
          <div className="flex items-center space-x-2">
            {userRole === 'admin' && (
              <>
                <Tooltip content="Gérer la classe">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleManage}
                  >
                    <Settings className="w-3 h-3" />
                  </Button>
                </Tooltip>
                <Tooltip content="Voir les détails">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onClick?.(virtualClass)}
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                </Tooltip>
              </>
            )}
            {userRole === 'student' && isEnrolled && (
              <Tooltip content="Voir les détails">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onClick?.(virtualClass)}
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </Tooltip>
            )}
          </div>
        </div>
      )}

      {/* Variant détaillé */}
      {variant === 'detailed' && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-500">Niveau:</span>
              <span className="ml-1 font-medium">{virtualClass.level}</span>
            </div>
            <div>
              <span className="text-gray-500">Étudiants:</span>
              <span className="ml-1 font-medium">{virtualClass.studentsCount || 0}</span>
            </div>
            <div>
              <span className="text-gray-500">Créé:</span>
              <span className="ml-1 font-medium">
                {new Date(virtualClass.createdAt).toLocaleDateString('fr-FR')}
              </span>
            </div>
            {virtualClass.updatedAt && (
              <div>
                <span className="text-gray-500">Modifié:</span>
                <span className="ml-1 font-medium">
                  {new Date(virtualClass.updatedAt).toLocaleDateString('fr-FR')}
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

export { ClassCard };

