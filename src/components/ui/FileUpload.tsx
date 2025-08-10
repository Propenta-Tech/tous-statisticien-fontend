// ==============================================
// COMPOSANT FILEUPLOAD - TOUS STATISTICIEN ACADEMY
// ==============================================
'use client';

import React, { useState, useRef, useCallback } from 'react';
import { 
  Upload, 
  X, 
  File, 
  Image, 
  Video, 
  Music, 
  FileText,
  AlertCircle,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FileUploadProps, UploadedFile } from '@/types/components';
import Button from './Button';
import ProgressBar from './ProgressBar';

const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      className,
      accept,
      multiple = false,
      maxSize = 10 * 1024 * 1024, // 10MB par défaut
      maxFiles = 1,
      disabled = false,
      loading = false,
      error,
      label,
      description,
      required = false,
      showPreview = true,
      onFilesChange,
      onUpload,
      onError,
      variant = 'dropzone',
      size = 'md',
      ...props
    },
    ref
  ) => {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Obtenir l'icône selon le type de fichier
    const getFileIcon = (file: File) => {
      const type = file.type;
      
      if (type.startsWith('image/')) return Image;
      if (type.startsWith('video/')) return Video;
      if (type.startsWith('audio/')) return Music;
      if (type.includes('pdf') || type.includes('document') || type.includes('text')) return FileText;
      return File;
    };

    // Formater la taille du fichier
    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    };

    // Valider les fichiers
    const validateFiles = (fileList: FileList | File[]) => {
      const fileArray = Array.from(fileList);
      const errors: string[] = [];

      // Vérifier le nombre de fichiers
      if (!multiple && fileArray.length > 1) {
        errors.push('Un seul fichier est autorisé');
      }

      if (files.length + fileArray.length > maxFiles) {
        errors.push(`Maximum ${maxFiles} fichier(s) autorisé(s)`);
      }

      // Vérifier chaque fichier
      fileArray.forEach((file, index) => {
        // Taille
        if (file.size > maxSize) {
          errors.push(`"${file.name}" est trop volumineux (max: ${formatFileSize(maxSize)})`);
        }

        // Type
        if (accept && !accept.split(',').some(type => {
          const trimmedType = type.trim();
          if (trimmedType.startsWith('.')) {
            return file.name.toLowerCase().endsWith(trimmedType.toLowerCase());
          }
          return file.type.match(trimmedType.replace('*', '.*'));
        })) {
          errors.push(`"${file.name}" n'est pas un type de fichier autorisé`);
        }
      });

      return errors;
    };

    // Traiter les fichiers
    const processFiles = useCallback((fileList: FileList | File[]) => {
      const fileArray = Array.from(fileList);
      const errors = validateFiles(fileArray);

      if (errors.length > 0) {
        onError?.(errors);
        return;
      }

      const newFiles: UploadedFile[] = fileArray.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'pending',
        progress: 0,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      }));

      const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles);

      // Upload automatique si fonction fournie
      if (onUpload) {
        newFiles.forEach(uploadFile);
      }
    }, [files, multiple, maxSize, maxFiles, accept, onFilesChange, onUpload]);

    // Upload d'un fichier
    const uploadFile = async (uploadedFile: UploadedFile) => {
      if (!onUpload) return;

      try {
        // Mettre à jour le statut
        setFiles(prev => prev.map(f => 
          f.id === uploadedFile.id 
            ? { ...f, status: 'uploading', progress: 0 }
            : f
        ));

        // Simuler la progression (remplacer par vraie logique d'upload)
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const currentProgress = prev[uploadedFile.id] || 0;
            const newProgress = Math.min(currentProgress + Math.random() * 30, 100);
            
            if (newProgress >= 100) {
              clearInterval(progressInterval);
              
              // Marquer comme terminé
              setFiles(prevFiles => prevFiles.map(f => 
                f.id === uploadedFile.id 
                  ? { ...f, status: 'success', progress: 100 }
                  : f
              ));
              
              return { ...prev, [uploadedFile.id]: 100 };
            }
            
            // Mettre à jour la progression
            setFiles(prevFiles => prevFiles.map(f => 
              f.id === uploadedFile.id 
                ? { ...f, progress: newProgress }
                : f
            ));
            
            return { ...prev, [uploadedFile.id]: newProgress };
          });
        }, 200);

        // Appeler la fonction d'upload
        await onUpload(uploadedFile.file, (progress) => {
          setUploadProgress(prev => ({ ...prev, [uploadedFile.id]: progress }));
          setFiles(prevFiles => prevFiles.map(f => 
            f.id === uploadedFile.id 
              ? { ...f, progress }
              : f
          ));
        });

      } catch (error) {
        setFiles(prev => prev.map(f => 
          f.id === uploadedFile.id 
            ? { ...f, status: 'error', error: 'Erreur lors de l\'upload' }
            : f
        ));
      }
    };

    // Supprimer un fichier
    const removeFile = (fileId: string) => {
      const updatedFiles = files.filter(f => f.id !== fileId);
      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles);
      
      // Nettoyer l'URL de prévisualisation
      const file = files.find(f => f.id === fileId);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
    };

    // Gérer le drag & drop
    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragOver(true);
      }
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      
      if (disabled || loading) return;
      
      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        processFiles(droppedFiles);
      }
    };

    // Gérer la sélection de fichiers
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (selectedFiles && selectedFiles.length > 0) {
        processFiles(selectedFiles);
      }
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    // Ouvrir le sélecteur de fichiers
    const openFileSelector = () => {
      if (!disabled && !loading && fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    // Classes selon la taille
    const sizeClasses = {
      sm: 'p-4 text-sm',
      md: 'p-6 text-base',
      lg: 'p-8 text-lg',
    };

    // Classes selon la variante
    const getVariantClasses = () => {
      if (variant === 'button') {
        return 'inline-flex items-center justify-center';
      }
      
      return cn(
        'border-2 border-dashed rounded-lg transition-all duration-200',
        'flex flex-col items-center justify-center text-center',
        sizeClasses[size],
        isDragOver && !disabled
          ? 'border-primary-navy bg-primary-navy/5'
          : disabled
          ? 'border-gray-200 bg-gray-50'
          : 'border-gray-300 hover:border-gray-400',
        error && 'border-accent-red bg-red-50'
      );
    };

    if (variant === 'button') {
      return (
        <div className={cn('file-upload-button', className)}>
          {label && (
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label}
              {required && <span className="text-accent-red ml-1">*</span>}
            </label>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileSelect}
            disabled={disabled || loading}
            className="sr-only"
            {...props}
          />
          
          <Button
            onClick={openFileSelector}
            disabled={disabled || loading}
            loading={loading}
            icon={Upload}
            variant="outline"
            size={size}
          >
            Sélectionner {multiple ? 'des fichiers' : 'un fichier'}
          </Button>
          
          {description && (
            <p className="mt-1 text-xs text-gray-600">{description}</p>
          )}
          
          {error && (
            <p className="mt-1 text-xs text-accent-red">{error}</p>
          )}
          
          {/* Liste des fichiers */}
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map(file => (
                <FileItem
                  key={file.id}
                  file={file}
                  onRemove={() => removeFile(file.id)}
                  showPreview={showPreview}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('file-upload', className)} {...props}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-accent-red ml-1">*</span>}
          </label>
        )}

        {/* Zone de drop */}
        <div
          className={getVariantClasses()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileSelector}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileSelect}
            disabled={disabled || loading}
            className="sr-only"
            {...props}
          />

          <Upload className={cn(
            'mx-auto mb-2',
            size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10',
            disabled ? 'text-gray-400' : 'text-gray-500'
          )} />

          <div className="space-y-1">
            <p className={cn(
              'font-medium',
              disabled ? 'text-gray-400' : 'text-gray-700'
            )}>
              {isDragOver 
                ? 'Déposez vos fichiers ici' 
                : 'Cliquez pour sélectionner ou glissez-déposez'}
            </p>
            
            {description && (
              <p className={cn(
                'text-sm',
                disabled ? 'text-gray-400' : 'text-gray-600'
              )}>
                {description}
              </p>
            )}
            
            <p className={cn(
              'text-xs',
              disabled ? 'text-gray-400' : 'text-gray-500'
            )}>
              {accept && `Types acceptés: ${accept}`}
              {maxSize && ` • Taille max: ${formatFileSize(maxSize)}`}
              {multiple && ` • Max ${maxFiles} fichier(s)`}
            </p>
          </div>
        </div>

        {error && (
          <p className="mt-2 text-xs text-accent-red flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {error}
          </p>
        )}

        {/* Liste des fichiers */}
        {files.length > 0 && (
          <div className="mt-4 space-y-3">
            {files.map(file => (
              <FileItem
                key={file.id}
                file={file}
                onRemove={() => removeFile(file.id)}
                showPreview={showPreview}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';

// Composant pour afficher un fichier
const FileItem: React.FC<{
  file: UploadedFile;
  onRemove: () => void;
  showPreview: boolean;
}> = ({ file, onRemove, showPreview }) => {
  const Icon = getFileIcon(file.file);

  return (
    <div className="flex items-center p-3 bg-gray-50 rounded-lg border">
      {/* Prévisualisation ou icône */}
      <div className="flex-shrink-0 mr-3">
        {showPreview && file.preview ? (
          <img 
            src={file.preview} 
            alt={file.name}
            className="w-10 h-10 object-cover rounded"
          />
        ) : (
          <Icon className="w-8 h-8 text-gray-500" />
        )}
      </div>

      {/* Informations du fichier */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {file.name}
        </p>
        <p className="text-xs text-gray-500">
          {formatFileSize(file.size)}
        </p>

        {/* Barre de progression */}
        {file.status === 'uploading' && (
          <div className="mt-1">
            <ProgressBar
              value={file.progress}
              size="sm"
              color="primary"
              showPercentage={false}
            />
          </div>
        )}

        {/* Messages de statut */}
        {file.status === 'error' && (
          <p className="text-xs text-red-600 mt-1 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            {file.error || 'Erreur d\'upload'}
          </p>
        )}

        {file.status === 'success' && (
          <p className="text-xs text-green-600 mt-1 flex items-center">
            <Check className="w-3 h-3 mr-1" />
            Upload terminé
          </p>
        )}
      </div>

      {/* Bouton de suppression */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};

// Hook pour gérer les fichiers
const useFileUpload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const addFiles = (newFiles: UploadedFile[]) => {
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const clearFiles = () => {
    setFiles([]);
  };

  const getFilesByStatus = (status: UploadedFile['status']) => {
    return files.filter(f => f.status === status);
  };

  return {
    files,
    setFiles,
    addFiles,
    removeFile,
    clearFiles,
    getFilesByStatus,
    hasFiles: files.length > 0,
    uploadedFiles: getFilesByStatus('success'),
    pendingFiles: getFilesByStatus('pending'),
    uploadingFiles: getFilesByStatus('uploading'),
    errorFiles: getFilesByStatus('error'),
  };
};

function getFileIcon(file: File) {
  const type = file.type;
  
  if (type.startsWith('image/')) return Image;
  if (type.startsWith('video/')) return Video;
  if (type.startsWith('audio/')) return Music;
  if (type.includes('pdf') || type.includes('document') || type.includes('text')) return FileText;
  return File;
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export { FileUpload, FileItem, useFileUpload };
export default FileUpload;