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
  BookOpen
} from 'lucide-react';

interface ResetPasswordFormProps {
  token?: string;
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
  className?: string;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  token,
  onSuccess,
  onSwitchToLogin,
  className = ''
}) => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Mots de passe différents', {
        description: 'Les deux mots de passe doivent être identiques',
        className: 'bg-red-50 text-red-900 border-red-200'
      });
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Mot de passe trop court', {
        description: 'Le mot de passe doit contenir au moins 8 caractères',
        className: 'bg-red-50 text-red-900 border-red-200'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Ici, vous appelleriez votre API pour réinitialiser le mot de passe
      // Simulons un délai d'API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSuccess(true);
      toast.success('Mot de passe réinitialisé !', {
        description: 'Vous pouvez maintenant vous connecter avec votre nouveau mot de passe',
        className: 'bg-green-50 text-green-900 border-green-200'
      });
      
      onSuccess?.();
    } catch (error) {
      toast.error('Erreur lors de la réinitialisation', {
        description: 'Vérifiez votre lien et réessayez',
        className: 'bg-red-50 text-red-900 border-red-200'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
            Mot de passe réinitialisé !
          </h1>
          <p className="text-gray-600">
            Votre mot de passe a été modifié avec succès
          </p>
        </div>

        {/* Message de confirmation */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-green-900 mb-2">
                Réinitialisation réussie
              </h3>
              <p className="text-sm text-green-800">
                Vous pouvez maintenant vous connecter avec votre nouveau mot de passe. 
                N'oubliez pas de le garder en sécurité !
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          {onSwitchToLogin && (
            <button
              onClick={onSwitchToLogin}
              className="w-full bg-gradient-to-r from-blue-900 to-blue-800 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-800 hover:to-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200"
            >
              Se connecter maintenant
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
          Nouveau mot de passe
        </h1>
        <p className="text-gray-600">
          Choisissez un nouveau mot de passe sécurisé
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800 text-center">
          Votre nouveau mot de passe doit contenir au moins 8 caractères et être différent de l'ancien.
        </p>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nouveau mot de passe */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-blue-900 mb-2">
            Nouveau mot de passe
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-600" />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-10 pr-12 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
              placeholder="Votre nouveau mot de passe"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Confirmation du mot de passe */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-900 mb-2">
            Confirmer le mot de passe
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
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-orange-900 mb-2">Critères de sécurité :</h4>
          <ul className="text-xs text-orange-800 space-y-1">
            <li className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-orange-300'}`}></span>
              Au moins 8 caractères
            </li>
            <li className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${formData.password === formData.confirmPassword && formData.password !== '' ? 'bg-green-500' : 'bg-orange-300'}`}></span>
              Les deux mots de passe correspondent
            </li>
          </ul>
        </div>

        {/* Bouton de réinitialisation */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg font-medium hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <div className="flex items-center">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Réinitialisation en cours...
            </div>
          ) : (
            'Réinitialiser le mot de passe'
          )}
        </button>
      </form>

      {/* Actions secondaires */}
      <div className="mt-6">
        {onSwitchToLogin && (
          <button
            onClick={onSwitchToLogin}
            className="w-full flex items-center justify-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la connexion
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Problème avec la réinitialisation ?{' '}
          <a href="/contact" className="text-blue-600 hover:text-blue-800 font-medium">
            Contactez notre support
          </a>
        </p>
      </div>
    </div>
  );
};
