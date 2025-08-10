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
  CheckCircle,
  AlertTriangle,
  Target,
  Award
} from 'lucide-react';

interface EvaluationFormProps {
  initialData?: {
    id?: string;
    title: string;
    description: string;
    type: 'quiz' | 'exam' | 'assignment' | 'project';
    duration: number;
    maxScore: number;
    passingScore: number;
    isTimed: boolean;
    allowRetake: boolean;
    questions: Array<{
      id: string;
      question: string;
      type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
      options?: string[];
      correctAnswer?: string | string[];
      points: number;
    }>;
    isPublished: boolean;
    dueDate?: string;
  };
  mode?: 'create' | 'edit';
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
  className?: string;
}

export const EvaluationForm: React.FC<EvaluationFormProps> = ({
  initialData = {
    title: '',
    description: '',
    type: 'quiz',
    duration: 60,
    maxScore: 100,
    passingScore: 60,
    isTimed: true,
    allowRetake: false,
    questions: [],
    isPublished: false
  },
  mode = 'create',
  onSuccess,
  onCancel,
  className = ''
}) => {
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    type: 'multiple_choice' as const,
    options: ['', '', '', ''],
    correctAnswer: '',
    points: 1
  });

  const evaluationTypeOptions = [
    { value: 'quiz', label: 'Quiz', color: 'bg-blue-100 text-blue-800' },
    { value: 'exam', label: 'Examen', color: 'bg-red-100 text-red-800' },
    { value: 'assignment', label: 'Devoir', color: 'bg-green-100 text-green-800' },
    { value: 'project', label: 'Projet', color: 'bg-purple-100 text-purple-800' }
  ];

  const questionTypeOptions = [
    { value: 'multiple_choice', label: 'Choix multiple' },
    { value: 'true_false', label: 'Vrai/Faux' },
    { value: 'short_answer', label: 'Réponse courte' },
    { value: 'essay', label: 'Dissertation' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addQuestion = () => {
    if (newQuestion.question.trim()) {
      const questionData = {
        id: Date.now().toString(),
        question: newQuestion.question.trim(),
        type: newQuestion.type,
        options: newQuestion.type === 'multiple_choice' ? newQuestion.options.filter(opt => opt.trim()) : undefined,
        correctAnswer: newQuestion.correctAnswer,
        points: newQuestion.points
      };

      setFormData(prev => ({
        ...prev,
        questions: [...prev.questions, questionData]
      }));

      // Reset form
      setNewQuestion({
        question: '',
        type: 'multiple_choice',
        options: ['', '', '', ''],
        correctAnswer: '',
        points: 1
      });
    }
  };

  const removeQuestion = (id: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id)
    }));
  };

  const updateQuestion = (id: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === id ? { ...q, [field]: value } : q
      )
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

    if (formData.questions.length === 0) {
      toast.error('Questions requises', {
        description: 'Veuillez ajouter au moins une question',
        className: 'bg-red-50 text-red-900 border-red-200'
      });
      return;
    }

    if (formData.passingScore > formData.maxScore) {
      toast.error('Score de passage invalide', {
        description: 'Le score de passage ne peut pas dépasser le score maximum',
        className: 'bg-red-50 text-red-900 border-red-200'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Ici, vous appelleriez votre API pour créer/modifier l'évaluation
      // Simulons un délai d'API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(mode === 'create' ? 'Évaluation créée !' : 'Évaluation modifiée !', {
        description: mode === 'create' 
          ? 'Votre évaluation a été créée avec succès'
          : 'Votre évaluation a été modifiée avec succès',
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
          {mode === 'create' ? 'Créer une évaluation' : 'Modifier l\'évaluation'}
        </h1>
        <p className="text-gray-600">
          {mode === 'create' 
            ? 'Créez une évaluation pour tester les connaissances de vos étudiants'
            : 'Modifiez les paramètres de votre évaluation'
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
                Titre de l'évaluation *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                placeholder="Ex: Quiz sur les probabilités"
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
                placeholder="Décrivez le contenu et les objectifs de cette évaluation..."
              />
            </div>

            {/* Type et paramètres */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-blue-900 mb-2">
                  Type d'évaluation *
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                >
                  {evaluationTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-blue-900 mb-2">
                  Durée (minutes)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-600" />
                  <input
                    id="duration"
                    name="duration"
                    type="number"
                    min="5"
                    max="480"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                    placeholder="60"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="maxScore" className="block text-sm font-medium text-blue-900 mb-2">
                  Score maximum *
                </label>
                <input
                  id="maxScore"
                  name="maxScore"
                  type="number"
                  min="1"
                  max="1000"
                  required
                  value={formData.maxScore}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                  placeholder="100"
                />
              </div>
            </div>

            {/* Score de passage et options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="passingScore" className="block text-sm font-medium text-blue-900 mb-2">
                  Score de passage *
                </label>
                <input
                  id="passingScore"
                  name="passingScore"
                  type="number"
                  min="1"
                  max={formData.maxScore}
                  required
                  value={formData.passingScore}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                  placeholder="60"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    name="isTimed"
                    type="checkbox"
                    checked={formData.isTimed}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-blue-900">Évaluation chronométrée</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    name="allowRetake"
                    type="checkbox"
                    checked={formData.allowRetake}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-blue-900">Autoriser les nouvelles tentatives</span>
                </label>
              </div>
            </div>

            {/* Date limite */}
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-blue-900 mb-2">
                Date limite (optionnel)
              </label>
              <input
                id="dueDate"
                name="dueDate"
                type="datetime-local"
                value={formData.dueDate || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
              />
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="bg-white border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Questions ({formData.questions.length})
          </h3>
          
          {/* Questions existantes */}
          {formData.questions.length > 0 && (
            <div className="space-y-4 mb-6">
              {formData.questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-blue-900">Question {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeQuestion(question.id)}
                      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                      placeholder="Votre question..."
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <select
                        value={question.type}
                        onChange={(e) => updateQuestion(question.id, 'type', e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                      >
                        {questionTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      
                      <input
                        type="number"
                        min="1"
                        value={question.points}
                        onChange={(e) => updateQuestion(question.id, 'points', parseInt(e.target.value))}
                        className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                        placeholder="Points"
                      />
                    </div>
                    
                    {/* Options pour choix multiple */}
                    {question.type === 'multiple_choice' && question.options && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Options :</label>
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...question.options!];
                                newOptions[optIndex] = e.target.value;
                                updateQuestion(question.id, 'options', newOptions);
                              }}
                              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                              placeholder={`Option ${optIndex + 1}`}
                            />
                            <input
                              type="radio"
                              name={`correct_${question.id}`}
                              checked={question.correctAnswer === option}
                              onChange={() => updateQuestion(question.id, 'correctAnswer', option)}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-600">Correcte</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Ajouter une nouvelle question */}
          <div className="border-2 border-dashed border-blue-200 rounded-lg p-6">
            <h4 className="text-lg font-medium text-blue-900 mb-4">Ajouter une nouvelle question</h4>
            
            <div className="space-y-4">
              <textarea
                value={newQuestion.question}
                onChange={(e) => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white resize-none"
                placeholder="Votre question..."
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={newQuestion.type}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, type: e.target.value as any }))}
                  className="px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                >
                  {questionTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                
                <input
                  type="number"
                  min="1"
                  value={newQuestion.points}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, points: parseInt(e.target.value) }))}
                  className="px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                  placeholder="Points"
                />
                
                <button
                  type="button"
                  onClick={addQuestion}
                  disabled={!newQuestion.question.trim()}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
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
              Publier l'évaluation immédiatement
            </label>
          </div>
          
          <p className="text-xs text-gray-600 mt-2">
            Si coché, l'évaluation sera visible par les étudiants. Sinon, elle restera en mode brouillon.
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
                {mode === 'create' ? 'Créer l\'évaluation' : 'Modifier l\'évaluation'}
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
          Conseils pour créer une évaluation efficace :{' '}
          <a href="/help/evaluations" className="text-blue-600 hover:text-blue-800 font-medium">
            Consultez notre guide
          </a>
        </p>
      </div>
    </div>
  );
};
