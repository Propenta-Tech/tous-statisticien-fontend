"use client"
import React from 'react';
import { cn } from '@/lib/utils';
import { FileText, Video, Image, File, Download, Eye, Calendar, User, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface Resource {
  id: string;
  title: string;
  description?: string;
  type: 'document' | 'video' | 'image' | 'audio' | 'archive' | 'other';
  fileType: string;
  fileSize: number;
  fileUrl: string;
  thumbnailUrl?: string;
  duration?: number; // pour les vidéos/audio en secondes
  uploadedBy: string;
  uploadedAt: string;
  moduleId?: string;
  moduleName?: string;
  tags?: string[];
  isPublic: boolean;
  downloadCount: number;
  viewCount: number;
  isDownloadable: boolean;
  isPreviewable: boolean;
}

interface ResourceCardProps {
  resource: Resource;
  className?: string;
  showDetails?: boolean;
  showActions?: boolean;
  showStats?: boolean;
  onDownload?: (resource: Resource) => void;
  onPreview?: (resource: Resource) => void;
  onClick?: (resource: Resource) => void;
  variant?: 'default' | 'compact' | 'detailed';
  loading?: boolean;
  userRole?: 'student' | 'formateur' | 'admin';
}

const typeConfig = {
  document: {
    icon: <FileText className="w-5 h-5" />,
    label: 'Document',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    badgeColor: 'bg-blue-500',
  },
  video: {
    icon: <Video className="w-5 h-5" />,
    label: 'Vidéo',
    color: 'bg-red-100 text-red-700 border-red-200',
    badgeColor: 'bg-red-500',
  },
  image: {
    icon: <Image className="w-5 h-5" />,
    label: 'Image',
    color: 'bg-green-100 text-green-700 border-green-200',
    badgeColor: 'bg-green-500',
  },
  audio: {
    icon: <File className="w-5 h-5" />,
    label: 'Audio',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    badgeColor: 'bg-purple-500',
  },
  archive: {
    icon: <File className="w-5 h-5" />,
    label: 'Archive',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    badgeColor: 'bg-amber-500',
  },
  other: {
    icon: <File className="w-5 h-5" />,
    label: 'Autre',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    badgeColor: 'bg-gray-500',
  },
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  className,
  showDetails = true,
  showActions = true,
  showStats = true,
  onDownload,
  onPreview,
  onClick,
  variant = 'default',
  loading = false,
  userRole = 'student',
}) => {
  const type = typeConfig[resource.type];
  const fileSize = formatFileSize(resource.fileSize);
  const duration = resource.duration ? formatDuration(resource.duration) : null;

  if (loading) {
    return (
      <Card className={cn("p-4 animate-pulse", className)}>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
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
        onClick && "cursor-pointer hover:shadow-lg hover:scale-105",
        className
      )}
      onClick={() => onClick?.(resource)}
    >
      {/* En-tête avec icône et titre */}
      <div className="flex items-start space-x-3 mb-3">
        <div className={cn("flex-shrink-0 p-3 rounded-lg border", type.color)}>
          {type.icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h3 className={cn(
              "font-semibold text-gray-900 truncate",
              variant === 'compact' ? "text-sm" : "text-base"
            )}>
              {resource.title}
            </h3>
            
            <div className="flex items-center space-x-2 ml-2">
              <Badge variant="solid" className={type.badgeColor}>
                {type.label}
              </Badge>
              {!resource.isPublic && (
                <Badge variant="outline" className="bg-gray-100 text-gray-700">
                  Privé
                </Badge>
              )}
            </div>
          </div>
          
          {resource.moduleName && (
            <p className="text-xs text-gray-500 mb-1">
              Module: {resource.moduleName}
            </p>
          )}
          
          {showDetails && resource.description && variant !== 'compact' && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {resource.description}
            </p>
          )}
        </div>
      </div>

      {/* Informations du fichier */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <File className="w-3 h-3" />
          <span>{resource.fileType.toUpperCase()}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <span>{fileSize}</span>
        </div>

        {duration && (
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <Video className="w-3 h-3" />
            <span>{duration}</span>
          </div>
        )}

        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <User className="w-3 h-3" />
          <span>{resource.uploadedBy}</span>
        </div>

        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <Calendar className="w-3 h-3" />
          <span>
            {new Date(resource.uploadedAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>
      </div>

      {/* Statistiques */}
      {showStats && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-center space-x-2">
              <Eye className="w-3 h-3 text-gray-500" />
              <span className="text-gray-600">{resource.viewCount} vues</span>
            </div>
            <div className="flex items-center space-x-2">
              <Download className="w-3 h-3 text-gray-500" />
              <span className="text-gray-600">{resource.downloadCount} téléchargements</span>
            </div>
          </div>
        </div>
      )}

      {/* Tags */}
      {resource.tags && resource.tags.length > 0 && variant !== 'compact' && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {resource.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="ghost" className="text-xs">
                {tag}
              </Badge>
            ))}
            {resource.tags.length > 3 && (
              <Badge variant="ghost" className="text-xs">
                +{resource.tags.length - 3}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {resource.isPreviewable && onPreview && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onPreview(resource)}
              >
                <Eye className="w-4 h-4 mr-1" />
                Aperçu
              </Button>
            )}
            
            {resource.isDownloadable && onDownload && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDownload(resource)}
              >
                <Download className="w-4 h-4 mr-1" />
                Télécharger
              </Button>
            )}
          </div>
          
          {onClick && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onClick(resource)}
            >
              Voir détails
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
            <div>
              <span className="text-gray-500">Taille:</span>
              <span className="ml-1 font-medium">{fileSize}</span>
            </div>
            {duration && (
              <div>
                <span className="text-gray-500">Durée:</span>
                <span className="ml-1 font-medium">{duration}</span>
              </div>
            )}
            <div>
              <span className="text-gray-500">Uploadé par:</span>
              <span className="ml-1 font-medium">{resource.uploadedBy}</span>
            </div>
            <div>
              <span className="text-gray-500">Date:</span>
              <span className="ml-1 font-medium">
                {new Date(resource.uploadedAt).toLocaleDateString('fr-FR')}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Visibilité:</span>
              <span className="ml-1 font-medium">
                {resource.isPublic ? 'Publique' : 'Privée'}
              </span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );

  return <CardContent />;
};
