/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        // Palette de couleurs selon la charte graphique
        colors: {
          // Couleurs principales
          primary: {
            navy: '#1e293b',     // Bleu nuit principal
            gold: '#fbbf24',     // Jaune/or
            white: '#ffffff',    // Blanc
          },
          accent: {
            red: '#ef4444',      // Rouge d'accentuation
          },
          // Échelle de gris personnalisée
          gray: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
          },
          // Couleurs sémantiques
          success: {
            50: '#f0fdf4',
            100: '#dcfce7',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
          },
          warning: {
            50: '#fffbeb',
            100: '#fef3c7',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
          },
          danger: {
            50: '#fef2f2',
            100: '#fee2e2',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
          },
          info: {
            50: '#eff6ff',
            100: '#dbeafe',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
          },
        },
        
        // Typographie
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
          heading: ['Inter', 'system-ui', 'sans-serif'],
          mono: ['Fira Code', 'ui-monospace', 'monospace'],
        },
        
        // Tailles de police personnalisées
        fontSize: {
          'xs': ['0.75rem', { lineHeight: '1rem' }],
          'sm': ['0.875rem', { lineHeight: '1.25rem' }],
          'base': ['1rem', { lineHeight: '1.5rem' }],
          'lg': ['1.125rem', { lineHeight: '1.75rem' }],
          'xl': ['1.25rem', { lineHeight: '1.75rem' }],
          '2xl': ['1.5rem', { lineHeight: '2rem' }],
          '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
          '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
          '5xl': ['3rem', { lineHeight: '1' }],
          '6xl': ['3.75rem', { lineHeight: '1' }],
        },
        
        // Espacement personnalisé
        spacing: {
          '18': '4.5rem',
          '88': '22rem',
          '100': '25rem',
          '128': '32rem',
        },
        
        // Breakpoints responsive
        screens: {
          'xs': '475px',
          'sm': '640px',
          'md': '768px',
          'lg': '1024px',
          'xl': '1280px',
          '2xl': '1536px',
        },
        
        // Ombres personnalisées
        boxShadow: {
          'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
          'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          'hard': '0 10px 40px -10px rgba(0, 0, 0, 0.15)',
          'glow': '0 0 20px rgba(251, 191, 36, 0.3)', // Effet glow avec primary gold
          'glow-blue': '0 0 20px rgba(30, 41, 59, 0.3)', // Effet glow avec primary navy
        },
        
        // Bordures arrondies
        borderRadius: {
          'none': '0',
          'sm': '0.125rem',
          'base': '0.25rem',
          'md': '0.375rem',
          'lg': '0.5rem',
          'xl': '0.75rem',
          '2xl': '1rem',
          '3xl': '1.5rem',
          'full': '9999px',
        },
        
        // Animations personnalisées
        animation: {
          'fade-in': 'fadeIn 0.5s ease-in-out',
          'slide-in': 'slideIn 0.3s ease-out',
          'slide-up': 'slideUp 0.3s ease-out',
          'bounce-gentle': 'bounceGentle 2s infinite',
          'pulse-slow': 'pulse 3s infinite',
          'spin-slow': 'spin 3s linear infinite',
          'float': 'float 3s ease-in-out infinite',
        },
        
        // Keyframes pour les animations
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          slideIn: {
            '0%': { transform: 'translateX(-100%)' },
            '100%': { transform: 'translateX(0)' },
          },
          slideUp: {
            '0%': { transform: 'translateY(100%)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
          bounceGentle: {
            '0%, 100%': { transform: 'translateY(-5%)' },
            '50%': { transform: 'translateY(0)' },
          },
          float: {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-10px)' },
          },
        },
        
        // Backdrop blur
        backdropBlur: {
          'xs': '2px',
          'sm': '4px',
          'base': '8px',
          'md': '12px',
          'lg': '16px',
          'xl': '24px',
          '2xl': '40px',
          '3xl': '64px',
        },
        
        // Z-index personnalisé
        zIndex: {
          '60': '60',
          '70': '70',
          '80': '80',
          '90': '90',
          '100': '100',
        },
        
        // Gradients personnalisés
        backgroundImage: {
          'gradient-navy-gold': 'linear-gradient(135deg, #1e293b 0%, #fbbf24 100%)',
          'gradient-gold-navy': 'linear-gradient(135deg, #fbbf24 0%, #1e293b 100%)',
          'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
          'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        },
        
        // Largeurs et hauteurs personnalisées
        minHeight: {
          'screen-75': '75vh',
          'screen-80': '80vh',
          'screen-90': '90vh',
        },
        
        maxWidth: {
          '8xl': '90rem',
          '9xl': '100rem',
        },
        
        // Transitions personnalisées
        transitionDuration: {
          '400': '400ms',
          '600': '600ms',
          '800': '800ms',
          '900': '900ms',
        },
      },
    },
    
    // Plugins Tailwind
    plugins: [
      // Plugin personnalisé pour les utilitaires spécifiques
      function({ addUtilities, addComponents }) {
        // Utilitaires pour le glassmorphism
        addUtilities({
          '.glass': {
            'background': 'rgba(255, 255, 255, 0.1)',
            'backdrop-filter': 'blur(10px)',
            'border': '1px solid rgba(255, 255, 255, 0.2)',
          },
          '.glass-dark': {
            'background': 'rgba(30, 41, 59, 0.1)',
            'backdrop-filter': 'blur(10px)',
            'border': '1px solid rgba(30, 41, 59, 0.2)',
          },
          // Utilitaires pour masquer le scrollbar
          '.scrollbar-hide': {
            '-ms-overflow-style': 'none',
            'scrollbar-width': 'none',
            '&::-webkit-scrollbar': {
              'display': 'none',
            },
          },
          // Utilitaires pour les textes
          '.text-balance': {
            'text-wrap': 'balance',
          },
        });
        
        // Composants réutilisables
        addComponents({
          '.btn-primary': {
            '@apply bg-primary-gold text-primary-navy font-medium px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors duration-200': {},
          },
          '.btn-secondary': {
            '@apply bg-primary-navy text-primary-white font-medium px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors duration-200': {},
          },
          '.card': {
            '@apply bg-white rounded-xl shadow-soft border border-gray-200': {},
          },
          '.card-dark': {
            '@apply bg-gray-800 rounded-xl shadow-soft border border-gray-700': {},
          },
        });
      },
    ],
    
    // Mode sombre (optionnel pour plus tard)
    darkMode: 'class',
  };