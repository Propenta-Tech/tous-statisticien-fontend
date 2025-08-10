"use client"
import React from 'react';
import { cn } from '@/lib/utils';
import { Star, Quote, User, Calendar, Award } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';

interface Testimonial {
  id: string;
  authorName: string;
  authorEmail: string;
  authorRole: 'student' | 'formateur' | 'alumni';
  authorAvatar?: string;
  content: string;
  rating: number;
  courseName?: string;
  moduleName?: string;
  createdAt: string;
  isVerified: boolean;
  isFeatured: boolean;
  helpfulCount: number;
  tags?: string[];
  metadata?: {
    completionDate?: string;
    grade?: string;
    timeSpent?: number;
    achievements?: string[];
  };
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
  showDetails?: boolean;
  showMetadata?: boolean;
  showActions?: boolean;
  onHelpful?: (testimonial: Testimonial) => void;
  onClick?: (testimonial: Testimonial) => void;
  variant?: 'default' | 'compact' | 'detailed';
  loading?: boolean;
}

const roleConfig = {
  student: {
    label: 'Étudiant',
    color: 'bg-blue-100 text-blue-700',
    icon: <User className="w-4 h-4" />,
  },
  formateur: {
    label: 'Formateur',
    color: 'bg-green-100 text-green-700',
    icon: <Award className="w-4 h-4" />,
  },
  alumni: {
    label: 'Alumni',
    color: 'bg-purple-100 text-purple-700',
    icon: <Award className="w-4 h-4" />,
  },
};

const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        className={cn(
          "w-4 h-4",
          i <= rating ? "text-amber-400 fill-current" : "text-gray-300"
        )}
      />
    );
  }
  return stars;
};

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  className,
  showDetails = true,
  showMetadata = true,
  showActions = true,
  onHelpful,
  onClick,
  variant = 'default',
  loading = false,
}) => {
  const role = roleConfig[testimonial.authorRole];

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
        testimonial.isFeatured && "ring-2 ring-amber-200 bg-amber-50",
        className
      )}
      onClick={() => onClick?.(testimonial)}
    >
      {/* En-tête avec auteur et note */}
      <div className="flex items-start space-x-3 mb-4">
                 <Avatar
           src={testimonial.authorAvatar}
           alt={testimonial.authorName}
           size="md"
         >
           {testimonial.authorName.charAt(0).toUpperCase()}
         </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h3 className="font-semibold text-gray-900 truncate">
                {testimonial.authorName}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className={cn("text-xs", role.color)}>
                  {role.icon}
                  <span className="ml-1">{role.label}</span>
                </Badge>
                {testimonial.isVerified && (
                  <Badge variant="solid" className="bg-green-500 text-xs">
                    Vérifié
                  </Badge>
                )}
                {testimonial.isFeatured && (
                  <Badge variant="solid" className="bg-amber-500 text-xs">
                    Coup de cœur
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-1 ml-2">
              {renderStars(testimonial.rating)}
            </div>
          </div>
          
          {testimonial.courseName && (
            <p className="text-xs text-gray-500">
              Cours: {testimonial.courseName}
              {testimonial.moduleName && ` - ${testimonial.moduleName}`}
            </p>
          )}
        </div>
      </div>

      {/* Contenu du témoignage */}
      <div className="mb-4">
        <div className="flex items-start space-x-2">
          <Quote className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
          <blockquote className={cn(
            "text-gray-700 italic",
            variant === 'compact' ? "text-sm" : "text-base"
          )}>
            "{testimonial.content}"
          </blockquote>
        </div>
      </div>

      {/* Métadonnées */}
      {showMetadata && testimonial.metadata && variant !== 'compact' && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-3 text-xs">
            {testimonial.metadata.completionDate && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="w-3 h-3" />
                <span>Terminé le {new Date(testimonial.metadata.completionDate).toLocaleDateString('fr-FR')}</span>
              </div>
            )}
            {testimonial.metadata.grade && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Award className="w-3 h-3" />
                <span>Note: {testimonial.metadata.grade}</span>
              </div>
            )}
            {testimonial.metadata.timeSpent && (
              <div className="flex items-center space-x-2 text-gray-600">
                <span>⏱️ {testimonial.metadata.timeSpent} heures</span>
              </div>
            )}
          </div>
          
          {testimonial.metadata.achievements && testimonial.metadata.achievements.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium text-gray-700 mb-1">Réalisations:</p>
              <div className="flex flex-wrap gap-1">
                {testimonial.metadata.achievements.map((achievement, index) => (
                  <Badge key={index} variant="ghost" className="text-xs">
                    {achievement}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      {testimonial.tags && testimonial.tags.length > 0 && variant !== 'compact' && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {testimonial.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Actions et informations */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <span>
            {new Date(testimonial.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>
          
          {showActions && onHelpful && (
            <button
              className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onHelpful(testimonial);
              }}
            >
              <span>👍</span>
              <span>{testimonial.helpfulCount}</span>
            </button>
          )}
        </div>
        
        {testimonial.rating && (
          <div className="text-xs text-gray-500">
            {testimonial.rating}/5 étoiles
          </div>
        )}
      </div>

      {/* Variant détaillé */}
      {variant === 'detailed' && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-500">Rôle:</span>
              <span className="ml-1 font-medium">{role.label}</span>
            </div>
            <div>
              <span className="text-gray-500">Note:</span>
              <span className="ml-1 font-medium">{testimonial.rating}/5</span>
            </div>
            <div>
              <span className="text-gray-500">Date:</span>
              <span className="ml-1 font-medium">
                {new Date(testimonial.createdAt).toLocaleDateString('fr-FR')}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Utile:</span>
              <span className="ml-1 font-medium">{testimonial.helpfulCount} fois</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );

  return <CardContent />;
};
