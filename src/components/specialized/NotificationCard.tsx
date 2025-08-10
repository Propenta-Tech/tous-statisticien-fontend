"use client"
import React from 'react';
import { cn } from '@/lib/utils';
import { Bell, CheckCircle, AlertCircle, Info, XCircle, Clock, User, BookOpen, Award, DollarSign, Users, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'reminder';
  category: 'academic' | 'payment' | 'system' | 'social' | 'reminder';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean;
  isActionable: boolean;
  createdAt: string;
  expiresAt?: string;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: {
    userId?: string;
    userName?: string;
    moduleId?: string;
    moduleName?: string;
    evaluationId?: string;
    evaluationTitle?: string;
    amount?: number;
    dueDate?: string;
  };
}

interface NotificationCardProps {
  notification: Notification;
  className?: string;
  showDetails?: boolean;
  showActions?: boolean;
  showMetadata?: boolean;
  onRead?: (notification: Notification) => void;
  onDismiss?: (notification: Notification) => void;
  onClick?: (notification: Notification) => void;
  variant?: 'default' | 'compact' | 'detailed';
  loading?: boolean;
}

const typeConfig = {
  info: {
    icon: <Info className="w-5 h-5" />,
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    badgeColor: 'bg-blue-500',
  },
  success: {
    icon: <CheckCircle className="w-5 h-5" />,
    color: 'bg-green-100 text-green-700 border-green-200',
    badgeColor: 'bg-green-500',
  },
  warning: {
    icon: <AlertCircle className="w-5 h-5" />,
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    badgeColor: 'bg-amber-500',
  },
  error: {
    icon: <XCircle className="w-5 h-5" />,
    color: 'bg-red-100 text-red-700 border-red-200',
    badgeColor: 'bg-red-500',
  },
  reminder: {
    icon: <Clock className="w-5 h-5" />,
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    badgeColor: 'bg-purple-500',
  },
};

const categoryConfig = {
  academic: {
    icon: <BookOpen className="w-4 h-4" />,
    label: 'Académique',
    color: 'bg-blue-100 text-blue-700',
  },
  payment: {
    icon: <DollarSign className="w-4 h-4" />,
    label: 'Paiement',
    color: 'bg-green-100 text-green-700',
  },
  system: {
    icon: <Bell className="w-4 h-4" />,
    label: 'Système',
    color: 'bg-gray-100 text-gray-700',
  },
  social: {
    icon: <Users className="w-4 h-4" />,
    label: 'Social',
    color: 'bg-purple-100 text-purple-700',
  },
  reminder: {
    icon: <Calendar className="w-4 h-4" />,
    label: 'Rappel',
    color: 'bg-amber-100 text-amber-700',
  },
};

const priorityConfig = {
  low: {
    label: 'Faible',
    color: 'bg-gray-100 text-gray-700',
  },
  medium: {
    label: 'Moyenne',
    color: 'bg-blue-100 text-blue-700',
  },
  high: {
    label: 'Élevée',
    color: 'bg-amber-100 text-amber-700',
  },
  urgent: {
    label: 'Urgente',
    color: 'bg-red-100 text-red-700',
  },
};

const getTimeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'À l\'instant';
  if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
  if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 2592000) return `Il y a ${Math.floor(diffInSeconds / 86400)}j`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  className,
  showDetails = true,
  showActions = true,
  showMetadata = true,
  onRead,
  onDismiss,
  onClick,
  variant = 'default',
  loading = false,
}) => {
  const type = typeConfig[notification.type];
  const category = categoryConfig[notification.category];
  const priority = priorityConfig[notification.priority];
  const isExpired = notification.expiresAt && new Date(notification.expiresAt) < new Date();

  if (loading) {
    return (
      <Card className={cn("p-4 animate-pulse", className)}>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  const CardContent = () => (
    <Card 
      className={cn(
        "p-4 transition-all duration-200",
        !notification.isRead && "bg-blue-50 border-blue-200",
        isExpired && "opacity-60",
        onClick && "cursor-pointer hover:shadow-lg hover:scale-105",
        className
      )}
      onClick={() => onClick?.(notification)}
    >
      {/* En-tête avec icône et badges */}
      <div className="flex items-start space-x-3 mb-3">
        <div className={cn("flex-shrink-0 p-2 rounded-full border", type.color)}>
          {type.icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h3 className={cn(
              "font-semibold text-gray-900 truncate",
              variant === 'compact' ? "text-sm" : "text-base",
              !notification.isRead && "font-bold"
            )}>
              {notification.title}
            </h3>
            
            <div className="flex items-center space-x-2 ml-2">
              {!notification.isRead && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
              <Badge variant="outline" className={cn("text-xs", category.color)}>
                {category.label}
              </Badge>
              {notification.priority !== 'low' && (
                <Badge variant="outline" className={cn("text-xs", priority.color)}>
                  {priority.label}
                </Badge>
              )}
            </div>
          </div>
          
          <p className={cn(
            "text-gray-600 line-clamp-2",
            variant === 'compact' ? "text-xs" : "text-sm"
          )}>
            {notification.message}
          </p>
        </div>
      </div>

      {/* Métadonnées */}
      {showMetadata && notification.metadata && variant !== 'compact' && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {notification.metadata.userName && (
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="w-3 h-3" />
                <span>{notification.metadata.userName}</span>
              </div>
            )}
            {notification.metadata.moduleName && (
              <div className="flex items-center space-x-2 text-gray-600">
                <BookOpen className="w-3 h-3" />
                <span>{notification.metadata.moduleName}</span>
              </div>
            )}
            {notification.metadata.evaluationTitle && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Award className="w-3 h-3" />
                <span>{notification.metadata.evaluationTitle}</span>
              </div>
            )}
            {notification.metadata.amount && (
              <div className="flex items-center space-x-2 text-gray-600">
                <DollarSign className="w-3 h-3" />
                <span>{notification.metadata.amount}€</span>
              </div>
            )}
            {notification.metadata.dueDate && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="w-3 h-3" />
                <span>
                  {new Date(notification.metadata.dueDate).toLocaleDateString('fr-FR')}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Informations temporelles */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{getTimeAgo(notification.createdAt)}</span>
          {isExpired && (
            <Badge variant="outline" className="bg-red-100 text-red-700 text-xs">
              Expirée
            </Badge>
          )}
        </div>
        
        {notification.isActionable && (
          <div className="flex items-center space-x-1">
            <Badge variant="solid" className="bg-green-500 text-xs">
              Action requise
            </Badge>
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {!notification.isRead && onRead && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onRead(notification)}
              >
                Marquer comme lu
              </Button>
            )}
            
            {notification.actionUrl && notification.actionLabel && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => window.open(notification.actionUrl, '_blank')}
              >
                {notification.actionLabel}
              </Button>
            )}
          </div>
          
          {onDismiss && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDismiss(notification)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-4 h-4" />
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
              <span className="ml-1 font-medium capitalize">{notification.type}</span>
            </div>
            <div>
              <span className="text-gray-500">Priorité:</span>
              <span className="ml-1 font-medium">{priority.label}</span>
            </div>
            <div>
              <span className="text-gray-500">Créée:</span>
              <span className="ml-1 font-medium">
                {new Date(notification.createdAt).toLocaleDateString('fr-FR')}
              </span>
            </div>
            {notification.expiresAt && (
              <div>
                <span className="text-gray-500">Expire:</span>
                <span className="ml-1 font-medium">
                  {new Date(notification.expiresAt).toLocaleDateString('fr-FR')}
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
