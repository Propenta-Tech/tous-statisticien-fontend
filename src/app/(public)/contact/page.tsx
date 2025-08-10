"use client"
import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Clock, 
  Send, 
  MessageSquare,
  User,
  Building,
  Star,
  CheckCircle,
  ArrowRight,
  Zap,
  Heart,
  Users,
  Award,
  BookOpen,
  Video,
  Target,
  TrendingUp,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import  Select  from '@/components/ui/Select';

// Informations de contact
const contactInfo = [
  {
    icon: Phone,
    title: 'Téléphone',
    value: '(+237) 694282767',
    description: 'Appelez-nous pour toute question',
    color: 'from-blue-500 to-purple-600',
    action: 'tel:+237694282767'
  },
  {
    icon: Mail,
    title: 'Email',
    value: 'contact@tous-statisticien.net',
    description: 'Envoyez-nous un message',
    color: 'from-green-500 to-teal-600',
    action: 'mailto:contact@tous-statisticien.net'
  },
  {
    icon: Globe,
    title: 'Site Web',
    value: 'www.tous-statisticien.net',
    description: 'Visitez notre plateforme',
    color: 'from-purple-500 to-pink-600',
    action: 'https://www.tous-statisticien.net'
  },
  {
    icon: MapPin,
    title: 'Adresse',
    value: 'Damas, Total Ebom',
    description: 'Rue de l\'aéroport',
    color: 'from-orange-500 to-red-600',
    action: null
  }
];

// Pays couverts
const countries = [
  'Bénin', 'Burkina Faso', 'Burundi', 'Cameroun', 'Centrafrique', 'Comores',
  'Congo', 'Côte d\'Ivoire', 'Gabon', 'Djibouti', 'Guinée', 'Guinée Équatoriale',
  'Haïti', 'Madagascar', 'Mali', 'Mauritanie', 'Niger', 'RDC', 'Sénégal', 'Tchad', 'Togo'
];

// Sujets de contact
const contactSubjects = [
  'Demande d\'information',
  'Inscription à un cours',
  'Support technique',
  'Partenariat',
  'Recrutement',
  'Autre'
];

// Horaires d'ouverture
const openingHours = [
  { day: 'Lundi - Vendredi', hours: '8h00 - 18h00' },
  { day: 'Samedi', hours: '9h00 - 16h00' },
  { day: 'Dimanche', hours: 'Fermé' }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simuler l'envoi du formulaire
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        country: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-8"
          >
            <Badge variant="solid" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white mb-6">
              📞 Contactez-Nous
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Parlons de Votre
              </span>
              <br />
              <span className="text-white">Avenir</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Notre équipe est là pour vous accompagner dans votre parcours de formation. 
              Contactez-nous et transformons ensemble vos ambitions en réalité.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              variant="primary"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold"
            >
              <Phone className="w-5 h-5 mr-2" />
              Appelez-Nous
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-semibold"
            >
              <Mail className="w-5 h-5 mr-2" />
              Envoyer un Email
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Nos <span className="text-blue-400">Coordonnées</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Plusieurs façons de nous contacter pour répondre à tous vos besoins
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 h-full text-center hover:bg-white/10 transition-all duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-r ${info.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <info.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{info.title}</h3>
                  <p className="text-gray-300 mb-1">{info.value}</p>
                  <p className="text-sm text-gray-400 mb-4">{info.description}</p>
                  {info.action && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                      onClick={() => info.action?.startsWith('http') ? window.open(info.action, '_blank') : window.location.href = info.action}
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Contacter
                    </Button>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Formulaire */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="mb-8">
                <h2 className="text-4xl font-bold text-white mb-4">
                  Envoyez-nous un <span className="text-blue-400">Message</span>
                </h2>
                <p className="text-xl text-gray-300">
                  Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais
                </p>
              </div>

              <Card className="bg-white/5 backdrop-blur-sm border border-white/10 p-8">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">Message Envoyé !</h3>
                    <p className="text-gray-300">
                      Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Nom complet *
                        </label>
                        <Input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                          placeholder="Votre nom complet"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email *
                        </label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                          placeholder="votre@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Téléphone
                        </label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                          placeholder="+237 XXX XXX XXX"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Pays *
                        </label>
                        <Select
                          value={formData.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                          required
                          className="bg-white/10 border-white/20 text-white"
                        >
                          <option value="">Sélectionnez votre pays</option>
                          {countries.map((country) => (
                            <option key={country} value={country} className="bg-slate-800">
                              {country}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Sujet *
                      </label>
                      <Select
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        required
                        className="bg-white/10 border-white/20 text-white"
                      >
                        <option value="">Sélectionnez un sujet</option>
                        {contactSubjects.map((subject) => (
                          <option key={subject} value={subject} className="bg-slate-800">
                            {subject}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Message *
                      </label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        required
                        rows={6}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                        placeholder="Décrivez votre demande ou question..."
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      variant="primary"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-lg font-semibold"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Envoyer le Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </Card>
            </motion.div>

            {/* Informations supplémentaires */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Horaires d'ouverture */}
              <Card className="bg-white/5 backdrop-blur-sm border border-white/10 p-8">
                <div className="flex items-center mb-6">
                  <Clock className="w-8 h-8 text-blue-400 mr-3" />
                  <h3 className="text-2xl font-bold text-white">Horaires d'ouverture</h3>
                </div>
                <div className="space-y-4">
                  {openingHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-white/10 last:border-b-0">
                      <span className="text-gray-300">{schedule.day}</span>
                      <span className="text-white font-medium">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Pays couverts */}
              <Card className="bg-white/5 backdrop-blur-sm border border-white/10 p-8">
                <div className="flex items-center mb-6">
                  <Globe className="w-8 h-8 text-purple-400 mr-3" />
                  <h3 className="text-2xl font-bold text-white">Pays couverts</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {countries.map((country, index) => (
                    <div key={index} className="flex items-center text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      <span className="text-sm">{country}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Statistiques rapides */}
              <Card className="bg-white/5 backdrop-blur-sm border border-white/10 p-8">
                <div className="flex items-center mb-6">
                  <TrendingUp className="w-8 h-8 text-green-400 mr-3" />
                  <h3 className="text-2xl font-bold text-white">Nos Chiffres</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">5000+</div>
                    <div className="text-sm text-gray-300">Étudiants formés</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">95%</div>
                    <div className="text-sm text-gray-300">Taux de réussite</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">21</div>
                    <div className="text-sm text-gray-300">Pays couverts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">24/7</div>
                    <div className="text-sm text-gray-300">Support disponible</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Prêt à Commencer Votre Formation ?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Rejoignez des milliers d'étudiants qui ont déjà transformé leur carrière 
              grâce à Tous Statisticien Academy
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="primary"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              >
                Commencer Maintenant
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
              >
                Voir les Cours
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
