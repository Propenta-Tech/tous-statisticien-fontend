"use client";

import Link from 'next/link';
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-gray-100 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
        <div>
          <div className="font-semibold text-primary-navy mb-3">Tous Statisticien</div>
          <p className="text-gray-600 leading-relaxed">Plateforme d'apprentissage et d'excellence en statistiques appliquées.</p>
        </div>
        <div>
          <div className="font-semibold text-primary-navy mb-3">Navigation</div>
          <ul className="space-y-2">
            <li><Link href="/features" className="text-gray-600 hover:text-primary-navy">Fonctionnalités</Link></li>
            <li><Link href="/pricing" className="text-gray-600 hover:text-primary-navy">Tarifs</Link></li>
            <li><Link href="/about" className="text-gray-600 hover:text-primary-navy">À propos</Link></li>
            <li><Link href="/contact" className="text-gray-600 hover:text-primary-navy">Contact</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-primary-navy mb-3">Légal</div>
          <ul className="space-y-2">
            <li><a className="text-gray-600 hover:text-primary-navy">Confidentialité</a></li>
            <li><a className="text-gray-600 hover:text-primary-navy">Conditions</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 text-xs text-gray-500">
          © {new Date().getFullYear()} Tous Statisticien. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};
