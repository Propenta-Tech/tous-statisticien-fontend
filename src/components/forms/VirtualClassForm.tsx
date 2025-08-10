"use client"

import React, { useState } from 'react';
import { toast } from 'sonner';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Clock, 
  MapPin, 
  Save, 
  Loader2, 
  Plus,
  Trash2,
  Edit3,
  Video,
  Globe
} from 'lucide-react';

interface VirtualClassFormProps {
  initialData?: {
    id?: string;
    name: string;
    description: string;
    maxStudents: number;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    daysOfWeek: string[];
    location: string;
    isOnline: boolean;
    meetingLink?: string;
    price: number;
    currency: string;
  };
  mode?: 'create' | 'edit';
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
  className?: string;
}

export const VirtualClassForm: React.FC<VirtualClassFormProps> = ({
  initialData = {
    name: '',
    description: '',
    maxStudents: 20,
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '10:00',
    daysOfWeek: [],
    location: '',
    isOnline: true,
    meetingLink: '',
    price: 0,
    currency: 'EUR'
  },
  mode = 'create',
  onSuccess,
  onCancel,
  className = ''
}) => {
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const daysOptions = [
    { value: 'monday', label: 'Lundi' },
    { value: 'tuesday', label: 'Mardi' },
    { value: 'wednesday', label: 'Mercredi' },
    { value: 'thursday', label: 'Jeudi' },
    { value: 'friday', label: 'Vendredi' },
    { value: 'saturday', label: 'Samedi' },
    { value: 'sunday', label: 'Dimanche' }
  ];

  const currencyOptions = [
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'USD', label: 'USD ($)' },
    { value: 'XOF', label: 'XOF (CFA)' },
    { value: 'XAF', label: 'XAF (CFA)' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter(d => d !== day)
        : [...prev.daysOfWeek, day]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim() || formData.daysOfWeek.length === 0) {
      toast.error('Champs requis manquants', {
        description: 'Veuillez remplir tous les champs obligatoires',
        className: 'bg-red-50 text-red-900 border-red-200'
      });
      return;
    }

    if (formData.maxStudents < 1 || formData.maxStudents > 100) {
      toast.error('Nombre d\'étudiants invalide', {
        description: 'Le nombre d\'étudiants doit être entre 1 et 100',
        className: 'bg-red-50 text-red-900 border-red-200'
      });
      return;
    }

    if (formData.isOnline && !formData.meetingLink?.trim()) {
      toast.error('Lien de réunion requis', {
        description: 'Veuillez fournir un lien de réunion pour les cours en ligne',
        className: 'bg-red-50 text-red-900 border-red-200'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Ici, vous appelleriez votre API pour créer/modifier la classe
      // Simulons un délai d'API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(mode === 'create' ? 'Classe créée !' : 'Classe modifiée !', {
        description: mode === 'create' 
          ? 'Votre classe virtuelle a été créée avec succès'
          : 'Votre classe virtuelle a été modifiée avec succès',
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
          {mode === 'create' ? 'Créer une classe virtuelle' : 'Modifier la classe'}
        </h1>
        <p className="text-gray-600">
          {mode === 'create' 
            ? 'Configurez votre nouvelle classe virtuelle'
            : 'Modifiez les paramètres de votre classe'
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
            {/* Nom de la classe */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-blue-900 mb-2">
                Nom de la classe *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                placeholder="Ex: Introduction aux statistiques"
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
                placeholder="Décrivez le contenu et les objectifs de votre classe..."
              />
            </div>

            {/* Nombre maximum d'étudiants */}
            <div>
              <label htmlFor="maxStudents" className="block text-sm font-medium text-blue-900 mb-2">
                Nombre maximum d'étudiants *
              </label>
              <input
                id="maxStudents"
                name="maxStudents"
                type="number"
                min="1"
                max="100"
                required
                value={formData.maxStudents}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                placeholder="20"
              />
            </div>
          </div>
        </div>

        {/* Planning */}
        <div className="bg-white border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Planning et horaires
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date de début */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-blue-900 mb-2">
                Date de début *
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                required
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
              />
            </div>

            {/* Date de fin */}
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-blue-900 mb-2">
                Date de fin *
              </label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                required
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
              />
            </div>

            {/* Heure de début */}
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-blue-900 mb-2">
                Heure de début *
              </label>
              <input
                id="startTime"
                name="startTime"
                type="time"
                required
                value={formData.startTime}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
              />
            </div>

            {/* Heure de fin */}
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-blue-900 mb-2">
                Heure de fin *
              </label>
              <input
                id="endTime"
                name="endTime"
                type="time"
                required
                value={formData.endTime}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
              />
            </div>
          </div>

          {/* Jours de la semaine */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-blue-900 mb-3">
              Jours de la semaine *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {daysOptions.map((day) => (
                <label key={day.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.daysOfWeek.includes(day.value)}
                    onChange={() => handleDayToggle(day.value)}
                    className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-blue-900">{day.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Localisation */}
        <div className="bg-white border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Localisation
          </h3>
          
          <div className="space-y-4">
            {/* Type de localisation */}
            <div>
              <label className="flex items-center space-x-3">
                <input
                  name="isOnline"
                  type="checkbox"
                  checked={formData.isOnline}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm font-medium text-blue-900">Classe en ligne</span>
              </label>
            </div>

            {/* Lieu physique */}
            {!formData.isOnline && (
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-blue-900 mb-2">
                  Adresse du lieu
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                  placeholder="123 Rue de l'Éducation, 75001 Paris"
                />
              </div>
            )}

            {/* Lien de réunion */}
            {formData.isOnline && (
              <div>
                <label htmlFor="meetingLink" className="block text-sm font-medium text-blue-900 mb-2">
                  Lien de réunion *
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-600" />
                  <input
                    id="meetingLink"
                    name="meetingLink"
                    type="url"
                    required={formData.isOnline}
                    value={formData.meetingLink}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                    placeholder="https://meet.google.com/abc-defg-hij"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tarification */}
        <div className="bg-white border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Tarification
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Prix */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-blue-900 mb-2">
                Prix
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                placeholder="0.00"
              />
            </div>

            {/* Devise */}
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-blue-900 mb-2">
                Devise
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
              >
                {currencyOptions.map((currency) => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
            </div>
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
                {mode === 'create' ? 'Créer la classe' : 'Modifier la classe'}
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
          Besoin d'aide pour configurer votre classe ?{' '}
          <a href="/help" className="text-blue-600 hover:text-blue-800 font-medium">
            Consultez notre guide
          </a>
        </p>
      </div>
    </div>
  );
};

export { VirtualClassForm }
