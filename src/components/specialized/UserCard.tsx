"use client"
import React from 'react';
import { cn } from '@/lib/utils';
import { User, Mail, Calendar, Award, BookOpen, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'formateur' | 'admin';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  avatar?: string;
  phone?: string;
  country?: string;
  city?: string;
  bio?: string;
  joinedAt: string;
  lastLoginAt?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  stats?: {
    totalClasses?: number;
    completedClasses?: number;
    totalModules?: number;
    completedModules?: number;
    averageGrade?: number;
    totalStudyTime?: number; // en heures
    achievements?: number;
    streak?: number; // jours consécutifs
  };
  preferences?: {
    language?: string;
    timezone?: string;
    notifications?: boolean;
  };
}

interface UserCardProps {
  user: UserData;
  className?: string;
  showDetails?: boolean;
  showStats?: boolean;
  showActions?: boolean;
  onEdit?: (user: UserData) => void;
  onView?: (user: UserData) => void;
  onClick?: (user: UserData) => void;
  variant?: 'default' | 'compact' | 'detailed';
  loading?: boolean;
  userRole?: 'student' | 'formateur' | 'admin';
}

const roleConfig = {
  student: {
    label: 'Étudiant',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    badgeColor: 'bg-blue-500',
    icon: <User className="w-4 h-4" />,
  },
  formateur: {
    label: 'Formateur',
    color: 'bg-green-100 text-green-700 border-green-200',
    badgeColor: 'bg-green-500',
    icon: <Award className="w-4 h-4" />,
  },
  admin: {
    label: 'Administrateur',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    badgeColor: 'bg-purple-500',
    icon: <Award className="w-4 h-4" />,
  },
};

const statusConfig = {
  active: {
    label: 'Actif',
    color: 'bg-green-100 text-green-700',
    icon: <CheckCircle className="w-3 h-3" />,
  },
  inactive: {
    label: 'Inactif',
    color: 'bg-gray-100 text-gray-700',
    icon: <AlertCircle className="w-3 h-3" />,
  },
  pending: {
    label: 'En attente',
    color: 'bg-amber-100 text-amber-700',
    icon: <Clock className="w-3 h-3" />,
  },
  suspended: {
    label: 'Suspendu',
    color: 'bg-red-100 text-red-700',
    icon: <AlertCircle className="w-3 h-3" />,
  },
};

export const UserCard: React.FC<UserCardProps> = ({
  user,
  className,
  showDetails = true,
  showStats = true,
  showActions = true,
  onEdit,
  onView,
  onClick,
  variant = 'default',
  loading = false,
  userRole = 'student',
}) => {
  const role = roleConfig[user.role];
  const status = statusConfig[user.status];
  const fullName = `${user.firstName} ${user.lastName}`;

  if (loading) {
    return (
      <Card className={cn("p-4 animate-pulse", className)}>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </Card>
    );
  }

  const CardContent = () => (
    <Card 
      className={cn(
        "p-4 transition-all duration-200",
        onClick && "cursor-pointer hover:shadow-lg hover:scale-105",
        className
      )}
      onClick={() => onClick?.(user)}
    >
      {/* En-tête avec avatar et informations principales */}
      <div className="flex items-start space-x-3 mb-4">
        <Avatar
          src={user.avatar}
          alt={fullName}
          size="lg"
        >
          {user.firstName.charAt(0).toUpperCase()}
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h3 className={cn(
                "font-semibold text-gray-900 truncate",
                variant === 'compact' ? "text-sm" : "text-base"
              )}>
                {fullName}
              </h3>
              <p className="text-xs text-gray-500 truncate">
                {user.email}
              </p>
            </div>
            
            <div className="flex items-center space-x-2 ml-2">
              <Badge variant="solid" className={role.badgeColor}>
                {role.icon}
                <span className="ml-1">{role.label}</span>
              </Badge>
              <div className={cn("flex items-center space-x-1 text-xs", status.color)}>
                {status.icon}
                <span>{status.label}</span>
              </div>
            </div>
          </div>
          
          {showDetails && user.bio && variant !== 'compact' && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {user.bio}
            </p>
          )}
        </div>
      </div>

      {/* Informations de contact */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <Mail className="w-3 h-3" />
          <span className="truncate">{user.email}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <Calendar className="w-3 h-3" />
          <span>
            Membre depuis {new Date(user.joinedAt).toLocaleDateString('fr-FR', {
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>

        {user.phone && (
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <span>📞</span>
            <span>{user.phone}</span>
          </div>
        )}

        {user.city && user.country && (
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <span>📍</span>
            <span>{user.city}, {user.country}</span>
          </div>
        )}
      </div>

      {/* Statistiques */}
      {showStats && user.stats && variant !== 'compact' && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Statistiques</h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {user.stats.totalClasses !== undefined && (
              <div className="flex items-center space-x-2 text-gray-600">
                <BookOpen className="w-3 h-3" />
                <span>{user.stats.completedClasses || 0}/{user.stats.totalClasses} classes</span>
              </div>
            )}
            {user.stats.totalModules !== undefined && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Award className="w-3 h-3" />
                <span>{user.stats.completedModules || 0}/{user.stats.totalModules} modules</span>
              </div>
            )}
            {user.stats.averageGrade !== undefined && (
              <div className="flex items-center space-x-2 text-gray-600">
                <span>📊</span>
                <span>Moyenne: {user.stats.averageGrade.toFixed(1)}/20</span>
              </div>
            )}
            {user.stats.totalStudyTime !== undefined && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="w-3 h-3" />
                <span>{user.stats.totalStudyTime}h d'étude</span>
              </div>
            )}
            {user.stats.achievements !== undefined && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Award className="w-3 h-3" />
                <span>{user.stats.achievements} achievements</span>
              </div>
            )}
            {user.stats.streak !== undefined && (
              <div className="flex items-center space-x-2 text-gray-600">
                <span>🔥</span>
                <span>{user.stats.streak} jours consécutifs</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vérifications */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-1 text-xs">
          {user.isEmailVerified ? (
            <div className="flex items-center space-x-1 text-green-600">
              <CheckCircle className="w-3 h-3" />
              <span>Email vérifié</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-gray-500">
              <AlertCircle className="w-3 h-3" />
              <span>Email non vérifié</span>
            </div>
          )}
        </div>
        
        {user.phone && (
          <div className="flex items-center space-x-1 text-xs">
            {user.isPhoneVerified ? (
              <div className="flex items-center space-x-1 text-green-600">
                <CheckCircle className="w-3 h-3" />
                <span>Téléphone vérifié</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-gray-500">
                <AlertCircle className="w-3 h-3" />
                <span>Téléphone non vérifié</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {userRole === 'admin' && onEdit && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(user)}
              >
                Modifier
              </Button>
            )}
            
            {onView && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onView(user)}
              >
                Voir profil
              </Button>
            )}
          </div>
          
          {user.lastLoginAt && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>
                Dernière connexion: {new Date(user.lastLoginAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short'
                })}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Variant détaillé */}
      {variant === 'detailed' && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-500">Rôle:</span>
              <span className="ml-1 font-medium">{role.label}</span>
            </div>
            <div>
              <span className="text-gray-500">Statut:</span>
              <span className="ml-1 font-medium">{status.label}</span>
            </div>
            <div>
              <span className="text-gray-500">Inscrit:</span>
              <span className="ml-1 font-medium">
                {new Date(user.joinedAt).toLocaleDateString('fr-FR')}
              </span>
            </div>
            {user.preferences?.language && (
              <div>
                <span className="text-gray-500">Langue:</span>
                <span className="ml-1 font-medium">{user.preferences.language}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );

  return <CardContent />;
};
