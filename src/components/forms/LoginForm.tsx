"use client"

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/context';
import { LoginCredentials } from '@/types/auth';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, Loader2, BookOpen } from 'lucide-react';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
  onSwitchToForgotPassword?: () => void;
  className?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onSwitchToRegister,
  onSwitchToForgotPassword,
  className = ''
}) => {
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(formData);
      toast.success('Connexion réussie !', {
        description: 'Bienvenue sur Tous Statisticien Academy',
        className: 'bg-green-50 text-green-900 border-green-200'
      });
      onSuccess?.();
    } catch (error) {
      toast.error('Échec de la connexion', {
        description: 'Vérifiez vos identifiants et réessayez',
        className: 'bg-red-50 text-red-900 border-red-200'
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-900 rounded-full mb-4">
          <BookOpen className="w-8 h-8 text-yellow-400" />
        </div>
        <h1 className="text-2xl font-bold text-blue-900 mb-2">
          Connexion
        </h1>
        <p className="text-gray-600">
          Accédez à votre espace d'apprentissage
        </p>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-blue-900 mb-2">
            Adresse email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-600" />
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
              placeholder="votre@email.com"
            />
          </div>
        </div>

        {/* Mot de passe */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-blue-900 mb-2">
            Mot de passe
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
              placeholder="Votre mot de passe"
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

        {/* Options */}
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="ml-2 text-sm text-blue-900">Se souvenir de moi</span>
          </label>
          
          {onSwitchToForgotPassword && (
            <button
              type="button"
              onClick={onSwitchToForgotPassword}
              className="text-sm text-orange-600 hover:text-orange-800 transition-colors font-medium"
            >
              Mot de passe oublié ?
            </button>
          )}
        </div>

        {/* Bouton de connexion */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-900 to-blue-800 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-800 hover:to-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Connexion en cours...
            </div>
          ) : (
            'Se connecter'
          )}
        </button>

        {/* Séparateur */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-blue-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">ou</span>
          </div>
        </div>

        {/* Bouton d'inscription */}
        {onSwitchToRegister && (
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="w-full border-2 border-green-600 text-green-700 py-3 px-6 rounded-lg font-medium hover:bg-green-50 focus:ring-4 focus:ring-green-200 transition-all duration-200"
          >
            Créer un compte
          </button>
        )}
      </form>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          En vous connectant, vous acceptez nos{' '}
          <a href="/terms" className="text-blue-600 hover:text-blue-800 font-medium">
            conditions d'utilisation
          </a>{' '}
          et notre{' '}
          <a href="/privacy" className="text-blue-600 hover:text-blue-800 font-medium">
            politique de confidentialité
          </a>
        </p>
      </div>
    </div>
  );
};


