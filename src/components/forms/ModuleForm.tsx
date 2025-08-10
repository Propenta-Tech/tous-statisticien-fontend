"use client"

import React, { useState } from 'react';
import { toast } from 'sonner';
import { 
  BookOpen, 
  FileText, 
  Clock, 
  Users, 
  Save, 
  Loader2, 
  Plus,
  Edit3,
  Trash2,
  Upload,
  Target,
  Award
} from 'lucide-react';

interface ModuleFormProps {
  initialData?: {
    id?: string;
    title: string;
    description: string;
    duration: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    maxStudents: number;
    objectives: string[];
    prerequisites: string[];
    tags: string[];
    isPublished: boolean;
    thumbnail?: string;
  };
  mode?: 'create' | 'edit';
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
  className?: string;
}

export const ModuleForm: React.FC<ModuleFormProps> = ({
  initialData = {
    title: '',
    description: '',
    duration: 60,
    difficulty: 'beginner',
    maxStudents: 30,
    objectives: [''],
    prerequisites: [''],
    tags: [],
    isPublished: false
  },
  mode = 'create',
  onSuccess,
  onCancel,
  className = ''
}) => {
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [newObjective, setNewObjective] = useState('');
  const [newPrerequisite, setNewPrerequisite] = useState('');
  const [newTag, setNewTag] = useState('');

  const difficultyOptions = [
    { value: 'beginner', label: 'Débutant', color: 'bg-green-100 text-green-800' },
    { value: 'intermediate', label: 'Intermédiaire', color: 'bg-orange-100 text-orange-800' },
    { value: 'advanced', label: 'Avancé', color: 'bg-red-100 text-red-800' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      setFormData(prev => ({
        ...prev,
        objectives: [...prev.objectives, newObjective.trim()]
      }));
      setNewObjective('');
    }
  };

  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  const addPrerequisite = () => {
    if (newPrerequisite.trim()) {
      setFormData(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, newPrerequisite.trim()]
      }));
      setNewPrerequisite('');
    }
  };

  const removePrerequisite = (index: number) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_, i) => i !== index)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Champs requis manquants', {
        description: 'Veuillez remplir tous les champs obligatoires',
        className: 'bg-red-50 text-red-900 border-red-200'
      });
      return;
    }

    if (formData.objectives.length === 0 || formData.objectives.every(obj => !obj.trim())) {
      toast.error('Objectifs requis', {
        description: 'Veuillez ajouter au moins un objectif d\'apprentissage',
        className: 'bg-red-50 text-red-900 border-red-200'
      });
      return;
    }

    if (formData.duration < 15 || formData.duration > 480) {
      toast.error('Durée invalide', {
        description: 'La durée doit être entre 15 et 480 minutes',
        className: 'bg-red-50 text-red-900 border-red-200'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Ici, vous appelleriez votre API pour créer/modifier le module
      // Simulons un délai d'API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(mode === 'create' ? 'Module créé !' : 'Module modifié !', {
        description: mode === 'create' 
          ? 'Votre module a été créé avec succès'
          : 'Votre module a été modifié avec succès',
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
          <BookOpen className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-blue-900 mb-2">
          {mode === 'create' ? 'Créer un module' : 'Modifier le module'}
        </h1>
        <p className="text-gray-600">
          {mode === 'create' 
            ? 'Configurez votre nouveau module d\'apprentissage'
            : 'Modifiez les paramètres de votre module'
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
                Titre du module *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                placeholder="Ex: Introduction aux statistiques descriptives"
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
                placeholder="Décrivez le contenu et les objectifs de votre module..."
              />
            </div>

            {/* Durée et difficulté */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-blue-900 mb-2">
                  Durée (minutes) *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-600" />
                  <input
                    id="duration"
                    name="duration"
                    type="number"
                    min="15"
                    max="480"
                    required
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                    placeholder="60"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-blue-900 mb-2">
                  Niveau de difficulté *
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  required
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                >
                  {difficultyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Nombre maximum d'étudiants */}
            <div>
              <label htmlFor="maxStudents" className="block text-sm font-medium text-blue-900 mb-2">
                Nombre maximum d'étudiants
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-600" />
                <input
                  id="maxStudents"
                  name="maxStudents"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.maxStudents}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                  placeholder="30"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Objectifs d'apprentissage */}
        <div className="bg-white border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Objectifs d'apprentissage *
          </h3>
          
          <div className="space-y-3">
            {formData.objectives.map((objective, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={objective}
                    onChange={(e) => {
                      const newObjectives = [...formData.objectives];
                      newObjectives[index] = e.target.value;
                      setFormData(prev => ({ ...prev, objectives: newObjectives }));
                    }}
                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                    placeholder="Ex: Comprendre les concepts de base des statistiques"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeObjective(index)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
                className="flex-1 px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                placeholder="Ajouter un nouvel objectif..."
              />
              <button
                type="button"
                onClick={addObjective}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Prérequis */}
        <div className="bg-white border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Prérequis
          </h3>
          
          <div className="space-y-3">
            {formData.prerequisites.map((prerequisite, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={prerequisite}
                    onChange={(e) => {
                      const newPrerequisites = [...formData.prerequisites];
                      newPrerequisites[index] = e.target.value;
                      setFormData(prev => ({ ...prev, prerequisites: newPrerequisites }));
                    }}
                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                    placeholder="Ex: Connaissances de base en mathématiques"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removePrerequisite(index)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newPrerequisite}
                onChange={(e) => setNewPrerequisite(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPrerequisite())}
                className="flex-1 px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                placeholder="Ajouter un nouveau prérequis..."
              />
              <button
                type="button"
                onClick={addPrerequisite}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Tags et catégories
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
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
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
              Publier le module immédiatement
            </label>
          </div>
          
          <p className="text-xs text-gray-600 mt-2">
            Si coché, le module sera visible par les étudiants. Sinon, il restera en mode brouillon.
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
                {mode === 'create' ? 'Créer le module' : 'Modifier le module'}
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
          Besoin d'aide pour créer votre module ?{' '}
          <a href="/help/modules" className="text-blue-600 hover:text-blue-800 font-medium">
            Consultez notre guide
          </a>
        </p>
      </div>
    </div>
  );
};
