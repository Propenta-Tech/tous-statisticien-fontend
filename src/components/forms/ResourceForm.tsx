"use client"

import React, { useState } from 'react';
import { toast } from 'sonner';
import { 
  FileText, 
  Upload, 
  Link, 
  Save, 
  Loader2, 
  Plus,
  Edit3,
  Trash2,
  File,
  Image,
  Video,
  BookOpen,
  Tag,
  Users
} from 'lucide-react';

interface ResourceFormProps {
  initialData?: {
    id?: string;
    title: string;
    description: string;
    type: 'document' | 'video' | 'link' | 'image' | 'other';
    category: string;
    tags: string[];
    isPublic: boolean;
    allowDownload: boolean;
    fileUrl?: string;
    externalUrl?: string;
    fileSize?: number;
    mimeType?: string;
    thumbnail?: string;
  };
  mode?: 'create' | 'edit';
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
  className?: string;
}

export const ResourceForm: React.FC<ResourceFormProps> = ({
  initialData = {
    title: '',
    description: '',
    type: 'document',
    category: '',
    tags: [],
    isPublic: true,
    allowDownload: true
  },
  mode = 'create',
  onSuccess,
  onCancel,
  className = ''
}) => {
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const resourceTypeOptions = [
    { value: 'document', label: 'Document', icon: FileText, color: 'bg-blue-100 text-blue-800' },
    { value: 'video', label: 'Vidéo', icon: Video, color: 'bg-red-100 text-red-800' },
    { value: 'link', label: 'Lien externe', icon: Link, color: 'bg-green-100 text-green-800' },
    { value: 'image', label: 'Image', icon: Image, color: 'bg-purple-100 text-purple-800' },
    { value: 'other', label: 'Autre', icon: File, color: 'bg-gray-100 text-gray-800' }
  ];

  const categoryOptions = [
    'Cours',
    'Exercices',
    'Corrigés',
    'Supports de cours',
    'Vidéos',
    'Articles',
    'Outils',
    'Autre'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      
      // Mettre à jour le type de ressource basé sur le type de fichier
      let resourceType = 'other';
      if (file.type.startsWith('image/')) resourceType = 'image';
      else if (file.type.startsWith('video/')) resourceType = 'video';
      else if (file.type.includes('pdf') || file.type.includes('document')) resourceType = 'document';
      
      setFormData(prev => ({
        ...prev,
        type: resourceType as any,
        fileSize: file.size,
        mimeType: file.type
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Champs requis manquants', {
        description: 'Veuillez remplir tous les champs obligatoires',
        className: 'bg-red-50 text-red-900 border-red-200'
      });
      return;
    }

    if (formData.type === 'link' && !formData.externalUrl?.trim()) {
      toast.error('URL externe requise', {
        description: 'Veuillez fournir une URL pour ce type de ressource',
        className: 'bg-red-50 text-red-900 border-red-200'
      });
      return;
    }

    if (formData.type !== 'link' && !uploadedFile && !formData.fileUrl) {
      toast.error('Fichier requis', {
        description: 'Veuillez télécharger un fichier ou fournir une URL de fichier',
        className: 'bg-red-50 text-red-900 border-red-200'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Ici, vous appelleriez votre API pour créer/modifier la ressource
      // Simulons un délai d'API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(mode === 'create' ? 'Ressource créée !' : 'Ressource modifiée !', {
        description: mode === 'create' 
          ? 'Votre ressource a été créée avec succès'
          : 'Votre ressource a été modifiée avec succès',
        className: 'bg-green-50 text-green-900 border-green-200'
      });
      
      onSuccess?.(formData);
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde', {
        description: 'Veuillez réessayer plus tard',
        className: 'bg-red-50 text-red-900 border-red-200'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`w-full max-w-3xl mx-auto ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <FileText className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-blue-900 mb-2">
          {mode === 'create' ? 'Ajouter une ressource' : 'Modifier la ressource'}
        </h1>
        <p className="text-gray-600">
          {mode === 'create' 
            ? 'Partagez des documents, vidéos et liens avec vos étudiants'
            : 'Modifiez les informations de votre ressource'
          }
        </p>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de base */}
        <div className="bg-white border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Informations de base
          </h3>
          
          <div className="space-y-4">
            {/* Titre */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-blue-900 mb-2">
                Titre de la ressource *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                placeholder="Ex: Cours complet sur les probabilités"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-blue-900 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white resize-none"
                placeholder="Décrivez le contenu et l'utilité de cette ressource..."
              />
            </div>

            {/* Type et catégorie */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-blue-900 mb-2">
                  Type de ressource *
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                >
                  {resourceTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-blue-900 mb-2">
                  Catégorie
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu de la ressource */}
        <div className="bg-white border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Contenu de la ressource
          </h3>
          
          <div className="space-y-4">
            {/* Upload de fichier */}
            {formData.type !== 'link' && (
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-3">
                  {formData.type === 'document' ? 'Document' : 
                   formData.type === 'video' ? 'Vidéo' : 
                   formData.type === 'image' ? 'Image' : 'Fichier'} *
                </label>
                
                {/* Fichier téléchargé */}
                {uploadedFile && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <File className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-900">{uploadedFile.name}</p>
                          <p className="text-sm text-green-700">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUploadedFile(null)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Zone d'upload */}
                <div className="border-2 border-dashed border-blue-200 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <label htmlFor="fileUpload" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-800 font-medium">
                      {uploadedFile ? 'Changer de fichier' : 'Cliquez pour télécharger'}
                    </span>
                    <span className="text-gray-500 text-sm block mt-1">
                      {formData.type === 'document' ? 'PDF, Word, PowerPoint, Excel' :
                       formData.type === 'video' ? 'MP4, AVI, MOV, WebM' :
                       formData.type === 'image' ? 'JPG, PNG, GIF, SVG' :
                       'Tous types de fichiers'} (max 100MB)
                    </span>
                  </label>
                  <input
                    id="fileUpload"
                    type="file"
                    accept={formData.type === 'document' ? '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx' :
                            formData.type === 'video' ? '.mp4,.avi,.mov,.webm' :
                            formData.type === 'image' ? '.jpg,.jpeg,.png,.gif,.svg' : '*'}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            )}

            {/* URL externe */}
            {formData.type === 'link' && (
              <div>
                <label htmlFor="externalUrl" className="block text-sm font-medium text-blue-900 mb-2">
                  URL externe *
                </label>
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-600" />
                  <input
                    id="externalUrl"
                    name="externalUrl"
                    type="url"
                    required
                    value={formData.externalUrl || ''}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                    placeholder="https://example.com/resource"
                  />
                </div>
              </div>
            )}

            {/* URL de fichier alternative */}
            {formData.type !== 'link' && (
              <div>
                <label htmlFor="fileUrl" className="block text-sm font-medium text-blue-900 mb-2">
                  URL de fichier (alternative)
                </label>
                <div className="relative">
                  <File className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-600" />
                  <input
                    id="fileUrl"
                    name="fileUrl"
                    type="url"
                    value={formData.fileUrl || ''}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                    placeholder="https://example.com/file.pdf"
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Utilisez cette option si vous avez déjà un fichier hébergé ailleurs
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
            <Tag className="w-5 h-5 mr-2" />
            Tags et mots-clés
          </h3>
          
          <div className="space-y-4">
            {/* Tags existants */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            {/* Ajouter un nouveau tag */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                placeholder="Ajouter un tag..."
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Paramètres de visibilité */}
        <div className="bg-white border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Paramètres de visibilité
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                id="isPublic"
                name="isPublic"
                type="checkbox"
                checked={formData.isPublic}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="isPublic" className="text-sm font-medium text-blue-900">
                Ressource publique
              </label>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                id="allowDownload"
                name="allowDownload"
                type="checkbox"
                checked={formData.allowDownload}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="allowDownload" className="text-sm font-medium text-blue-900">
                Autoriser le téléchargement
              </label>
            </div>
            
            <p className="text-xs text-gray-600">
              Une ressource publique sera visible par tous les étudiants. 
              Le téléchargement peut être autorisé ou non selon vos préférences.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg font-medium hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Sauvegarde...
              </div>
            ) : (
              <>
                {mode === 'create' ? <Plus className="w-5 h-5 mr-2" /> : <Edit3 className="w-5 h-5 mr-2" />}
                {mode === 'create' ? 'Ajouter la ressource' : 'Modifier la ressource'}
              </>
            )}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 border-2 border-orange-200 text-orange-700 py-3 px-6 rounded-lg font-medium hover:bg-orange-50 focus:ring-4 focus:ring-orange-200 transition-all duration-200"
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Conseils pour organiser vos ressources :{' '}
          <a href="/help/resources" className="text-blue-600 hover:text-blue-800 font-medium">
            Consultez notre guide
          </a>
        </p>
      </div>
    </div>
  );
};
