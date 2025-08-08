import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ==============================================
// MIDDLEWARE TOUS STATISTICIEN ACADEMY
// ==============================================
// Gère l'authentification, les redirections et la sécurité

// Routes protégées nécessitant une authentification
const protectedRoutes = [
  '/dashboard',
  '/student',
  '/admin',
  '/profile',
  '/settings',
  '/classes',
  '/evaluations',
  '/results',
];

// Routes d'authentification (redirige si déjà connecté)
const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
];

// Routes admin uniquement
const adminRoutes = [
  '/admin',
  '/dashboard/admin',
];

// Routes étudiant uniquement
const studentRoutes = [
  '/student',
  '/dashboard/student',
];

// Fonction pour vérifier si une route est protégée
function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => pathname.startsWith(route));
}

// Fonction pour vérifier si c'est une route d'authentification
function isAuthRoute(pathname: string): boolean {
  return authRoutes.some(route => pathname.startsWith(route));
}

// Fonction pour vérifier si c'est une route admin
function isAdminRoute(pathname: string): boolean {
  return adminRoutes.some(route => pathname.startsWith(route));
}

// Fonction pour vérifier si c'est une route étudiant
function isStudentRoute(pathname: string): boolean {
  return studentRoutes.some(route => pathname.startsWith(route));
}

// Fonction pour extraire et valider le token JWT
function validateToken(token: string): { isValid: boolean; role?: string; userId?: string } {
  try {
    if (!token) return { isValid: false };

    // Décoder le token JWT (simulation basique)
    // En production, utiliser une vraie validation JWT
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);

    // Vérifier l'expiration
    if (payload.exp && payload.exp < now) {
      return { isValid: false };
    }

    return {
      isValid: true,
      role: payload.role,
      userId: payload.sub,
    };
  } catch (error) {
    return { isValid: false };
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorer les fichiers statiques et les routes API
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Récupérer le token depuis les cookies ou headers
  const token = 
    request.cookies.get('auth-token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');

  // Valider le token
  const { isValid, role } = validateToken(token || '');

  // ==============================================
  // GESTION DES ROUTES D'AUTHENTIFICATION
  // ==============================================
  if (isAuthRoute(pathname)) {
    // Si l'utilisateur est déjà connecté, rediriger vers le dashboard
    if (isValid) {
      const redirectUrl = role === 'ADMIN' 
        ? new URL('/dashboard/admin', request.url)
        : new URL('/dashboard/student', request.url);
      
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  // ==============================================
  // GESTION DES ROUTES PROTÉGÉES
  // ==============================================
  if (isProtectedRoute(pathname)) {
    // Rediriger vers login si non authentifié
    if (!isValid) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Vérifier les permissions par rôle
    if (isAdminRoute(pathname) && role !== 'ADMIN' && role !== 'FORMATEUR') {
      return NextResponse.redirect(new URL('/dashboard/student', request.url));
    }

    if (isStudentRoute(pathname) && role === 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard/admin', request.url));
    }
  }

  // ==============================================
  // REDIRECTIONS DE ROUTES RACINES
  // ==============================================
  
  // Rediriger /dashboard vers le bon dashboard selon le rôle
  if (pathname === '/dashboard') {
    if (!isValid) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    
    const dashboardUrl = role === 'ADMIN' || role === 'FORMATEUR'
      ? new URL('/dashboard/admin', request.url)
      : new URL('/dashboard/student', request.url);
    
    return NextResponse.redirect(dashboardUrl);
  }

  // Rediriger /auth vers /auth/login
  if (pathname === '/auth') {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // ==============================================
  // HEADERS DE SÉCURITÉ
  // ==============================================
  const response = NextResponse.next();

  // Headers de sécurité
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // CSP (Content Security Policy) - Ajuster selon les besoins
  const csp = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: blob: https://api.tous-statisticien.net https://images.unsplash.com;
    media-src 'self' https://api.tous-statisticien.net;
    connect-src 'self' https://api.tous-statisticien.net https://api-v2.freemopay.com;
    frame-src 'none';
    object-src 'none';
  `.replace(/\s+/g, ' ').trim();

  response.headers.set('Content-Security-Policy', csp);

  // ==============================================
  // LOGGING ET MONITORING
  // ==============================================
  if (process.env.NEXT_PUBLIC_DEBUG_MODE === 'true') {
    console.log(`[MIDDLEWARE] ${request.method} ${pathname} - Auth: ${isValid ? 'Valid' : 'Invalid'} - Role: ${role || 'None'}`);
  }

  return response;
}

// Configuration du matcher - définit sur quelles routes le middleware s'exécute
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|static).*)',
  ],
};