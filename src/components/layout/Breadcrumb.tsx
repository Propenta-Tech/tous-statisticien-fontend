"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export const Breadcrumb: React.FC = () => {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const crumbs = segments.map((seg, idx) => {
    const href = '/' + segments.slice(0, idx + 1).join('/');
    const label = seg.replace(/\[|\]/g, '').replace(/-/g, ' ');
    return { href, label };
  });

  return (
    <nav className="text-sm text-white/70" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 flex-wrap">
        <li>
          <Link href="/" className="hover:text-white">Accueil</Link>
        </li>
        {crumbs.map((c, i) => (
          <li key={c.href} className="flex items-center gap-2">
            <span className="text-white/40">/</span>
            {i === crumbs.length - 1 ? (
              <span className="text-white">{c.label}</span>
            ) : (
              <Link href={c.href} className="hover:text-white">{c.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export {};
