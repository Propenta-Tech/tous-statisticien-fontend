"use client"

import React, { useState } from 'react';
import { toast } from 'sonner';
import { 
  BookOpen, 
  FileText, 
  Clock, 
  Video, 
  Upload, 
  Save, 
  Loader2, 
  Plus,
  Edit3,
  Trash2,
  Link,
  File,
  Image
} from 'lucide-react';

interface LectureFormProps {
  initialData?: {
    id?: string;
    title: string;
    description: string;
    duration: number;
    type: 'video' | 'document' | 'interactive' | 'quiz';
    content: string;
    videoUrl?: string;
    documents: Array<{
      id: string;
      name: string;
      url: string;
      type: string;
    }>;
    resources: Array<{
      id: string;
      title: string;
      url: string;
      description: string;
    }>;
    isPublished: boolean;
    order: number;
  };
  mode?: 'create' | 'edit';
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
  className?: string;
}

export const LectureForm: React.FC<LectureFormProps> = ({
  initialData = {
    title: '',
    description: '',
    duration: 30,
    type: 'video',
    content: '',
    videoUrl: '',
    documents: [],
    resources: [],
    isPublished: false,
    order: 1
  },
  mode = 'create',
  onSuccess,
  onCancel,
  className = ''
}) => {
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [newResource, setNewResource] = useState({ title: '', url: '', description: '' });

  const lectureTypeOptions = [
    { value: 'video', label: 'Vidéo', icon: Video, color: 'bg-blue-100 text-blue-800' },
    { value: 'document', label: 'Document', icon: FileText, color: 'bg-green-100 text-green-800' },
    { value: 'interactive', label: 'Interactif', icon: BookOpen, color: 'bg-orange-100 text-orange-800' },
    { value: 'quiz', label: 'Quiz', icon: FileText, color: 'bg-purple-100 text-purple-800' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addResource = () => {
    if (newResource.title.trim() && newResource.url.trim()) {
      setFormData(prev => ({
        ...prev,
        resources: [...prev.resources, { ...newResource, id: Date.now().toString() }]
      }));
      setNewResource({ title: '', url: '', description: '' });
    }
  };

  const removeResource = (id: string) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter(r => r.id !== id)
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Ici, vous géreriez l'upload des fichiers vers votre serveur
      // Pour l'exemple, on simule juste l'ajout
      Array.from(files).forEach(file => {
        const newDoc = {
          id: Date.now().toString(),
          name: file.name,
          url: URL.createObjectURL(file),
          type: file.type
        };
        setFormData(prev => ({
          ...prev,
          documents: [...prev.documents, newDoc]
        }));
      });
    }
  };

  const removeDocument = (id: string) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(d => d.id !== id)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.content.trim()) {
      toast.error('Champs requis manquants', {
        description: 'Veuillez remplir tous les champs obligatoires',
        className: 'bg-red-50 text-red-900 border-red-200'
      });
      return;
    }

    if (formData.type === 'video' && !formData.videoUrl?.trim()) {
      toast.error('URL vidéo requise', {
        description: 'Veuillez fournir une URL vidéo pour ce type de cours',
        className: 'bg-red-50 text-red-900 border-red-200'
      });
      return;
    }

    if (formData.duration < 5 || formData.duration > 180) {
      toast.error('Durée invalide', {
        description: 'La durée doit être entre 5 et 180 minutes',
        className: 'bg-red-50 text-red-900 border-red-200'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Ici, vous appelleriez votre API pour créer/modifier la lecture
      // Simulons un délai d'API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(mode === 'create' ? 'Lecture créée !' : 'Lecture modifiée !', {
        description: mode === 'create' 
          ? 'Votre lecture a été créée avec succès'
          : 'Votre lecture a été modifiée avec succès',
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
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <BookOpen className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-blue-900 mb-2">
          {mode === 'create' ? 'Créer une lecture' : 'Modifier la lecture'}
        </h1>
        <p className="text-gray-600">
          {mode === 'create' 
            ? 'Ajoutez du contenu à votre module d\'apprentissage'
            : 'Modifiez le contenu de votre lecture'
          }
        </p>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de base */}
        <div className="bg-white border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Informations de base
          </h3>
          
          <div className="space-y-4">
            {/* Titre */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-blue-900 mb-2">
                Titre de la lecture *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                placeholder="Ex: Introduction aux variables aléatoires"
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
                rows={3}
                required
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white resize-none"
                placeholder="Résumé de ce que les étudiants vont apprendre..."
              />
            </div>

            {/* Type et durée */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-blue-900 mb-2">
                  Type de lecture *
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                >
                  {lectureTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-blue-900 mb-2">
                  Durée estimée (minutes) *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-600" />
                  <input
                    id="duration"
                    name="duration"
                    type="number"
                    min="5"
                    max="180"
                    required
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                    placeholder="30"
                  />
                </div>
              </div>
            </div>

            {/* Ordre */}
            <div>
              <label htmlFor="order" className="block text-sm font-medium text-blue-900 mb-2">
                Ordre dans le module
              </label>
              <input
                id="order"
                name="order"
                type="number"
                min="1"
                value={formData.order}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                placeholder="1"
              />
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="bg-white border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Contenu principal *
          </h3>
          
          <div className="space-y-4">
            {/* Contenu textuel */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-blue-900 mb-2">
                Contenu de la lecture *
              </label>
              <textarea
                id="content"
                name="content"
                rows={8}
                required
                value={formData.content}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white resize-none"
                placeholder="Rédigez le contenu principal de votre lecture. Vous pouvez utiliser du Markdown pour la mise en forme..."
              />
            </div>

            {/* URL vidéo (si type vidéo) */}
            {formData.type === 'video' && (
              <div>
                <label htmlFor="videoUrl" className="block text-sm font-medium text-blue-900 mb-2">
                  URL de la vidéo *
                </label>
                <div className="relative">
                  <Video className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-600" />
                  <input
                    id="videoUrl"
                    name="videoUrl"
                    type="url"
                    required
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Supports : YouTube, Vimeo, ou fichiers vidéo hébergés
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Documents et ressources */}
        <div className="bg-white border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
            <File className="w-5 h-5 mr-2" />
            Documents et ressources
          </h3>
          
          <div className="space-y-6">
            {/* Upload de documents */}
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-3">
                Documents de support
              </label>
              
              {/* Documents existants */}
              {formData.documents.length > 0 && (
                <div className="space-y-2 mb-4">
                  {formData.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Image className="w-5 h-5 text-blue-600" />
                        <span className="text-sm text-gray-700">{doc.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDocument(doc.id)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Upload de nouveaux documents */}
              <div className="border-2 border-dashed border-blue-200 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <label htmlFor="fileUpload" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-800 font-medium">
                    Cliquez pour ajouter des documents
                  </span>
                  <span className="text-gray-500 text-sm block mt-1">
                    PDF, Word, PowerPoint, Excel, Images (max 10MB)
                  </span>
                </label>
                <input
                  id="fileUpload"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Ressources externes */}
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-3">
                Ressources externes
              </label>
              
              {/* Ressources existantes */}
              {formData.resources.length > 0 && (
                <div className="space-y-2 mb-4">
                  {formData.resources.map((resource) => (
                    <div key={resource.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Link className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-900">{resource.title}</span>
                        </div>
                        {resource.description && (
                          <p className="text-xs text-green-700 mt-1">{resource.description}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeResource(resource.id)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Ajouter une nouvelle ressource */}
              <div className="space-y-3 p-4 border border-green-200 rounded-lg bg-green-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Titre de la ressource"
                    value={newResource.title}
                    onChange={(e) => setNewResource(prev => ({ ...prev, title: e.target.value }))}
                    className="px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors bg-white"
                  />
                  <input
                    type="url"
                    placeholder="URL de la ressource"
                    value={newResource.url}
                    onChange={(e) => setNewResource(prev => ({ ...prev, url: e.target.value }))}
                    className="px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors bg-white"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Description (optionnel)"
                  value={newResource.description}
                  onChange={(e) => setNewResource(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors bg-white"
                />
                <button
                  type="button"
                  onClick={addResource}
                  disabled={!newResource.title.trim() || !newResource.url.trim()}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter la ressource
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Publication */}
        <div className="bg-white border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4">Publication</h3>
          
          <div className="flex items-center space-x-3">
            <input
              id="isPublished"
              name="isPublished"
              type="checkbox"
              checked={formData.isPublished}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="isPublished" className="text-sm font-medium text-blue-900">
              Publier la lecture immédiatement
            </label>
          </div>
          
          <p className="text-xs text-gray-600 mt-2">
            Si coché, la lecture sera visible par les étudiants. Sinon, elle restera en mode brouillon.
          </p>
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
                {mode === 'create' ? 'Créer la lecture' : 'Modifier la lecture'}
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
          Conseils pour créer une lecture efficace :{' '}
          <a href="/help/lectures" className="text-blue-600 hover:text-blue-800 font-medium">
            Consultez notre guide
          </a>
        </p>
      </div>
    </div>
  );
};
