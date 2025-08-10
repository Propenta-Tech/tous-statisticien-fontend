"use client"
import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Video, 
  FileText, 
  MessageSquare, 
  Target, 
  TrendingUp, 
  Shield,
  Users,
  BookOpen,
  Award,
  Globe,
  Clock,
  Play,
  Pause,
  Volume2,
  Maximize,
  Settings,
  Download,
  Share,
  Heart,
  Star,
  CheckCircle,
  ArrowRight,
  Zap,
  Brain,
  Rocket,
  Eye,
  Handshake,
  Smartphone,
  Monitor,
  Tablet,
  Headphones,
  Calendar,
  Bell,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Target as TargetIcon,
  Lightbulb,
  GraduationCap,
  Certificate,
  Trophy,
  Gift,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';

// Fonctionnalités principales
const mainFeatures = [
  {
    icon: Video,
    title: 'Cours Vidéo HD',
    description: 'Vidéos explicatives en haute qualité avec sous-titres et contrôles avancés',
    details: [
      'Qualité HD 1080p',
      'Sous-titres multilingues',
      'Contrôles de lecture avancés',
      'Mode hors ligne disponible',
      'Synchronisation multi-appareils'
    ],
    color: 'from-blue-500 to-purple-600',
    demo: 'video-player'
  },
  {
    icon: FileText,
    title: 'Ressources PDF',
    description: 'Téléchargement de cours, TD et exercices corrigés en format PDF',
    details: [
      'Supports de cours complets',
      'Exercices corrigés',
      'Fiches de révision',
      'Bibliothèque numérique',
      'Recherche avancée'
    ],
    color: 'from-green-500 to-teal-600',
    demo: 'pdf-viewer'
  },
  {
    icon: MessageSquare,
    title: 'Tutorat Personnalisé',
    description: 'Accompagnement individualisé selon votre rythme et vos besoins',
    details: [
      'Sessions individuelles',
      'Suivi personnalisé',
      'Feedback en temps réel',
      'Plan d\'étude adapté',
      'Mentorat expert'
    ],
    color: 'from-orange-500 to-red-600',
    demo: 'tutoring'
  },
  {
    icon: Target,
    title: 'Évaluations Interactives',
    description: 'Quiz et évaluations pour suivre votre progression en temps réel',
    details: [
      'Quiz automatiques',
      'Évaluations adaptatives',
      'Suivi des performances',
      'Certifications',
      'Rapports détaillés'
    ],
    color: 'from-purple-500 to-pink-600',
    demo: 'assessments'
  },
  {
    icon: TrendingUp,
    title: 'Suivi Pédagogique',
    description: 'Alertes, rappels et recommandations personnalisées',
    details: [
      'Tableau de bord personnel',
      'Alertes intelligentes',
      'Recommandations IA',
      'Suivi des objectifs',
      'Statistiques avancées'
    ],
    color: 'from-indigo-500 to-blue-600',
    demo: 'analytics'
  },
  {
    icon: Shield,
    title: 'Paiement Sécurisé',
    description: 'Paiement en ligne sécurisé pour les frais de formation',
    details: [
      'Paiement sécurisé SSL',
      'Multiples moyens de paiement',
      'Facturation automatique',
      'Historique des transactions',
      'Support 24/7'
    ],
    color: 'from-emerald-500 to-green-600',
    demo: 'payment'
  }
];

// Statistiques de la plateforme
const platformStats = [
  { number: '5000+', label: 'Étudiants actifs', icon: Users },
  { number: '200+', label: 'Cours disponibles', icon: BookOpen },
  { number: '95%', label: 'Taux de satisfaction', icon: Heart },
  { number: '21', label: 'Pays couverts', icon: Globe },
  { number: '24/7', label: 'Support disponible', icon: Clock },
  { number: '100%', label: 'Sécurisé', icon: Shield }
];

// Avantages de la plateforme
const advantages = [
  {
    icon: Brain,
    title: 'Apprentissage Adaptatif',
    description: 'L\'IA analyse votre progression et adapte le contenu à votre niveau',
    color: 'from-blue-500 to-purple-600'
  },
  {
    icon: Rocket,
    title: 'Performance Optimisée',
    description: 'Plateforme ultra-rapide avec chargement instantané des contenus',
    color: 'from-green-500 to-teal-600'
  },
  {
    icon: Eye,
    title: 'Interface Intuitive',
    description: 'Design moderne et ergonomique pour une expérience utilisateur optimale',
    color: 'from-orange-500 to-red-600'
  },
  {
    icon: Handshake,
    title: 'Communauté Active',
    description: 'Rejoignez une communauté d\'apprenants motivés et solidaires',
    color: 'from-purple-500 to-pink-600'
  }
];

// Démonstrations interactives
const demos = {
  'video-player': {
    title: 'Lecteur Vidéo Avancé',
    description: 'Découvrez notre lecteur vidéo avec contrôles avancés et fonctionnalités exclusives',
    features: ['Qualité HD', 'Sous-titres', 'Vitesse variable', 'Notes synchronisées']
  },
  'pdf-viewer': {
    title: 'Visionneuse PDF',
    description: 'Consultez et téléchargez tous vos supports de cours en PDF',
    features: ['Zoom avancé', 'Recherche texte', 'Annotations', 'Téléchargement']
  },
  'tutoring': {
    title: 'Système de Tutorat',
    description: 'Connectez-vous avec nos experts pour un accompagnement personnalisé',
    features: ['Chat en temps réel', 'Vidéoconférence', 'Partage d\'écran', 'Enregistrement']
  },
  'assessments': {
    title: 'Évaluations Interactives',
    description: 'Testez vos connaissances avec nos quiz et évaluations adaptatives',
    features: ['Questions variées', 'Feedback immédiat', 'Progression', 'Certification']
  },
  'analytics': {
    title: 'Tableau de Bord',
    description: 'Suivez votre progression avec des statistiques détaillées',
    features: ['Graphiques interactifs', 'Objectifs personnalisés', 'Recommandations', 'Historique']
  },
  'payment': {
    title: 'Paiement Sécurisé',
    description: 'Effectuez vos paiements en toute sécurité avec nos moyens de paiement multiples',
    features: ['Cartes bancaires', 'Paiement mobile', 'Facturation', 'Support']
  }
};

export default function FeaturesPage() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

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
              ⚡ Fonctionnalités Avancées
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Découvrez Nos
              </span>
              <br />
              <span className="text-white">Fonctionnalités</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Une plateforme révolutionnaire avec des outils avancés pour transformer 
              votre apprentissage des statistiques en une expérience exceptionnelle.
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
              <Play className="w-5 h-5 mr-2" />
              Voir la Démo
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-semibold"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Commencer Maintenant
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
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
              Plateforme <span className="text-blue-400">Performante</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Des chiffres qui parlent d'eux-mêmes
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {platformStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="py-20 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Fonctionnalités <span className="text-purple-400">Principales</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Découvrez les outils qui font de Tous Statisticien Academy 
              la plateforme la plus avancée pour votre formation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Liste des fonctionnalités */}
            <div className="space-y-6">
              {mainFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 10 }}
                  className={`cursor-pointer transition-all duration-300 ${
                    activeFeature === feature.demo ? 'bg-white/10' : 'hover:bg-white/5'
                  } rounded-2xl p-6 border border-white/10`}
                  onClick={() => setActiveFeature(feature.demo)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-300 mb-3">{feature.description}</p>
                      <div className="space-y-2">
                        {feature.details.slice(0, 3).map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-center text-sm text-gray-400">
                            <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                            {detail}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Démonstration interactive */}
            <div className="lg:sticky lg:top-8">
              <Card className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 h-full">
                {activeFeature ? (
                  <motion.div
                    key={activeFeature}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {demos[activeFeature as keyof typeof demos]?.title}
                      </h3>
                      <p className="text-gray-300">
                        {demos[activeFeature as keyof typeof demos]?.description}
                      </p>
                    </div>

                    {/* Simulation de l'interface */}
                    <div className="bg-slate-800 rounded-xl p-6 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <div className="text-xs text-gray-400">Démonstration</div>
                      </div>
                      
                      <div className="bg-slate-900 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-center space-x-4 mb-4">
                          <Play className="w-8 h-8 text-blue-400" />
                          <div className="flex-1 bg-slate-700 rounded-full h-2">
                            <div className="bg-blue-400 h-2 rounded-full w-1/3"></div>
                          </div>
                          <Volume2 className="w-6 h-6 text-gray-400" />
                          <Maximize className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="text-center text-sm text-gray-400">
                          Interface {demos[activeFeature as keyof typeof demos]?.title}
                        </div>
                      </div>

                      <div className="space-y-2">
                        {demos[activeFeature as keyof typeof demos]?.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-300">
                            <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      size="lg"
                      variant="primary"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Tester la Fonctionnalité
                    </Button>
                  </motion.div>
                ) : (
                  <div className="text-center py-12">
                    <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Sélectionnez une fonctionnalité
                    </h3>
                    <p className="text-gray-300">
                      Cliquez sur une fonctionnalité pour voir sa démonstration
                    </p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
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
              Pourquoi <span className="text-green-400">Nous Choisir</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Les avantages qui font de notre plateforme la référence en formation statistique
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => (
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
                  <div className={`w-16 h-16 bg-gradient-to-r ${advantage.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <advantage.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{advantage.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{advantage.description}</p>
                </Card>
              </motion.div>
            ))}
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
              Prêt à Découvrir Nos Fonctionnalités ?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Rejoignez des milliers d'étudiants qui utilisent déjà nos outils avancés 
              pour transformer leur apprentissage
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="primary"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Essayer Gratuitement
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Contacter l'Équipe
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
