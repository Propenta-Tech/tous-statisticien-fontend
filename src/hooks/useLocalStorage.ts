// src/hooks/useLocalStorage.ts
/**
 * Hook personnalisé pour la gestion du localStorage avec TypeScript
 * Gestion automatique de la sérialisation/désérialisation JSON
 */

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // État local
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Erreur lors de la lecture de la clé "${key}" du localStorage:`, error);
      return initialValue;
    }
  });

  // Fonction pour mettre à jour le localStorage et l'état local
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Permettre à value d'être une fonction pour avoir la même API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Sauvegarder dans l'état local
      setStoredValue(valueToStore);
      
      // Sauvegarder dans le localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Erreur lors de la sauvegarde de la clé "${key}" dans le localStorage:`, error);
    }
  }, [key, storedValue]);

  // Fonction pour supprimer la clé du localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Erreur lors de la suppression de la clé "${key}" du localStorage:`, error);
    }
  }, [key, initialValue]);

  // Écouter les changements du localStorage dans d'autres onglets
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`Erreur lors de la synchronisation de la clé "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
}
