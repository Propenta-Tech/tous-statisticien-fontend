"use client"

import React, { useState } from 'react';
import { toast } from 'sonner';
import { 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  Send, 
  Loader2, 
  CheckCircle,
  BookOpen,
  MapPin,
  Clock
} from 'lucide-react';

interface ContactFormProps {
  onSuccess?: () => void;
  className?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  onSuccess,
  className = ''
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    agreeToTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      toast.error('Champs requis manquants', {
        description: 'Veuillez remplir tous les champs obligatoires',
        className: 'bg-red-50 text-red-900 border-red-200'
      });
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error('Conditions non acceptées', {
        description: 'Veuillez accepter les conditions d\'utilisation',
        className: 'bg-red-50 text-red-900 border-red-200'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Ici, vous appelleriez votre API pour envoyer le message
      // Simulons un délai d'API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSuccess(true);
      toast.success('Message envoyé !', {
        description: 'Nous vous répondrons dans les plus brefs délais',
        className: 'bg-green-50 text-green-900 border-green-200'
      });
      
      onSuccess?.();
    } catch (error) {
      toast.error('Erreur lors de l\'envoi', {
        description: 'Veuillez réessayer plus tard',
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
            Message envoyé !
          </h1>
          <p className="text-gray-600">
            Merci de nous avoir contactés
          </p>
        </div>

        {/* Message de confirmation */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <div className="text-center">
            <h3 className="font-medium text-green-900 mb-2">
              Confirmation reçue
            </h3>
            <p className="text-sm text-green-800 mb-4">
              Votre message a été envoyé avec succès. Notre équipe vous répondra dans les plus brefs délais.
            </p>
            <div className="text-xs text-green-700 space-y-1">
              <p>• Numéro de référence : {Date.now().toString().slice(-8)}</p>
              <p>• Temps de réponse estimé : 24-48h</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={() => setIsSuccess(false)}
            className="w-full bg-gradient-to-r from-blue-900 to-blue-800 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-800 hover:to-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200"
          >
            Envoyer un autre message
          </button>
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
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <BookOpen className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-blue-900 mb-2">
          Contactez-nous
        </h1>
        <p className="text-gray-600">
          Nous sommes là pour vous aider
        </p>
      </div>

      {/* Informations de contact */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">Adresse</p>
              <p className="text-xs text-blue-700">123 Rue de l'Éducation<br />75001 Paris, France</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-900">Email</p>
              <p className="text-xs text-green-700">contact@tousstatisticien.com</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-orange-900">Horaires</p>
              <p className="text-xs text-orange-700">Lun-Ven: 9h-18h<br />Sam: 9h-12h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations personnelles */}
        <div className="bg-white border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Vos informations
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Prénom */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-blue-900 mb-2">
                Prénom *
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                placeholder="Votre prénom"
              />
            </div>

            {/* Nom */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-blue-900 mb-2">
                Nom *
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                placeholder="Votre nom"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-blue-900 mb-2">
                Adresse email *
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

            {/* Téléphone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-blue-900 mb-2">
                Téléphone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-600" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sujet et message */}
        <div className="bg-white border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Votre message
          </h3>
          
          <div className="space-y-4">
            {/* Sujet */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-blue-900 mb-2">
                Sujet *
              </label>
              <select
                id="subject"
                name="subject"
                required
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
              >
                <option value="">Sélectionner un sujet</option>
                <option value="general">Question générale</option>
                <option value="technical">Support technique</option>
                <option value="billing">Facturation</option>
                <option value="partnership">Partenariat</option>
                <option value="feedback">Retour d'expérience</option>
                <option value="other">Autre</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-blue-900 mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white resize-none"
                placeholder="Décrivez votre demande en détail..."
              />
            </div>
          </div>
        </div>

        {/* Conditions */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <label className="flex items-start space-x-3">
            <input
              name="agreeToTerms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="w-4 h-4 text-orange-600 border-orange-300 rounded focus:ring-orange-500 focus:ring-2 mt-1"
            />
            <span className="text-sm text-orange-800">
              J'accepte que mes données soient traitées pour traiter ma demande. 
              Vos données sont protégées et ne seront jamais partagées avec des tiers. 
              <a href="/privacy" className="text-orange-700 hover:text-orange-900 font-medium ml-1">
                En savoir plus
              </a>
            </span>
          </label>
        </div>

        {/* Bouton d'envoi */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg font-medium hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <div className="flex items-center">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Envoi en cours...
            </div>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Envoyer le message
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Besoin d'aide urgente ?{' '}
          <a href="/faq" className="text-blue-600 hover:text-blue-800 font-medium">
            Consultez notre FAQ
          </a>
        </p>
      </div>
    </div>
  );
};
