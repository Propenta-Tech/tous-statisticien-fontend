"use client"

import React, { useState } from 'react';
import { Upload, FileText, X, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { SubmissionFormData, SubmissionFormErrors } from '@/types/forms';
import { useForm } from '@/hooks/useForm';

interface SubmissionFormProps {
  evaluationId: string;
  evaluationTitle: string;
  maxFileSize?: number; // en MB
  allowedFileTypes?: string[];
  onSuccess?: (submissionData: SubmissionFormData) => void;
  onError?: (error: string) => void;
  className?: string;
}

export const SubmissionForm: React.FC<SubmissionFormProps> = ({
  evaluationId,
  evaluationTitle,
  maxFileSize = 10, // 10MB par défaut
  allowedFileTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif'
  ],
  onSuccess,
  onError,
  className = '',
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const initialValues: SubmissionFormData = {
    evaluationId,
    files: [],
    notes: '',
  };

  const validationSchema = {
    files: {
      required: true,
      custom: (value: File[] | undefined) => {
        if (!value || value.length === 0) {
          return 'Au moins un fichier est requis';
        }
        
        for (let i = 0; i < value.length; i++) {
          const file = value[i];
          if (file.size > maxFileSize * 1024 * 1024) {
            return `Le fichier ${file.name} dépasse la taille maximale de ${maxFileSize}MB`;
          }
          if (!allowedFileTypes.includes(file.type)) {
            return `Le type de fichier ${file.name} n'est pas autorisé`;
          }
        }
        return undefined;
      }
    },
    notes: {
      maxLength: 1000,
      custom: (value: string | undefined) => {
        if (value && value.length > 1000) {
          return 'Les notes ne peuvent pas dépasser 1000 caractères';
        }
        return undefined;
      }
    }
  };

  const handleSubmit = async (values: SubmissionFormData) => {
    try {
      setIsSubmitting(true);
      
      // Simulation d'un appel API de soumission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowSuccess(true);
      onSuccess?.(values);
      
      // Reset du formulaire après 3 secondes
      setTimeout(() => {
        setShowSuccess(false);
        form.resetForm();
      }, 3000);
      
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Erreur lors de la soumission');
    } finally {
      setIsSubmitting(false);
    }
  };

  const form = useForm({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => 
      file.size <= maxFileSize * 1024 * 1024 && 
      allowedFileTypes.includes(file.type)
    );
    
    if (validFiles.length > 0) {
      form.setFieldValue('files', [...form.values.files, ...validFiles]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      form.setFieldValue('files', [...form.values.files, ...files]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = form.values.files.filter((_, i) => i !== index);
    form.setFieldValue('files', newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('image')) return '🖼️';
    return '📎';
  };

  if (showSuccess) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-6 text-center ${className}`}>
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-green-800 mb-2">
          Soumission effectuée avec succès !
        </h3>
        <p className="text-green-600">
          Votre évaluation "{evaluationTitle}" a été soumise.
        </p>
        <p className="text-sm text-green-500 mt-2">
          Vous recevrez une notification une fois corrigée.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Soumettre votre évaluation
        </h2>
        <p className="text-gray-600">
          Évaluation: <span className="font-medium">{evaluationTitle}</span>
        </p>
      </div>

      <form onSubmit={form.handleSubmit} className="space-y-6">
        {/* Zone de dépôt de fichiers */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fichiers à soumettre *
          </label>
          
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive 
                ? 'border-primary-navy bg-primary-navy/5' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleFileDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              Glissez-déposez vos fichiers ici ou{' '}
              <label className="text-primary-navy hover:underline cursor-pointer">
                cliquez pour sélectionner
                <input
                  type="file"
                  multiple
                  accept={allowedFileTypes.join(',')}
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </p>
            <p className="text-sm text-gray-500">
              Types autorisés: PDF, Word, Images • Taille max: {maxFileSize}MB
            </p>
          </div>

          {form.touched.files && form.errors.files && (
            <p className="text-accent-red text-sm mt-2 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {form.errors.files}
            </p>
          )}
        </div>

        {/* Liste des fichiers sélectionnés */}
        {form.values.files.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">
              Fichiers sélectionnés ({form.values.files.length})
            </h4>
            {form.values.files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getFileIcon(file.type)}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-accent-red transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Notes optionnelles */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (optionnel)
          </label>
          <Textarea
            value={form.values.notes || ''}
            onChange={(value: string) => form.setFieldValue('notes', value)}
            onBlur={() => form.setFieldTouched('notes')}
            error={form.touched.notes ? form.errors.notes : undefined}
            placeholder="Ajoutez des commentaires ou explications sur votre soumission..."
            rows={4}
            maxLength={1000}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            {(form.values.notes || '').length}/1000 caractères
          </p>
        </div>

        {/* Informations importantes */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-800 mb-1">
                Informations importantes
              </h4>
              <ul className="text-xs text-blue-600 space-y-1">
                <li>• Vérifiez que tous vos fichiers sont lisibles avant la soumission</li>
                <li>• Vous ne pourrez plus modifier votre soumission une fois envoyée</li>
                <li>• Assurez-vous que votre nom est visible sur vos documents</li>
                <li>• La soumission sera fermée à la date limite de l'évaluation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bouton de soumission */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          disabled={!form.isValid || isSubmitting || form.values.files.length === 0}
          className="mt-6"
        >
          {isSubmitting ? 'Soumission en cours...' : 'Soumettre l\'évaluation'}
        </Button>
      </form>
    </div>
  );
};
