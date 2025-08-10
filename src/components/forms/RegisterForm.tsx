"use client"

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/context';
import { RegistrationStep1, RegistrationStep2, RegistrationStep3, RegistrationData } from '@/types/auth';
import { toast } from 'sonner';
import { 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Loader2, 
  BookOpen,
  Shield
} from 'lucide-react';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
  className?: string;
}

type RegistrationStep = 1 | 2 | 3;

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onSwitchToLogin,
  className = ''
}) => {
  const { register, isLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [step1Data, setStep1Data] = useState<RegistrationStep1>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: ''
  });
  
  const [step2Data, setStep2Data] = useState<RegistrationStep2>({
    verificationToken: '',
    code: ''
  });
  
  const [step3Data, setStep3Data] = useState<RegistrationStep3>({
    verificationToken: '',
    password: '',
    confirmPassword: ''
  });

  const [verificationToken, setVerificationToken] = useState<string>('');

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Ici, vous appelleriez votre API pour envoyer l'email et recevoir le token
      // Pour l'exemple, on simule la réception d'un token
      const mockToken = 'mock-verification-token-' + Date.now();
      setVerificationToken(mockToken);
      setStep2Data(prev => ({ ...prev, verificationToken: mockToken }));
      
      toast.success('Code de vérification envoyé !', {
        description: 'Vérifiez votre boîte email',
        className: 'bg-green-50 text-green-900 border-green-200'
      });
      
      setCurrentStep(2);
    } catch (error) {
      toast.error('Erreur lors de l\'envoi', {
        description: 'Vérifiez vos informations et réessayez',
        className: 'bg-red-50 text-red-900 border-red-200'
      });
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Ici, vous vérifieriez le code avec votre API
      // Pour l'exemple, on accepte n'importe quel code
      if (step2Data.code.length >= 4) {
        setStep3Data(prev => ({ ...prev, verificationToken: verificationToken }));
        setCurrentStep(3);
        
        toast.success('Code vérifié !', {
          description: 'Créez maintenant votre mot de passe',
          className: 'bg-green-50 text-green-900 border-green-200'
        });
      } else {
        toast.error('Code invalide', {
          description: 'Le code doit contenir au moins 4 caractères',
          className: 'bg-red-50 text-red-900 border-red-200'
        });
      }
    } catch (error) {
      toast.error('Erreur de vérification', {
        description: 'Vérifiez le code et réessayez',
        className: 'bg-red-50 text-red-900 border-red-200'
      });
    }
  };

  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step3Data.password !== step3Data.confirmPassword) {
      toast.error('Mots de passe différents', {
        description: 'Les mots de passe doivent être identiques',
        className: 'bg-red-50 text-red-900 border-red-200'
      });
      return;
    }
    
    if (step3Data.password.length < 8) {
      toast.error('Mot de passe trop court', {
        description: 'Le mot de passe doit contenir au moins 8 caractères',
        className: 'bg-red-50 text-red-900 border-red-200'
      });
      return;
    }
    
    try {
      const registrationData: RegistrationData = {
        step1: step1Data,
        step2: step2Data,
        step3: step3Data
      };
      
      await register(registrationData);
      
      toast.success('Inscription réussie !', {
        description: 'Bienvenue sur Tous Statisticien Academy',
        className: 'bg-green-50 text-green-900 border-green-200'
      });
      
      onSuccess?.();
    } catch (error) {
      toast.error('Erreur lors de l\'inscription', {
        description: 'Vérifiez vos informations et réessayez',
        className: 'bg-red-50 text-red-900 border-red-200'
      });
    }
  };

  const handleInputChange = (step: number, field: string, value: string) => {
    switch (step) {
      case 1:
        setStep1Data(prev => ({ ...prev, [field]: value }));
        break;
      case 2:
        setStep2Data(prev => ({ ...prev, [field]: value }));
        break;
      case 3:
        setStep3Data(prev => ({ ...prev, [field]: value }));
        break;
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as RegistrationStep);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step <= currentStep 
              ? 'bg-blue-900 text-white' 
              : 'bg-gray-200 text-gray-500'
          }`}>
            {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
          </div>
          {step < 3 && (
            <div className={`w-12 h-1 mx-2 ${
              step < currentStep ? 'bg-blue-900' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <form onSubmit={handleStep1Submit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-blue-900 mb-2">
            Prénom *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-600" />
            <input
              id="firstName"
              type="text"
              required
              value={step1Data.firstName}
              onChange={(e) => handleInputChange(1, 'firstName', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
              placeholder="Votre prénom"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-blue-900 mb-2">
            Nom *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-600" />
            <input
              id="lastName"
              type="text"
              required
              value={step1Data.lastName}
              onChange={(e) => handleInputChange(1, 'lastName', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
              placeholder="Votre nom"
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-blue-900 mb-2">
          Adresse email *
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-600" />
          <input
            id="email"
            type="email"
            required
            value={step1Data.email}
            onChange={(e) => handleInputChange(1, 'email', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
            placeholder="votre@email.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-blue-900 mb-2">
            Téléphone
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-600" />
            <input
              id="phone"
              type="tel"
              value={step1Data.phone}
              onChange={(e) => handleInputChange(1, 'phone', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
              placeholder="+33 6 12 34 56 78"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-blue-900 mb-2">
            Pays *
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-600" />
            <select
              id="country"
              required
              value={step1Data.country}
              onChange={(e) => handleInputChange(1, 'country', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
            >
              <option value="">Sélectionnez un pays</option>
              <option value="FR">France</option>
              <option value="BE">Belgique</option>
              <option value="CH">Suisse</option>
              <option value="CA">Canada</option>
              <option value="MA">Maroc</option>
              <option value="TN">Tunisie</option>
              <option value="DZ">Algérie</option>
              <option value="SN">Sénégal</option>
              <option value="CI">Côte d'Ivoire</option>
              <option value="OTHER">Autre</option>
            </select>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-900 to-blue-800 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-800 hover:to-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 flex items-center justify-center"
      >
        Continuer
        <ArrowRight className="ml-2 w-5 h-5" />
      </button>
    </form>
  );

  const renderStep2 = () => (
    <form onSubmit={handleStep2Submit} className="space-y-6">
      <div className="text-center mb-6">
        <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Vérification de votre email
        </h3>
        <p className="text-gray-600">
          Nous avons envoyé un code de vérification à <strong>{step1Data.email}</strong>
        </p>
      </div>

      <div>
        <label htmlFor="code" className="block text-sm font-medium text-blue-900 mb-2">
          Code de vérification *
        </label>
        <input
          id="code"
          type="text"
          required
          value={step2Data.code}
          onChange={(e) => handleInputChange(2, 'code', e.target.value)}
          className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white text-center text-lg font-mono"
          placeholder="1234"
          maxLength={6}
        />
        <p className="text-sm text-gray-500 mt-2 text-center">
          Saisissez le code à 4-6 chiffres reçu par email
        </p>
      </div>

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={goToPreviousStep}
          className="flex-1 border-2 border-blue-200 text-blue-700 py-3 px-6 rounded-lg font-medium hover:bg-blue-50 focus:ring-4 focus:ring-blue-200 transition-all duration-200 flex items-center justify-center"
        >
          <ArrowLeft className="mr-2 w-5 h-5" />
          Retour
        </button>
        
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-blue-900 to-blue-800 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-800 hover:to-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 flex items-center justify-center"
        >
          Vérifier
          <ArrowRight className="ml-2 w-5 h-5" />
        </button>
      </div>
    </form>
  );

  const renderStep3 = () => (
    <form onSubmit={handleStep3Submit} className="space-y-6">
      <div className="text-center mb-6">
        <Lock className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Créez votre mot de passe
        </h3>
        <p className="text-gray-600">
          Choisissez un mot de passe sécurisé pour votre compte
        </p>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-blue-900 mb-2">
          Mot de passe *
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-600" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={step3Data.password}
            onChange={(e) => handleInputChange(3, 'password', e.target.value)}
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
        <p className="text-sm text-gray-500 mt-2">
          Minimum 8 caractères, incluant majuscules, minuscules et chiffres
        </p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-900 mb-2">
          Confirmer le mot de passe *
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-600" />
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            required
            value={step3Data.confirmPassword}
            onChange={(e) => handleInputChange(3, 'confirmPassword', e.target.value)}
            className="w-full pl-10 pr-12 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
            placeholder="Confirmez votre mot de passe"
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

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={goToPreviousStep}
          className="flex-1 border-2 border-blue-200 text-blue-700 py-3 px-6 rounded-lg font-medium hover:bg-blue-50 focus:ring-4 focus:ring-blue-200 transition-all duration-200 flex items-center justify-center"
        >
          <ArrowLeft className="mr-2 w-5 h-5" />
          Retour
        </button>
        
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg font-medium hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-300 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Création...
            </div>
          ) : (
            <>
              Créer mon compte
              <CheckCircle className="ml-2 w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </form>
  );

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-900 rounded-full mb-4">
          <BookOpen className="w-8 h-8 text-yellow-400" />
        </div>
        <h1 className="text-2xl font-bold text-blue-900 mb-2">
          Créer un compte
        </h1>
        <p className="text-gray-600">
          Rejoignez Tous Statisticien Academy
        </p>
      </div>

      {/* Indicateur d'étapes */}
      {renderStepIndicator()}

      {/* Contenu des étapes */}
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Déjà un compte ?{' '}
          {onSwitchToLogin && (
            <button
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Se connecter
            </button>
          )}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          En créant un compte, vous acceptez nos{' '}
          <a href="/terms" className="text-blue-600 hover:text-blue-800">
            conditions d'utilisation
          </a>{' '}
          et notre{' '}
          <a href="/privacy" className="text-blue-600 hover:text-blue-800">
            politique de confidentialité
          </a>
        </p>
      </div>
    </div>
  );
};
