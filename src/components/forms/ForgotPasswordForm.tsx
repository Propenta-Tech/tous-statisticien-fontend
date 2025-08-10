"use client"

import React, { useState } from 'react';
import { ForgotPasswordData } from '@/types/auth';
import { toast } from 'sonner';
import { 
  Mail, 
  ArrowLeft, 
  CheckCircle, 
  Loader2, 
  BookOpen,
  Shield,
  AlertCircle
} from 'lucide-react';

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
  onSwitchToRegister?: () => void;
  className?: string;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSuccess,
  onSwitchToLogin,
  onSwitchToRegister,
  className = ''
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Email requis', {
        description: 'Veuillez saisir votre adresse email',
        className: 'bg-red-50 text-red-900 border-red-200'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Ici, vous appelleriez votre API pour envoyer l'email de récupération
      // Simulons un délai d'API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsEmailSent(true);
      setCountdown(60); // 60 secondes de compte à rebours
      
      // Démarrer le compte à rebours
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      toast.success('Email envoyé !', {
        description: 'Vérifiez votre boîte email pour les instructions',
        className: 'bg-green-50 text-green-900 border-green-200'
      });
      
      onSuccess?.();
    } catch (error) {
      toast.error('Erreur lors de l\'envoi', {
        description: 'Vérifiez votre email et réessayez',
        className: 'bg-red-50 text-red-900 border-red-200'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (countdown > 0) return;
    
    setIsLoading(true);
    
    try {
      // Ici, vous appelleriez votre API pour renvoyer l'email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCountdown(60);
      
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      toast.success('Email renvoyé !', {
        description: 'Vérifiez votre boîte email',
        className: 'bg-green-50 text-green-900 border-green-200'
      });
    } catch (error) {
      toast.error('Erreur lors du renvoi', {
        description: 'Veuillez réessayer plus tard',
        className: 'bg-red-50 text-red-900 border-red-200'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isEmailSent) {
    return (
      <div className={`w-full max-w-md mx-auto ${className}`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-blue-900 mb-2">
            Email envoyé !
          </h1>
          <p className="text-gray-600">
            Vérifiez votre boîte email
          </p>
        </div>

        {/* Message de confirmation */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-900 mb-2">
                Instructions envoyées
              </h3>
              <p className="text-sm text-blue-800 mb-3">
                Nous avons envoyé un lien de récupération à <strong>{email}</strong>. 
                Suivez les instructions pour réinitialiser votre mot de passe.
              </p>
              <div className="text-xs text-blue-700">
                <p>• Vérifiez votre dossier spam si vous ne recevez pas l'email</p>
                <p>• Le lien expire dans 24 heures</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={handleResendEmail}
            disabled={isLoading || countdown > 0}
            className="w-full bg-gradient-to-r from-blue-900 to-blue-800 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-800 hover:to-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Envoi...
              </div>
            ) : countdown > 0 ? (
              `Renvoyer dans ${formatTime(countdown)}`
            ) : (
              'Renvoyer l\'email'
            )}
          </button>

          {onSwitchToLogin && (
            <button
              onClick={onSwitchToLogin}
              className="w-full border-2 border-blue-200 text-blue-700 py-3 px-6 rounded-lg font-medium hover:bg-blue-50 focus:ring-4 focus:ring-blue-200 transition-all duration-200"
            >
              Retour à la connexion
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Vous n'avez pas reçu l'email ?{' '}
            <button
              onClick={handleResendEmail}
              disabled={countdown > 0}
              className="text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cliquez ici pour le renvoyer
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
          <AlertCircle className="w-8 h-8 text-orange-600" />
        </div>
        <h1 className="text-2xl font-bold text-blue-900 mb-2">
          Mot de passe oublié ?
        </h1>
        <p className="text-gray-600">
          Pas de panique ! Nous vous aiderons à le récupérer
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800 text-center">
          Saisissez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-blue-900 mb-2">
            Adresse email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-600" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
              placeholder="votre@email.com"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 px-6 rounded-lg font-medium hover:from-orange-700 hover:to-orange-800 focus:ring-4 focus:ring-orange-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <div className="flex items-center">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Envoi en cours...
            </div>
          ) : (
            'Envoyer le lien de récupération'
          )}
        </button>
      </form>

      {/* Actions secondaires */}
      <div className="mt-6 space-y-3">
        {onSwitchToLogin && (
          <button
            onClick={onSwitchToLogin}
            className="w-full flex items-center justify-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la connexion
          </button>
        )}
        
        {onSwitchToRegister && (
          <button
            onClick={onSwitchToRegister}
            className="w-full flex items-center justify-center text-green-600 hover:text-green-800 font-medium transition-colors"
          >
            Créer un nouveau compte
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Besoin d'aide ?{' '}
          <a href="/contact" className="text-blue-600 hover:text-blue-800 font-medium">
            Contactez notre support
          </a>
        </p>
      </div>
    </div>
  );
};
