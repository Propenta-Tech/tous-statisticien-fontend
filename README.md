# RÉFÉRENCE COMPLÈTE DES FICHIERS - TOUS STATISTICIEN ACADEMY

## 📁 STRUCTURE DU PROJET (150+ fichiers)

### 🏠 **APP DIRECTORY - Pages et Routes**

#### Pages principales
- `src/app/page.tsx` - Page d'accueil principale
- `src/app/loading.tsx` - Composant de chargement global
- `src/app/error.tsx` - Page d'erreur globale
- `src/app/not-found.tsx` - Page 404
- `src/app/layout.tsx` - Layout racine avec AuthProvider

#### 🔐 **AUTH PAGES - (auth) group**
- `src/app/(auth)/layout.tsx` - Layout pour pages d'authentification
- `src/app/(auth)/login/page.tsx` - Page de connexion
- `src/app/(auth)/register/step-1/page.tsx` - Inscription étape 1 (infos perso)
- `src/app/(auth)/register/step-2/page.tsx` - Inscription étape 2 (vérification code)
- `src/app/(auth)/register/step-3/page.tsx` - Inscription étape 3 (mot de passe)
- `src/app/(auth)/forgot-password/page.tsx` - Mot de passe oublié
- `src/app/(auth)/reset-password/page.tsx` - Réinitialisation mot de passe

#### 📊 **DASHBOARD PAGES - (dashboard) group**

##### Layout commun
- `src/app/(dashboard)/layout.tsx` - Layout dashboard avec sidebar/header

##### 👨‍🎓 **STUDENT PAGES**
- `src/app/(dashboard)/student/layout.tsx` - Layout étudiant
- `src/app/(dashboard)/student/dashboard/page.tsx` - Dashboard étudiant
- `src/app/(dashboard)/student/classes/page.tsx` - Liste des classes
- `src/app/(dashboard)/student/classes/[id]/page.tsx` - Détail d'une classe
- `src/app/(dashboard)/student/classes/[id]/modules/[moduleId]/page.tsx` - Modules
- `src/app/(dashboard)/student/classes/[id]/modules/[moduleId]/lectures/[lectureId]/page.tsx` - Lectures
- `src/app/(dashboard)/student/evaluations/page.tsx` - Évaluations
- `src/app/(dashboard)/student/evaluations/[id]/page.tsx` - Détail évaluation
- `src/app/(dashboard)/student/profile/page.tsx` - Profil étudiant
- `src/app/(dashboard)/student/results/page.tsx` - Résultats

##### 👨‍💼 **ADMIN PAGES**
- `src/app/(dashboard)/admin/layout.tsx` - Layout admin
- `src/app/(dashboard)/admin/dashboard/page.tsx` - Dashboard admin
- `src/app/(dashboard)/admin/users/page.tsx` - Gestion utilisateurs
- `src/app/(dashboard)/admin/classes/page.tsx` - Gestion classes
- `src/app/(dashboard)/admin/modules/page.tsx` - Gestion modules
- `src/app/(dashboard)/admin/lectures/page.tsx` - Gestion lectures
- `src/app/(dashboard)/admin/evaluations/page.tsx` - Gestion évaluations
- `src/app/(dashboard)/admin/submissions/page.tsx` - Corrections
- `src/app/(dashboard)/admin/resources/page.tsx` - Ressources
- `src/app/(dashboard)/admin/payments/page.tsx` - Paiements
- `src/app/(dashboard)/admin/statistics/page.tsx` - Statistiques
- `src/app/(dashboard)/admin/settings/page.tsx` - Paramètres

#### 🌐 **PUBLIC PAGES - (public) group**
- `src/app/(public)/layout.tsx` - Layout pages publiques
- `src/app/(public)/about/page.tsx` - À propos
- `src/app/(public)/contact/page.tsx` - Contact
- `src/app/(public)/pricing/page.tsx` - Tarifs
- `src/app/(public)/features/page.tsx` - Fonctionnalités

### 🧩 **COMPOSANTS**

#### 🎨 **UI COMPONENTS - Composants de base**
- `src/components/ui/Button.tsx` - Boutons stylisés
- `src/components/ui/Input.tsx` - Champs de saisie
- `src/components/ui/Modal.tsx` - Modales
- `src/components/ui/Card.tsx` - Cartes
- `src/components/ui/Badge.tsx` - Badges de statut
- `src/components/ui/Avatar.tsx` - Avatars utilisateurs
- `src/components/ui/Dropdown.tsx` - Menus déroulants
- `src/components/ui/Tabs.tsx` - Onglets
- `src/components/ui/Table.tsx` - Tableaux
- `src/components/ui/Pagination.tsx` - Pagination
- `src/components/ui/ProgressBar.tsx` - Barres de progression
- `src/components/ui/Spinner.tsx` - Indicateurs de chargement
- `src/components/ui/Toast.tsx` - Notifications toast
- `src/components/ui/Tooltip.tsx` - Info-bulles
- `src/components/ui/Select.tsx` - Sélecteurs
- `src/components/ui/Checkbox.tsx` - Cases à cocher
- `src/components/ui/Radio.tsx` - Boutons radio
- `src/components/ui/Textarea.tsx` - Zones de texte
- `src/components/ui/FileUpload.tsx` - Upload de fichiers
- `src/components/ui/DatePicker.tsx` - Sélecteur de date
- `src/components/ui/TimePicker.tsx` - Sélecteur d'heure
- `src/components/ui/Switch.tsx` - Interrupteurs
- `src/components/ui/Slider.tsx` - Curseurs

#### 📋 **FORM COMPONENTS - Formulaires**
- `src/components/forms/LoginForm.tsx` - Formulaire connexion
- `src/components/forms/RegisterForm.tsx` - Formulaire inscription
- `src/components/forms/ForgotPasswordForm.tsx` - Mot de passe oublié
- `src/components/forms/ResetPasswordForm.tsx` - Réinitialisation
- `src/components/forms/ProfileForm.tsx` - Modification profil
- `src/components/forms/ChangePasswordForm.tsx` - Changer mot de passe
- `src/components/forms/ContactForm.tsx` - Formulaire contact
- `src/components/forms/VirtualClassForm.tsx` - Créer/modifier classe
- `src/components/forms/ModuleForm.tsx` - Créer/modifier module
- `src/components/forms/LectureForm.tsx` - Créer/modifier lecture
- `src/components/forms/EvaluationForm.tsx` - Créer/modifier évaluation
- `src/components/forms/SubmissionForm.tsx` - Soumettre travail
- `src/components/forms/ResourceForm.tsx` - Ajouter ressource
- `src/components/forms/PaymentForm.tsx` - Paiement
- `src/components/forms/SearchForm.tsx` - Recherche

#### 🏗️ **LAYOUT COMPONENTS - Structure**
- `src/components/layout/Header.tsx` - En-tête principal
- `src/components/layout/Footer.tsx` - Pied de page
- `src/components/layout/Navbar.tsx` - Barre de navigation
- `src/components/layout/Sidebar.tsx` - Barre latérale
- `src/components/layout/MobileMenu.tsx` - Menu mobile
- `src/components/layout/Breadcrumb.tsx` - Fil d'Ariane
- `src/components/layout/PageHeader.tsx` - En-tête de page
- `src/components/layout/Container.tsx` - Conteneur
- `src/components/layout/Section.tsx` - Sections

#### 🎥 **VIDEO COMPONENTS - Lecteur vidéo**
- `src/components/video/VideoPlayer.tsx` - Lecteur principal
- `src/components/video/VideoControls.tsx` - Contrôles vidéo
- `src/components/video/VideoProgress.tsx` - Barre de progression
- `src/components/video/VideoQuality.tsx` - Sélection qualité
- `src/components/video/VideoPlaylist.tsx` - Liste de lecture

#### 📊 **CHART COMPONENTS - Graphiques**
- `src/components/charts/LineChart.tsx` - Graphique linéaire
- `src/components/charts/BarChart.tsx` - Graphique en barres
- `src/components/charts/PieChart.tsx` - Graphique circulaire
- `src/components/charts/AreaChart.tsx` - Graphique en aires
- `src/components/charts/DonutChart.tsx` - Graphique donut
- `src/components/charts/StatCard.tsx` - Cartes statistiques
- `src/components/charts/MetricCard.tsx` - Cartes métriques
- `src/components/charts/ProgressChart.tsx` - Graphique progression

#### 📈 **DASHBOARD COMPONENTS**
- `src/components/dashboard/StudentDashboard.tsx` - Dashboard étudiant
- `src/components/dashboard/AdminDashboard.tsx` - Dashboard admin
- `src/components/dashboard/StatsOverview.tsx` - Vue d'ensemble stats
- `src/components/dashboard/RecentActivity.tsx` - Activité récente
- `src/components/dashboard/QuickActions.tsx` - Actions rapides
- `src/components/dashboard/NotificationPanel.tsx` - Panneau notifications
- `src/components/dashboard/CalendarWidget.tsx` - Widget calendrier
- `src/components/dashboard/ProgressWidget.tsx` - Widget progression

#### 🎯 **SPECIALIZED COMPONENTS - Spécialisés**
- `src/components/specialized/ClassCard.tsx` - Carte classe
- `src/components/specialized/ModuleCard.tsx` - Carte module
- `src/components/specialized/LectureCard.tsx` - Carte lecture
- `src/components/specialized/EvaluationCard.tsx` - Carte évaluation
- `src/components/specialized/UserCard.tsx` - Carte utilisateur
- `src/components/specialized/PaymentCard.tsx` - Carte paiement
- `src/components/specialized/ResourceCard.tsx` - Carte ressource
- `src/components/specialized/SubmissionCard.tsx` - Carte soumission
- `src/components/specialized/GradeCard.tsx` - Carte note
- `src/components/specialized/NotificationCard.tsx` - Carte notification
- `src/components/specialized/AchievementCard.tsx` - Carte achievement
- `src/components/specialized/TestimonialCard.tsx` - Témoignage

### 🪝 **HOOKS PERSONNALISÉS**
- `src/hooks/useAuth.ts` - Hook authentification
- `src/hooks/useLocalStorage.ts` - Hook localStorage
- `src/hooks/useDebounce.ts` - Hook debounce
- `src/hooks/useIntersectionObserver.ts` - Hook intersection observer
- `src/hooks/useClickOutside.ts` - Hook clic extérieur
- `src/hooks/useWindowSize.ts` - Hook taille fenêtre
- `src/hooks/useScrollPosition.ts` - Hook position scroll
- `src/hooks/useCopyToClipboard.ts` - Hook copier-coller
- `src/hooks/useToggle.ts` - Hook toggle
- `src/hooks/usePrevious.ts` - Hook valeur précédente
- `src/hooks/useAsync.ts` - Hook async
- `src/hooks/useForm.ts` - Hook formulaire
- `src/hooks/useApi.ts` - Hook API
- `src/hooks/useCache.ts` - Hook cache
- `src/hooks/usePermissions.ts` - Hook permissions
- `src/hooks/useVideoPlayer.ts` - Hook lecteur vidéo
- `src/hooks/useUpload.ts` - Hook upload
- `src/hooks/usePayment.ts` - Hook paiement
- `src/hooks/useStatistics.ts` - Hook statistiques
- `src/hooks/useNotifications.ts` - Hook notifications
- `src/hooks/useSearch.ts` - Hook recherche
- `src/hooks/usePagination.ts` - Hook pagination

### 🗄️ **STORES ZUSTAND**
- `src/store/authStore.ts` - Store authentification
- `src/store/uiStore.ts` - Store interface utilisateur
- `src/store/notificationStore.ts` - Store notifications
- `src/store/cacheStore.ts` - Store cache
- `src/store/settingsStore.ts` - Store paramètres
- `src/store/videoStore.ts` - Store lecteur vidéo
- `src/store/searchStore.ts` - Store recherche

# RÉFÉRENCE COMPLÈTE DES FICHIERS - TOUS STATISTICIEN ACADEMY

## 📁 STRUCTURE DU PROJET (150+ fichiers)

### 🏠 **APP DIRECTORY - Pages et Routes**

#### Pages principales
- `src/app/page.tsx` - Page d'accueil principale
- `src/app/loading.tsx` - Composant de chargement global
- `src/app/error.tsx` - Page d'erreur globale
- `src/app/not-found.tsx` - Page 404
- `src/app/layout.tsx` - Layout racine avec AuthProvider

#### 🔐 **AUTH PAGES - (auth) group**
- `src/app/(auth)/layout.tsx` - Layout pour pages d'authentification
- `src/app/(auth)/login/page.tsx` - Page de connexion
- `src/app/(auth)/register/step-1/page.tsx` - Inscription étape 1 (infos perso)
- `src/app/(auth)/register/step-2/page.tsx` - Inscription étape 2 (vérification code)
- `src/app/(auth)/register/step-3/page.tsx` - Inscription étape 3 (mot de passe)
- `src/app/(auth)/forgot-password/page.tsx` - Mot de passe oublié
- `src/app/(auth)/reset-password/page.tsx` - Réinitialisation mot de passe

#### 📊 **DASHBOARD PAGES - (dashboard) group**

##### Layout commun
- `src/app/(dashboard)/layout.tsx` - Layout dashboard avec sidebar/header

##### 👨‍🎓 **STUDENT PAGES**
- `src/app/(dashboard)/student/layout.tsx` - Layout étudiant
- `src/app/(dashboard)/student/dashboard/page.tsx` - Dashboard étudiant
- `src/app/(dashboard)/student/classes/page.tsx` - Liste des classes
- `src/app/(dashboard)/student/classes/[id]/page.tsx` - Détail d'une classe
- `src/app/(dashboard)/student/classes/[id]/modules/[moduleId]/page.tsx` - Modules
- `src/app/(dashboard)/student/classes/[id]/modules/[moduleId]/lectures/[lectureId]/page.tsx` - Lectures
- `src/app/(dashboard)/student/evaluations/page.tsx` - Évaluations
- `src/app/(dashboard)/student/evaluations/[id]/page.tsx` - Détail évaluation
- `src/app/(dashboard)/student/profile/page.tsx` - Profil étudiant
- `src/app/(dashboard)/student/results/page.tsx` - Résultats

##### 👨‍💼 **ADMIN PAGES**
- `src/app/(dashboard)/admin/layout.tsx` - Layout admin
- `src/app/(dashboard)/admin/dashboard/page.tsx` - Dashboard admin
- `src/app/(dashboard)/admin/users/page.tsx` - Gestion utilisateurs
- `src/app/(dashboard)/admin/classes/page.tsx` - Gestion classes
- `src/app/(dashboard)/admin/modules/page.tsx` - Gestion modules
- `src/app/(dashboard)/admin/lectures/page.tsx` - Gestion lectures
- `src/app/(dashboard)/admin/evaluations/page.tsx` - Gestion évaluations
- `src/app/(dashboard)/admin/submissions/page.tsx` - Corrections
- `src/app/(dashboard)/admin/resources/page.tsx` - Ressources
- `src/app/(dashboard)/admin/payments/page.tsx` - Paiements
- `src/app/(dashboard)/admin/statistics/page.tsx` - Statistiques
- `src/app/(dashboard)/admin/settings/page.tsx` - Paramètres

#### 🌐 **PUBLIC PAGES - (public) group**
- `src/app/(public)/layout.tsx` - Layout pages publiques
- `src/app/(public)/about/page.tsx` - À propos
- `src/app/(public)/contact/page.tsx` - Contact
- `src/app/(public)/pricing/page.tsx` - Tarifs
- `src/app/(public)/features/page.tsx` - Fonctionnalités

### 🧩 **COMPOSANTS**

#### 🎨 **UI COMPONENTS - Composants de base**
- `src/components/ui/Button.tsx` - Boutons stylisés
- `src/components/ui/Input.tsx` - Champs de saisie
- `src/components/ui/Modal.tsx` - Modales
- `src/components/ui/Card.tsx` - Cartes
- `src/components/ui/Badge.tsx` - Badges de statut
- `src/components/ui/Avatar.tsx` - Avatars utilisateurs
- `src/components/ui/Dropdown.tsx` - Menus déroulants
- `src/components/ui/Tabs.tsx` - Onglets
- `src/components/ui/Table.tsx` - Tableaux
- `src/components/ui/Pagination.tsx` - Pagination
- `src/components/ui/ProgressBar.tsx` - Barres de progression
- `src/components/ui/Spinner.tsx` - Indicateurs de chargement
- `src/components/ui/Toast.tsx` - Notifications toast
- `src/components/ui/Tooltip.tsx` - Info-bulles
- `src/components/ui/Select.tsx` - Sélecteurs
- `src/components/ui/Checkbox.tsx` - Cases à cocher
- `src/components/ui/Radio.tsx` - Boutons radio
- `src/components/ui/Textarea.tsx` - Zones de texte
- `src/components/ui/FileUpload.tsx` - Upload de fichiers
- `src/components/ui/DatePicker.tsx` - Sélecteur de date
- `src/components/ui/TimePicker.tsx` - Sélecteur d'heure
- `src/components/ui/Switch.tsx` - Interrupteurs
- `src/components/ui/Slider.tsx` - Curseurs

#### 📋 **FORM COMPONENTS - Formulaires**
- `src/components/forms/LoginForm.tsx` - Formulaire connexion
- `src/components/forms/RegisterForm.tsx` - Formulaire inscription
- `src/components/forms/ForgotPasswordForm.tsx` - Mot de passe oublié
- `src/components/forms/ResetPasswordForm.tsx` - Réinitialisation
- `src/components/forms/ProfileForm.tsx` - Modification profil
- `src/components/forms/ChangePasswordForm.tsx` - Changer mot de passe
- `src/components/forms/ContactForm.tsx` - Formulaire contact
- `src/components/forms/VirtualClassForm.tsx` - Créer/modifier classe
- `src/components/forms/ModuleForm.tsx` - Créer/modifier module
- `src/components/forms/LectureForm.tsx` - Créer/modifier lecture
- `src/components/forms/EvaluationForm.tsx` - Créer/modifier évaluation
- `src/components/forms/SubmissionForm.tsx` - Soumettre travail
- `src/components/forms/ResourceForm.tsx` - Ajouter ressource
- `src/components/forms/PaymentForm.tsx` - Paiement
- `src/components/forms/SearchForm.tsx` - Recherche

#### 🏗️ **LAYOUT COMPONENTS - Structure**
- `src/components/layout/Header.tsx` - En-tête principal
- `src/components/layout/Footer.tsx` - Pied de page
- `src/components/layout/Navbar.tsx` - Barre de navigation
- `src/components/layout/Sidebar.tsx` - Barre latérale
- `src/components/layout/MobileMenu.tsx` - Menu mobile
- `src/components/layout/Breadcrumb.tsx` - Fil d'Ariane
- `src/components/layout/PageHeader.tsx` - En-tête de page
- `src/components/layout/Container.tsx` - Conteneur
- `src/components/layout/Section.tsx` - Sections

#### 🎥 **VIDEO COMPONENTS - Lecteur vidéo**
- `src/components/video/VideoPlayer.tsx` - Lecteur principal
- `src/components/video/VideoControls.tsx` - Contrôles vidéo
- `src/components/video/VideoProgress.tsx` - Barre de progression
- `src/components/video/VideoQuality.tsx` - Sélection qualité
- `src/components/video/VideoPlaylist.tsx` - Liste de lecture

#### 📊 **CHART COMPONENTS - Graphiques**
- `src/components/charts/LineChart.tsx` - Graphique linéaire
- `src/components/charts/BarChart.tsx` - Graphique en barres
- `src/components/charts/PieChart.tsx` - Graphique circulaire
- `src/components/charts/AreaChart.tsx` - Graphique en aires
- `src/components/charts/DonutChart.tsx` - Graphique donut
- `src/components/charts/StatCard.tsx` - Cartes statistiques
- `src/components/charts/MetricCard.tsx` - Cartes métriques
- `src/components/charts/ProgressChart.tsx` - Graphique progression

#### 📈 **DASHBOARD COMPONENTS**
- `src/components/dashboard/StudentDashboard.tsx` - Dashboard étudiant
- `src/components/dashboard/AdminDashboard.tsx` - Dashboard admin
- `src/components/dashboard/StatsOverview.tsx` - Vue d'ensemble stats
- `src/components/dashboard/RecentActivity.tsx` - Activité récente
- `src/components/dashboard/QuickActions.tsx` - Actions rapides
- `src/components/dashboard/NotificationPanel.tsx` - Panneau notifications
- `src/components/dashboard/CalendarWidget.tsx` - Widget calendrier
- `src/components/dashboard/ProgressWidget.tsx` - Widget progression

#### 🎯 **SPECIALIZED COMPONENTS - Spécialisés**
- `src/components/specialized/ClassCard.tsx` - Carte classe
- `src/components/specialized/ModuleCard.tsx` - Carte module
- `src/components/specialized/LectureCard.tsx` - Carte lecture
- `src/components/specialized/EvaluationCard.tsx` - Carte évaluation
- `src/components/specialized/UserCard.tsx` - Carte utilisateur
- `src/components/specialized/PaymentCard.tsx` - Carte paiement
- `src/components/specialized/ResourceCard.tsx` - Carte ressource
- `src/components/specialized/SubmissionCard.tsx` - Carte soumission
- `src/components/specialized/GradeCard.tsx` - Carte note
- `src/components/specialized/NotificationCard.tsx` - Carte notification
- `src/components/specialized/AchievementCard.tsx` - Carte achievement
- `src/components/specialized/TestimonialCard.tsx` - Témoignage

### 🪝 **HOOKS PERSONNALISÉS**
- `src/hooks/useAuth.ts` - Hook authentification
- `src/hooks/useLocalStorage.ts` - Hook localStorage
- `src/hooks/useDebounce.ts` - Hook debounce
- `src/hooks/useIntersectionObserver.ts` - Hook intersection observer
- `src/hooks/useClickOutside.ts` - Hook clic extérieur
- `src/hooks/useWindowSize.ts` - Hook taille fenêtre
- `src/hooks/useScrollPosition.ts` - Hook position scroll
- `src/hooks/useCopyToClipboard.ts` - Hook copier-coller
- `src/hooks/useToggle.ts` - Hook toggle
- `src/hooks/usePrevious.ts` - Hook valeur précédente
- `src/hooks/useAsync.ts` - Hook async
- `src/hooks/useForm.ts` - Hook formulaire
- `src/hooks/useApi.ts` - Hook API
- `src/hooks/useCache.ts` - Hook cache
- `src/hooks/usePermissions.ts` - Hook permissions
- `src/hooks/useVideoPlayer.ts` - Hook lecteur vidéo
- `src/hooks/useUpload.ts` - Hook upload
- `src/hooks/usePayment.ts` - Hook paiement
- `src/hooks/useStatistics.ts` - Hook statistiques
- `src/hooks/useNotifications.ts` - Hook notifications
- `src/hooks/useSearch.ts` - Hook recherche
- `src/hooks/usePagination.ts` - Hook pagination

### 🗄️ **STORES ZUSTAND**
- `src/store/authStore.ts` - Store authentification
- `src/store/uiStore.ts` - Store interface utilisateur
- `src/store/notificationStore.ts` - Store notifications
- `src/store/cacheStore.ts` - Store cache
- `src/store/settingsStore.ts` - Store paramètres
- `src/store/videoStore.ts` - Store lecteur vidéo
- `src/store/searchStore.ts` - Store recherche

### 🌐 **SERVICES API**
- `src/lib/api/client.ts` - Client HTTP principal
- `src/lib/api/auth.ts` - Service authentification
- `src/lib/api/virtualClass.ts` - Service classes virtuelles
- `src/lib/api/module.ts` - Service modules
- `src/lib/api/lecture.ts` - Service lectures
- `src/lib/api/evaluation.ts` - Service évaluations
- `src/lib/api/submission.ts` - Service soumissions
- `src/lib/api/payment.ts` - Service paiements
- `src/lib/api/person.ts` - Service personnes
- `src/lib/api/resource.ts` - Service ressources
- `src/lib/api/statistics.ts` - Service statistiques
- `src/lib/api/upload.ts` - Service upload fichiers
- `src/lib/api/freemopay.ts` - Intégration Freemopay

### 🔧 **UTILITAIRES**
- `src/lib/utils/index.ts` - Utilitaires principaux
- `src/lib/utils/constants.ts` - Constantes globales
- `src/lib/utils/helpers.ts` - Fonctions d'aide
- `src/lib/utils/formatters.ts` - Formatage données
- `src/lib/utils/validators.ts` - Validation données
- `src/lib/utils/crypto.ts` - Cryptographie
- `src/lib/utils/date.ts` - Manipulation dates
- `src/lib/utils/file.ts` - Gestion fichiers
- `src/lib/utils/url.ts` - Manipulation URLs
- `src/lib/utils/math.ts` - Calculs mathématiques

### 🔐 **AUTHENTIFICATION**
- `src/lib/auth/context.tsx` - Contexte authentification
- `src/lib/auth/guards.tsx` - Guards de protection
- `src/lib/auth/permissions.ts` - Gestion permissions
- `src/lib/auth/roles.ts` - Définition rôles
- `src/lib/auth/cache.ts` - Cache utilisateur
- `src/lib/auth/middleware.ts` - Middleware auth

### ✅ **VALIDATIONS**
- `src/lib/validations/index.ts` - Schémas principaux
- `src/lib/validations/auth.ts` - Validation authentification
- `src/lib/validations/forms.ts` - Validation formulaires
- `src/lib/validations/api.ts` - Validation API

### 📝 **TYPES TYPESCRIPT**
- `src/types/index.ts` - Types principaux
- `src/types/api.ts` - Types API
- `src/types/auth.ts` - Types authentification
- `src/types/components.ts` - Types composants
- `src/types/forms.ts` - Types formulaires
- `src/types/database.ts` - Types base de données

### 📊 **CONSTANTES**
- `src/constants/index.ts` - Export constantes
- `src/constants/api.ts` - URLs et endpoints API
- `src/constants/routes.ts` - Routes application
- `src/constants/countries.ts` - Liste des pays
- `src/constants/colors.ts` - Palette couleurs
- `src/constants/messages.ts` - Messages utilisateur
- `src/constants/config.ts` - Configuration app

### ⚙️ **CONFIGURATION**
- `next.config.js` - Configuration Next.js
- `tailwind.config.js` - Configuration Tailwind CSS
- `tsconfig.json` - Configuration TypeScript
- `.env.local.example` - Variables d'environnement exemple
- `.env.local` - Variables d'environnement locales
- `.gitignore` - Fichiers ignorés Git
- `package.json` - Dépendances et scripts
- `README.md` - Documentation projet
- `src/middleware.ts` - Middleware Next.js

### 📱 **PWA & ASSETS**
- `public/manifest.json` - Manifeste PWA
- `public/sw.js` - Service Worker
- `public/browserconfig.xml` - Config navigateurs
- `public/robots.txt` - Instructions robots
- `public/sitemap.xml` - Plan du site
- `public/favicon.ico` - Favicon
- `public/images/` - Dossier images
- `public/icons/` - Dossier icônes

## 🎯 **ORDRE DE DÉVELOPPEMENT RECOMMANDÉ**

### Phase 1: Fondation (Semaine 1-2)
1. Configuration projet (next.config.js, tailwind.config.js)
2. Types et interfaces (src/types/)
3. Utilitaires de base (src/lib/utils/)
4. Composants UI de base (src/components/ui/)
5. Client API (src/lib/api/client.ts)

### Phase 2: Authentification (Semaine 2-3)
1. Services API auth (src/lib/api/auth.ts)
2. Contexte auth (src/lib/auth/context.tsx)
3. Validations auth (src/lib/validations/)
4. Pages auth (src/app/(auth)/)
5. Formulaires auth (src/components/forms/)

### Phase 3: Layout et Navigation (Semaine 3-4)
1. Layouts principaux (src/app/layout.tsx, src/app/(dashboard)/layout.tsx)
2. Composants layout (src/components/layout/)
3. Navigation et sidebar
4. Guards et permissions

### Phase 4: Dashboard et Fonctionnalités (Semaine 4-6)
1. Services API métier (src/lib/api/virtualClass.ts, etc.)
2. Pages dashboard (src/app/(dashboard)/)
3. Composants spécialisés (src/components/specialized/)
4. Hooks personnalisés (src/hooks/)

### Phase 5: Fonctionnalités Avancées (Semaine 6-8)
1. Lecteur vidéo (src/components/video/)
2. Graphiques et statistiques (src/components/charts/)
3. Upload et gestion fichiers
4. Paiements Freemopay
5. Tests et optimisations

## 🚀 **COMMANDES UTILES**

```bash
# Développement
npm run dev

# Build
npm run build

# Type checking
npm run type-check

# Linting
npm run lint

# Structure des fichiers
find src -type f -name "*.tsx" -o -name "*.ts" | wc -l
```

## 📈 **MÉTRIQUES DU PROJET**

- **Total fichiers**: ~150 fichiers
- **Pages**: 35+ pages
- **Composants UI**: 25+ composants
- **Formulaires**: 15+ formulaires
- **Hooks**: 20+ hooks personnalisés
- **Services API**: 12+ services
- **Types**: 50+ interfaces TypeScript

---

**⚡ Cette structure garantit:**
- ✅ Séparation claire des responsabilités
- ✅ Réutilisabilité maximale des composants
- ✅ Maintenabilité du code
- ✅ Évolutivité de l'application
- ✅ Performance optimisée
- ✅ Expérience développeur excellente