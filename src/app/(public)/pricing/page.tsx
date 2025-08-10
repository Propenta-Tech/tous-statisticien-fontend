"use client"
import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  CheckCircle, 
  Star, 
  Zap, 
  Crown, 
  Users, 
  BookOpen, 
  Video, 
  MessageSquare,
  Target,
  TrendingUp,
  Shield,
  Award,
  Clock,
  Globe,
  ArrowRight,
  Play,
  Heart,
  Sparkles,
  Rocket,
  Gift,
  DollarSign,
  Calendar,
  Headphones,
  FileText,
  Monitor,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';

// Plans de prix
const pricingPlans = [
  {
    name: 'Découverte',
    price: { monthly: 15000, yearly: 150000 },
    currency: 'FCFA',
    description: 'Parfait pour commencer votre formation en statistiques',
    features: [
      'Accès à 5 cours de base',
      'Vidéos HD avec sous-titres',
      'Support de cours en PDF',
      'Quiz d\'évaluation',
      'Accès pendant 1 mois',
      'Support par email'
    ],
    icon: Play,
    color: 'from-blue-500 to-purple-600',
    popular: false,
    recommended: false
  },
  {
    name: 'Formation Complète',
    price: { monthly: 45000, yearly: 450000 },
    currency: 'FCFA',
    description: 'Formation complète avec accompagnement personnalisé',
    features: [
      'Accès à tous les cours (200+)',
      'Vidéos HD avec sous-titres',
      'Tous les supports de cours',
      'Quiz et évaluations complètes',
      'Accès pendant 6 mois',
      'Tutorat personnalisé',
      'Suivi pédagogique',
      'Support prioritaire',
      'Certificat de formation',
      'Accès à la communauté'
    ],
    icon: Crown,
    color: 'from-purple-500 to-pink-600',
    popular: true,
    recommended: true
  },
  {
    name: 'Premium',
    price: { monthly: 75000, yearly: 750000 },
    currency: 'FCFA',
    description: 'Formation premium avec services exclusifs',
    features: [
      'Tout du plan Formation Complète',
      'Accès illimité pendant 1 an',
      'Cours particuliers (2h/mois)',
      'Accompagnement personnalisé',
      'Préparation aux concours',
      'Simulations d\'examens',
      'Support téléphonique',
      'Certificat premium',
      'Accès aux ressources exclusives',
      'Mentorat individuel'
    ],
    icon: Sparkles,
    color: 'from-orange-500 to-red-600',
    popular: false,
    recommended: false
  }
];

// Fonctionnalités incluses
const includedFeatures = [
  {
    icon: Video,
    title: 'Vidéos HD',
    description: 'Cours vidéo en haute qualité avec sous-titres'
  },
  {
    icon: FileText,
    title: 'Supports PDF',
    description: 'Téléchargement de tous les supports de cours'
  },
  {
    icon: Target,
    title: 'Évaluations',
    description: 'Quiz et tests pour suivre votre progression'
  },
  {
    icon: MessageSquare,
    title: 'Support',
    description: 'Support technique et pédagogique disponible'
  },
  {
    icon: Globe,
    title: 'Multi-pays',
    description: 'Accès depuis tous les pays couverts'
  },
  {
    icon: Shield,
    title: 'Sécurisé',
    description: 'Paiement sécurisé et données protégées'
  }
];

// FAQ
const faq = [
  {
    question: 'Comment fonctionne le paiement ?',
    answer: 'Le paiement se fait en ligne de manière sécurisée via notre plateforme. Nous acceptons les cartes bancaires et les paiements mobiles.'
  },
  {
    question: 'Puis-je annuler mon abonnement ?',
    answer: 'Oui, vous pouvez annuler votre abonnement à tout moment. Le remboursement est possible selon nos conditions générales.'
  },
  {
    question: 'Les cours sont-ils accessibles hors ligne ?',
    answer: 'Certains supports PDF peuvent être téléchargés pour un accès hors ligne, mais les vidéos nécessitent une connexion internet.'
  },
  {
    question: 'Y a-t-il un essai gratuit ?',
    answer: 'Oui, nous offrons un essai gratuit de 7 jours pour découvrir notre plateforme avant de vous engager.'
  },
  {
    question: 'Les prix incluent-ils les taxes ?',
    answer: 'Tous nos prix sont affichés TTC (Toutes Taxes Comprises) et incluent tous les frais.'
  },
  {
    question: 'Puis-je changer de plan ?',
    answer: 'Oui, vous pouvez passer à un plan supérieur à tout moment. La différence sera calculée au prorata.'
  }
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  const getPrice = (plan: any) => {
    return isYearly ? plan.price.yearly : plan.price.monthly;
  };

  const getPeriod = () => {
    return isYearly ? 'an' : 'mois';
  };

  const getSavings = (plan: any) => {
    if (isYearly) {
      const monthlyTotal = plan.price.monthly * 12;
      const yearlyPrice = plan.price.yearly;
      return Math.round(((monthlyTotal - yearlyPrice) / monthlyTotal) * 100);
    }
    return 0;
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
              💎 Plans de Formation
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Choisissez Votre
              </span>
              <br />
              <span className="text-white">Formation</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Des plans adaptés à tous les besoins et budgets. 
              Investissez dans votre avenir avec nos formations de qualité.
            </p>
          </motion.div>

          {/* Toggle Annuel/Mensuel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex items-center justify-center gap-4 mb-12"
          >
            <span className="text-gray-300">Mensuel</span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="bg-blue-600"
            />
            <span className="text-gray-300">Annuel</span>
            {isYearly && (
              <Badge variant="solid" className="bg-green-500 text-white">
                Économisez jusqu'à 20%
              </Badge>
            )}
          </motion.div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`relative ${plan.popular ? 'lg:scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge variant="solid" className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                      <Star className="w-4 h-4 mr-1" />
                      Recommandé
                    </Badge>
                  </div>
                )}

                <Card className={`bg-white/5 backdrop-blur-sm border p-8 h-full ${
                  plan.popular 
                    ? 'border-purple-500/50 bg-gradient-to-b from-purple-500/10 to-transparent' 
                    : 'border-white/10'
                }`}>
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <plan.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-300 mb-6">{plan.description}</p>
                    
                    <div className="mb-4">
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-white">
                          {getPrice(plan).toLocaleString('fr-FR')}
                        </span>
                        <span className="text-gray-300 ml-2">FCFA</span>
                      </div>
                      <div className="text-gray-400">par {getPeriod()}</div>
                      {getSavings(plan) > 0 && (
                        <div className="text-green-400 text-sm mt-2">
                          Économisez {getSavings(plan)}%
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    size="lg"
                    variant={plan.popular ? "primary" : "outline"}
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white' 
                        : 'border-white/20 text-white hover:bg-white/10'
                    }`}
                    onClick={() => setSelectedPlan(plan.name)}
                  >
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Choisir ce Plan
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
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
              Tout <span className="text-blue-400">Inclus</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Découvrez toutes les fonctionnalités incluses dans nos plans de formation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {includedFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <Card className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 h-full hover:bg-white/10 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300 text-sm">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
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
              Questions <span className="text-green-400">Fréquentes</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Trouvez rapidement les réponses à vos questions sur nos plans de formation
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faq.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -2 }}
              >
                <Card className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">
                  <h3 className="text-lg font-semibold text-white mb-3">{item.question}</h3>
                  <p className="text-gray-300">{item.answer}</p>
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
              Prêt à Investir dans Votre Avenir ?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Rejoignez des milliers d'étudiants qui ont déjà transformé leur carrière 
              grâce à nos formations de qualité
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="primary"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              >
                <Gift className="w-5 h-5 mr-2" />
                Essai Gratuit 7 Jours
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Parler à un Expert
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
