"use client"
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Target, 
  Users, 
  Award, 
  Globe, 
  Heart, 
  Zap,
  BookOpen,
  Video,
  MessageSquare,
  TrendingUp,
  Shield,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Clock,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Lightbulb,
  Rocket,
  Eye,
  Brain,
  Handshake,
  Target as TargetIcon
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

// Valeurs de l'entreprise
const values = [
  {
    icon: Heart,
    title: 'Passion',
    description: 'Nous sommes passionnés par l\'éducation et l\'excellence académique',
    color: 'from-red-500 to-pink-600'
  },
  {
    icon: Target,
    title: 'Excellence',
    description: 'Nous visons l\'excellence dans tous nos programmes de formation',
    color: 'from-blue-500 to-purple-600'
  },
  {
    icon: Users,
    title: 'Communauté',
    description: 'Nous créons une communauté d\'apprenants solidaires et motivés',
    color: 'from-green-500 to-teal-600'
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'Nous innovons constamment pour améliorer l\'expérience d\'apprentissage',
    color: 'from-yellow-500 to-orange-600'
  }
];

// Équipe
const team = [
  {
    name: 'Dr. Jean-Pierre Nguemo',
    role: 'Fondateur & Directeur',
    expertise: 'Statisticien Senior, 15+ ans d\'expérience',
    avatar: '/team/founder.jpg',
    description: 'Expert en statistiques avec une passion pour l\'éducation et l\'innovation pédagogique.'
  },
  {
    name: 'Marie-Claire Mbarga',
    role: 'Directrice Pédagogique',
    expertise: 'Pédagogie & Formation',
    avatar: '/team/pedagogical.jpg',
    description: 'Spécialiste en pédagogie numérique et accompagnement personnalisé.'
  },
  {
    name: 'Ahmed Diallo',
    role: 'Responsable Technique',
    expertise: 'Développement & Innovation',
    avatar: '/team/technical.jpg',
    description: 'Expert en technologies éducatives et développement de plateformes.'
  }
];

// Chiffres clés
const keyFigures = [
  { number: '2018', label: 'Année de création', icon: Rocket },
  { number: '5000+', label: 'Étudiants formés', icon: Users },
  { number: '200+', label: 'Cours disponibles', icon: BookOpen },
  { number: '95%', label: 'Taux de réussite', icon: Award },
  { number: '21', label: 'Pays couverts', icon: Globe },
  { number: '24/7', label: 'Support disponible', icon: Clock }
];

// Mission et Vision
const missionVision = {
  mission: {
    title: 'Notre Mission',
    description: 'Transformer l\'apprentissage des statistiques en Afrique en offrant une formation de qualité, accessible et personnalisée pour préparer les étudiants aux défis du monde professionnel.',
    icon: TargetIcon,
    color: 'from-blue-600 to-purple-600'
  },
  vision: {
    title: 'Notre Vision',
    description: 'Devenir la référence panafricaine en formation statistique, en créant une génération de statisticiens compétents et innovants qui contribueront au développement du continent.',
    icon: Eye,
    color: 'from-purple-600 to-pink-600'
  }
};

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('mission');
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
              🌟 À Propos de Nous
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Notre Histoire
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Découvrez l'histoire passionnante de Tous Statisticien Academy, 
              une plateforme révolutionnaire née de la vision d'éduquer et de former 
              la prochaine génération de statisticiens africains.
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
              Voir Notre Vidéo
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-semibold"
            >
              <Users className="w-5 h-5 mr-2" />
              Rencontrer l'Équipe
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
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
              Mission & <span className="text-blue-400">Vision</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Notre engagement envers l'excellence académique et l'innovation pédagogique
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {Object.entries(missionVision).map(([key, item]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: key === 'mission' ? 0.1 : 0.3 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Card className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 h-full">
                  <div className={`w-20 h-20 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-gray-300 leading-relaxed text-lg">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Histoire Section */}
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
              Notre <span className="text-purple-400">Histoire</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              De l'idée à la réalité : l'évolution de Tous Statisticien Academy
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-600"></div>
              
              {/* Timeline Items */}
              <div className="space-y-12">
                {[
                  {
                    year: '2018',
                    title: 'Naissance de l\'idée',
                    description: 'Création de Tous Statisticien Academy avec la vision de démocratiser l\'accès à une formation de qualité en statistiques.',
                    icon: Lightbulb
                  },
                  {
                    year: '2019',
                    title: 'Premiers cours en ligne',
                    description: 'Lancement de la première plateforme avec des cours vidéo et des ressources pédagogiques.',
                    icon: Video
                  },
                  {
                    year: '2020',
                    title: 'Expansion panafricaine',
                    description: 'Extension de nos services à 21 pays d\'Afrique et d\'Haïti.',
                    icon: Globe
                  },
                  {
                    year: '2021',
                    title: 'Innovation technologique',
                    description: 'Intégration de l\'IA et de l\'apprentissage adaptatif pour personnaliser l\'expérience.',
                    icon: Brain
                  },
                  {
                    year: '2022',
                    title: '5000+ étudiants formés',
                    description: 'Atteinte du cap des 5000 étudiants formés avec un taux de réussite de 95%.',
                    icon: Award
                  },
                  {
                    year: '2023',
                    title: 'Plateforme révolutionnaire',
                    description: 'Lancement de la nouvelle plateforme avec des fonctionnalités avancées et une interface moderne.',
                    icon: Rocket
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center mb-4">
                          <item.icon className="w-6 h-6 text-blue-400 mr-3" />
                          <span className="text-2xl font-bold text-white">{item.year}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                        <p className="text-gray-300">{item.description}</p>
                      </div>
                    </div>
                    
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full border-4 border-slate-900 relative z-10"></div>
                    
                    <div className="w-1/2"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valeurs Section */}
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
              Nos <span className="text-green-400">Valeurs</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Les principes qui guident nos actions et définissent notre identité
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
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
                  <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{value.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Chiffres Clés Section */}
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
              Chiffres <span className="text-orange-400">Clés</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Les statistiques qui témoignent de notre impact et de notre croissance
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {keyFigures.map((figure, index) => (
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
                  <figure.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white mb-1">{figure.number}</div>
                  <div className="text-sm text-gray-300">{figure.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Équipe Section */}
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
              Notre <span className="text-blue-400">Équipe</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Les experts passionnés qui font de Tous Statisticien Academy une réalité
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 h-full text-center hover:bg-white/10 transition-all duration-300">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
                  <p className="text-blue-400 font-medium mb-1">{member.role}</p>
                  <p className="text-gray-400 text-sm mb-4">{member.expertise}</p>
                  <p className="text-gray-300 leading-relaxed">{member.description}</p>
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
              Rejoignez Notre Mission
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Ensemble, transformons l'éducation statistique en Afrique et créons 
              la prochaine génération de leaders dans le domaine des données
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="primary"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              >
                Commencer Votre Formation
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
              >
                Nous Contacter
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
