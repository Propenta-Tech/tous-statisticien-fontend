"use client"

import React, { useState } from 'react';
import { toast } from 'sonner';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  Loader2, 
  Shield,
  ArrowLeft,
  BookOpen,
  AlertTriangle
} from 'lucide-react';

interface ChangePasswordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  onSuccess,
  onCancel,
  className = ''
}) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePassword = (password: string) => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Au moins 8 caractères');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Au moins une majuscule');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Au moins une minuscule');
    }
    if (!/\d/.test(password)) {
      errors.push('Au moins un chiffre');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Au moins un caractère spécial');
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error('Champs requis manquants', {
        description: 'Veuillez remplir tous les champs',
        className: 'bg-red-50 text-red-900 border-red-200'
      });
      return;
    }

    if (formData.newPassword === formData.currentPassword) {
      toast.error('Nouveau mot de passe identique', {
        description: 'Le nouveau mot de passe doit être différent de l\'actuel',
        className: 'bg-red-50 text-red-900 border-red-200'
      });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Mots de passe différents', {
        description: 'Les deux nouveaux mots de passe doivent être identiques',
        className: 'bg-red-50 text-red-900 border-red-200'
      });
      return;
    }

    const passwordErrors = validatePassword(formData.newPassword);
    if (passwordErrors.length > 0) {
      toast.error('Mot de passe trop faible', {
        description: passwordErrors.join(', '),
        className: 'bg-red-50 text-red-900 border-red-200'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Ici, vous appelleriez votre API pour changer le mot de passe
      // Simulons un délai d'API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSuccess(true);
      toast.success('Mot de passe modifié !', {
        description: 'Votre mot de passe a été mis à jour avec succès',
        className: 'bg-green-50 text-green-900 border-green-200'
      });
      
      onSuccess?.();
    } catch (error) {
      toast.error('Erreur lors de la modification', {
        description: 'Vérifiez votre mot de passe actuel et réessayez',
        className: 'bg-red-50 text-red-900 border-red-200'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={`w-full max-w-md mx-auto ${className}`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-blue-900 mb-2">
            Mot de passe modifié !
          </h1>
          <p className="text-gray-600">
            Votre mot de passe a été mis à jour avec succès
          </p>
        </div>

        {/* Message de confirmation */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-green-900 mb-2">
                Modification réussie
              </h3>
              <p className="text-sm text-green-800">
                Votre mot de passe a été modifié avec succès. 
                Vous devrez utiliser ce nouveau mot de passe lors de votre prochaine connexion.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          {onCancel && (
            <button
              onClick={onCancel}
              className="w-full bg-gradient-to-r from-blue-900 to-blue-800 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-800 hover:to-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200"
            >
              Retour au profil
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Merci d'utiliser Tous Statisticien Academy
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <BookOpen className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-blue-900 mb-2">
          Changer le mot de passe
        </h1>
        <p className="text-gray-600">
          Sécurisez votre compte avec un nouveau mot de passe
        </p>
      </div>

      {/* Avertissement de sécurité */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-orange-800">
              <strong>Important :</strong> Choisissez un mot de passe fort et unique 
              que vous n'utilisez pas ailleurs.
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mot de passe actuel */}
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-blue-900 mb-2">
            Mot de passe actuel *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-600" />
            <input
              id="currentPassword"
              name="currentPassword"
              type={showCurrentPassword ? 'text' : 'password'}
              required
              value={formData.currentPassword}
              onChange={handleInputChange}
              className="w-full pl-10 pr-12 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
              placeholder="Votre mot de passe actuel"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Nouveau mot de passe */}
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-blue-900 mb-2">
            Nouveau mot de passe *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-600" />
            <input
              id="newPassword"
              name="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              required
              value={formData.newPassword}
              onChange={handleInputChange}
              className="w-full pl-10 pr-12 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
              placeholder="Votre nouveau mot de passe"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Confirmation du nouveau mot de passe */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-900 mb-2">
            Confirmer le nouveau mot de passe *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-600" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full pl-10 pr-12 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
              placeholder="Confirmez votre nouveau mot de passe"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Critères de sécurité */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Critères de sécurité :</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${formData.newPassword.length >= 8 ? 'bg-green-500' : 'bg-blue-300'}`}></span>
              Au moins 8 caractères
            </li>
            <li className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${/[A-Z]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-blue-300'}`}></span>
              Au moins une majuscule
            </li>
            <li className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${/[a-z]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-blue-300'}`}></span>
              Au moins une minuscule
            </li>
            <li className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${/\d/.test(formData.newPassword) ? 'bg-green-500' : 'bg-blue-300'}`}></span>
              Au moins un chiffre
            </li>
            <li className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-blue-300'}`}></span>
              Au moins un caractère spécial
            </li>
            <li className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${formData.newPassword !== formData.currentPassword && formData.newPassword !== '' ? 'bg-green-500' : 'bg-blue-300'}`}></span>
              Différent de l'actuel
            </li>
            <li className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${formData.newPassword === formData.confirmPassword && formData.newPassword !== '' ? 'bg-green-500' : 'bg-blue-300'}`}></span>
              Les deux correspondent
            </li>
          </ul>
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
                Modification en cours...
              </div>
            ) : (
              'Modifier le mot de passe'
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

      {/* Actions secondaires */}
      <div className="mt-6">
        {onCancel && (
          <button
            onClick={onCancel}
            className="w-full flex items-center justify-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au profil
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Mot de passe oublié ?{' '}
          <a href="/forgot-password" className="text-blue-600 hover:text-blue-800 font-medium">
            Réinitialisez-le ici
          </a>
        </p>
      </div>
    </div>
  );
};
