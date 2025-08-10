"use client"
import React from 'react';
import { cn } from '@/lib/utils';
import { Award, Trophy, Star, Target, Zap, Heart, BookOpen, Users, Clock, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'academic' | 'social' | 'engagement' | 'milestone' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress?: number;
  maxProgress?: number;
  unlockedAt?: string;
  points?: number;
  color?: string;
  animation?: boolean;
}

interface AchievementCardProps {
  achievement: Achievement;
  className?: string;
  showProgress?: boolean;
  showUnlockDate?: boolean;
  showPoints?: boolean;
  onClick?: (achievement: Achievement) => void;
  variant?: 'default' | 'compact' | 'detailed';
  loading?: boolean;
}

const rarityConfig = {
  common: {
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    iconColor: 'text-gray-600',
    badgeColor: 'bg-gray-500',
    points: 10,
  },
  rare: {
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    iconColor: 'text-blue-600',
    badgeColor: 'bg-blue-500',
    points: 25,
  },
  epic: {
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    iconColor: 'text-purple-600',
    badgeColor: 'bg-purple-500',
    points: 50,
  },
  legendary: {
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    iconColor: 'text-amber-600',
    badgeColor: 'bg-amber-500',
    points: 100,
  },
};

const categoryConfig = {
  academic: {
    icon: <BookOpen className="w-5 h-5" />,
    label: 'Académique',
  },
  social: {
    icon: <Users className="w-5 h-5" />,
    label: 'Social',
  },
  engagement: {
    icon: <TrendingUp className="w-5 h-5" />,
    label: 'Engagement',
  },
  milestone: {
    icon: <Target className="w-5 h-5" />,
    label: 'Étape',
  },
  special: {
    icon: <Star className="w-5 h-5" />,
    label: 'Spécial',
  },
};

const getAchievementIcon = (iconName: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    award: <Award className="w-6 h-6" />,
    trophy: <Trophy className="w-6 h-6" />,
    star: <Star className="w-6 h-6" />,
    target: <Target className="w-6 h-6" />,
    zap: <Zap className="w-6 h-6" />,
    heart: <Heart className="w-6 h-6" />,
    book: <BookOpen className="w-6 h-6" />,
    users: <Users className="w-6 h-6" />,
    clock: <Clock className="w-6 h-6" />,
    trending: <TrendingUp className="w-6 h-6" />,
  };
  return iconMap[iconName] || <Award className="w-6 h-6" />;
};

export const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  className,
  showProgress = true,
  showUnlockDate = true,
  showPoints = true,
  onClick,
  variant = 'default',
  loading = false,
}) => {
  const rarity = rarityConfig[achievement.rarity];
  const category = categoryConfig[achievement.category];
  const isUnlocked = !!achievement.unlockedAt;
  const progress = achievement.progress || 0;
  const maxProgress = achievement.maxProgress || 1;
  const progressPercentage = Math.min((progress / maxProgress) * 100, 100);

  if (loading) {
    return (
      <Card className={cn("p-4 animate-pulse", className)}>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </Card>
    );
  }

  const CardContent = () => (
    <Card 
      className={cn(
        "p-4 transition-all duration-200",
        isUnlocked ? "bg-white shadow-soft" : "bg-gray-50 opacity-75",
        onClick && "cursor-pointer hover:shadow-lg hover:scale-105",
        className
      )}
      onClick={() => onClick?.(achievement)}
    >
      <div className="flex items-start space-x-3">
        {/* Icône de l'achievement */}
        <div className={cn(
          "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2",
          rarity.color,
          achievement.animation && isUnlocked && "animate-pulse"
        )}>
          <div className={cn("flex items-center justify-center", rarity.iconColor)}>
            {getAchievementIcon(achievement.icon)}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* En-tête avec titre et badges */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-semibold text-gray-900 truncate",
                variant === 'compact' ? "text-sm" : "text-base"
              )}>
                {achievement.title}
              </h3>
              {variant !== 'compact' && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {achievement.description}
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-2 ml-2">
              {/* Badge de rareté */}
              <Badge 
                variant="solid" 
                className={cn("text-xs", rarity.badgeColor)}
              >
                {achievement.rarity}
              </Badge>
              
              {/* Points */}
              {showPoints && achievement.points && (
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Star className="w-3 h-3 text-amber-500" />
                  <span>{achievement.points}</span>
                </div>
              )}
            </div>
          </div>

          {/* Progression */}
          {showProgress && achievement.maxProgress && achievement.maxProgress > 1 && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Progression</span>
                <span>{progress} / {maxProgress}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={cn(
                    "h-2 rounded-full transition-all duration-500",
                    isUnlocked ? "bg-green-500" : "bg-blue-500"
                  )}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Informations supplémentaires */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* Catégorie */}
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                {category.icon}
                <span>{category.label}</span>
              </div>
              
              {/* Date de déblocage */}
              {showUnlockDate && isUnlocked && achievement.unlockedAt && (
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>
                    {new Date(achievement.unlockedAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* Statut */}
            <div className="flex items-center">
              {isUnlocked ? (
                <div className="flex items-center space-x-1 text-xs text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Débloqué</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>Verrouillé</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Variant détaillé */}
      {variant === 'detailed' && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-500">Catégorie:</span>
              <span className="ml-1 font-medium">{category.label}</span>
            </div>
            <div>
              <span className="text-gray-500">Rareté:</span>
              <span className="ml-1 font-medium capitalize">{achievement.rarity}</span>
            </div>
            {achievement.points && (
              <div>
                <span className="text-gray-500">Points:</span>
                <span className="ml-1 font-medium">{achievement.points}</span>
              </div>
            )}
            {isUnlocked && achievement.unlockedAt && (
              <div>
                <span className="text-gray-500">Débloqué le:</span>
                <span className="ml-1 font-medium">
                  {new Date(achievement.unlockedAt).toLocaleDateString('fr-FR')}
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
