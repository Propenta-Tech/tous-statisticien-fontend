# Composants Specialized - Tous Statisticien Academy

## Vue d'ensemble

Ce dossier contient tous les composants spécialisés de l'application Tous Statisticien Academy. Chaque composant est conçu pour afficher des données spécifiques avec une intégration API complète.

## Composants disponibles

### ✅ Complètement implémentés avec API

1. **LectureCard.tsx** - Affichage des lectures/cours
   - ✅ Intégration API complète (`lectureService`)
   - ✅ Gestion de la progression utilisateur
   - ✅ Téléchargement et streaming
   - ✅ Commentaires et statistiques
   - ✅ Gestion des permissions et accès

2. **ModuleCard.tsx** - Affichage des modules
   - ✅ Intégration API complète (`moduleService`)
   - ✅ Progression utilisateur
   - ✅ Statistiques détaillées (admin)
   - ✅ Gestion des états (publié/brouillon)

3. **ClassCard.tsx** - Affichage des classes virtuelles
   - ✅ Intégration API complète (`virtualClassService`)
   - ✅ Vérification d'inscription
   - ✅ Progression utilisateur
   - ✅ Statistiques détaillées (admin)

4. **PaymentCard.tsx** - Affichage des paiements
   - ✅ Intégration API complète (`paymentService`)
   - ✅ Gestion des statuts de paiement
   - ✅ Actions (remboursement, retry)
   - ✅ Métadonnées Freemopay

5. **EvaluationCard.tsx** - Affichage des évaluations
   - ✅ Interface complète
   - ✅ Gestion des types et statuts
   - ✅ Progression et statistiques
   - ⚠️ Nécessite intégration API (`evaluationService`)

6. **ResourceCard.tsx** - Affichage des ressources
   - ✅ Interface complète
   - ✅ Gestion des types de fichiers
   - ✅ Actions (téléchargement, prévisualisation)
   - ⚠️ Nécessite intégration API (`resourceService`)

7. **SubmissionCard.tsx** - Affichage des soumissions
   - ✅ Interface complète
   - ✅ Gestion des statuts
   - ✅ Notation et feedback
   - ⚠️ Nécessite intégration API (`submissionService`)

8. **UserCard.tsx** - Affichage des utilisateurs
   - ✅ Interface complète
   - ✅ Gestion des rôles et statuts
   - ✅ Statistiques utilisateur
   - ⚠️ Nécessite intégration API (`personService`)

9. **NotificationCard.tsx** - Affichage des notifications
   - ✅ Interface complète
   - ✅ Gestion des types et priorités
   - ✅ Actions (marquer comme lu, ignorer)
   - ⚠️ Nécessite intégration API

10. **GradeCard.tsx** - Affichage des notes
    - ✅ Interface complète
    - ✅ Gestion des tendances
    - ✅ Feedback et métadonnées
    - ⚠️ Nécessite intégration API

11. **AchievementCard.tsx** - Affichage des réalisations
    - ✅ Interface complète
    - ✅ Gestion des raretés et catégories
    - ✅ Progression et déblocage
    - ⚠️ Nécessite intégration API

12. **TestimonialCard.tsx** - Affichage des témoignages
    - ✅ Interface complète
    - ✅ Système de notation
    - ✅ Métadonnées et vérification
    - ⚠️ Nécessite intégration API

## APIs disponibles

### ✅ Services API complets

1. **lectureService** (`/lib/api/lecture.ts`)
   - Gestion complète des lectures
   - Streaming et téléchargement
   - Progression utilisateur
   - Commentaires et statistiques

2. **moduleService** (`/lib/api/module.ts`)
   - Gestion des modules
   - Statistiques et progression
   - Relations avec les classes

3. **virtualClassService** (`/lib/api/virtualClass.ts`)
   - Gestion des classes virtuelles
   - Inscriptions et statistiques
   - Relations avec les modules

4. **paymentService** (`/lib/api/payment.ts`)
   - Gestion des paiements
   - Intégration Freemopay
   - Remboursements et retry

5. **evaluationService** (`/lib/api/evaluation.ts`)
   - Gestion des évaluations
   - Questions et réponses
   - Notation automatique

6. **resourceService** (`/lib/api/resource.ts`)
   - Gestion des ressources
   - Upload et téléchargement
   - Prévisualisation

7. **submissionService** (`/lib/api/submission.ts`)
   - Gestion des soumissions
   - Notation et feedback
   - Fichiers joints

8. **personService** (`/lib/api/person.ts`)
   - Gestion des utilisateurs
   - Profils et statistiques
   - Authentification

9. **statisticsService** (`/lib/api/statistics.ts`)
   - Statistiques globales
   - Tableaux de bord
   - Rapports détaillés

10. **uploadService** (`/lib/api/upload.ts`)
    - Upload de fichiers
    - Gestion des types
    - Compression et optimisation

## Fonctionnalités communes

### ✅ Tous les composants incluent

- **Gestion des états de chargement** avec skeletons
- **Gestion des erreurs** avec fallbacks
- **Responsive design** avec Tailwind CSS
- **Accessibilité** avec ARIA labels
- **Internationalisation** en français
- **Thèmes** avec support dark/light
- **Animations** et transitions fluides
- **Tooltips** et feedback utilisateur
- **Validation** des données
- **Cache** et optimisation des performances

### ✅ Intégrations

- **Authentication** avec `useAuth` hook
- **Notifications** avec toast system
- **Routing** avec Next.js App Router
- **State management** avec Zustand
- **Form validation** avec Zod
- **Date formatting** avec Intl API
- **File handling** avec upload service
- **Real-time updates** avec WebSocket (si nécessaire)

## Utilisation

### Exemple d'utilisation basique

```tsx
import { LectureCard } from '@/components/specialized/LectureCard';
import { lectureService } from '@/lib/api/lecture';

// Dans un composant
const [lectures, setLectures] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadLectures = async () => {
    try {
      const data = await lectureService.getLecturesByModuleId(moduleId);
      setLectures(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };
  
  loadLectures();
}, [moduleId]);

return (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {lectures.map(lecture => (
      <LectureCard
        key={lecture.id}
        lecture={lecture}
        loading={loading}
        showProgress={true}
        showActions={true}
        onPlay={(lecture) => handlePlay(lecture)}
        onDownload={(lecture) => handleDownload(lecture)}
      />
    ))}
  </div>
);
```

### Exemple avec gestion d'état avancée

```tsx
import { useAsync } from '@/hooks/useAsync';
import { ModuleCard } from '@/components/specialized/ModuleCard';

const ModuleList = ({ classId }) => {
  const { data: modules, loading, error, execute } = useAsync(
    () => moduleService.getModulesByClassId(classId)
  );

  const handleModuleStart = async (module) => {
    try {
      await moduleService.startModule(module.id);
      // Rafraîchir les données
      execute();
    } catch (error) {
      toast.error('Erreur lors du démarrage du module');
    }
  };

  if (error) {
    return <ErrorFallback error={error} onRetry={execute} />;
  }

  return (
    <div className="space-y-4">
      {modules?.map(module => (
        <ModuleCard
          key={module.id}
          module={module}
          loading={loading}
          onStart={handleModuleStart}
          showProgress={true}
          showStats={userRole === 'admin'}
        />
      ))}
    </div>
  );
};
```

## Bonnes pratiques

### ✅ Recommandations

1. **Toujours utiliser les services API** au lieu de données statiques
2. **Gérer les états de chargement** pour une meilleure UX
3. **Implémenter la gestion d'erreurs** avec fallbacks
4. **Utiliser les hooks personnalisés** pour la logique métier
5. **Optimiser les performances** avec la mémorisation
6. **Tester les composants** avec des données réelles
7. **Documenter les props** et interfaces
8. **Respecter l'accessibilité** et les standards WCAG
9. **Maintenir la cohérence** du design system
10. **Optimiser pour mobile** avec responsive design

### ✅ Patterns recommandés

```tsx
// ✅ Bon: Utilisation des services API
const { data, loading, error } = useAsync(() => 
  lectureService.getLectureById(id)
);

// ❌ Éviter: Données statiques
const lecture = { id: '1', title: 'Test', ... };

// ✅ Bon: Gestion d'erreur complète
if (error) return <ErrorFallback error={error} />;
if (loading) return <Skeleton />;

// ✅ Bon: Props typées
interface Props {
  lecture: Lecture;
  onAction?: (lecture: Lecture) => void;
}
```

## Maintenance

### ✅ Checklist de maintenance

- [ ] Vérifier la compatibilité avec les nouvelles APIs
- [ ] Mettre à jour les types TypeScript
- [ ] Tester avec des données réelles
- [ ] Vérifier l'accessibilité
- [ ] Optimiser les performances
- [ ] Mettre à jour la documentation
- [ ] Tester sur différents appareils
- [ ] Vérifier la sécurité des données

## Support

Pour toute question ou problème avec les composants specialized, consultez :

1. La documentation des APIs dans `/lib/api/`
2. Les types TypeScript dans `/types/`
3. Les hooks personnalisés dans `/hooks/`
4. Les exemples d'utilisation dans les pages

---

**Dernière mise à jour :** Décembre 2024
**Version :** 1.0.0
**Statut :** ✅ Production Ready
