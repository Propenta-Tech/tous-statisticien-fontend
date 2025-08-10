// src/lib/auth/middleware.ts
/**
 * Middleware d'authentification - Tous Statisticien Academy
 * Middleware Next.js pour la protection des routes et la gestion des redirections
 */

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { Role } from '@/types';

// ==============================================
// CONFIGURATION DU MIDDLEWARE
// ==============================================

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-tous-statisticien-academy'
);

// Routes publiques (pas de protection)
const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/pricing',
  '/features',
  '/api/health',
] as const;

// Routes d'authentification (redirection si connecté)
const AUTH_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
] as const;

// Routes protégées avec leurs rôles requis
const PROTECTED_ROUTES: Record<string, Role[]> = {
  '/dashboard/admin': [Role.ADMIN],
  '/dashboard/formateur': [Role.FORMATEUR, Role.ADMIN],
  '/dashboard/student': [Role.STUDENT, Role.FORMATEUR, Role.ADMIN],
  '/api/admin': [Role.ADMIN],
  '/api/formateur': [Role.FORMATEUR, Role.ADMIN],
  '/classes': [Role.STUDENT, Role.FORMATEUR, Role.ADMIN],
  '/modules': [Role.STUDENT, Role.FORMATEUR, Role.ADMIN],
  '/lectures': [Role.STUDENT, Role.FORMATEUR, Role.ADMIN],
  '/evaluations': [Role.STUDENT, Role.FORMATEUR, Role.ADMIN],
};

// Routes nécessitant un paiement
const PREMIUM_ROUTES = [
  '/classes',
  '/modules',
  '/lectures/video',
  '/evaluations/participate',
] as const;

// ==============================================
// INTERFACES
// ==============================================

interface TokenPayload {
  sub: string; // User ID
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  hasPaid: boolean;
  iat: number;
  exp: number;
}

interface MiddlewareOptions {
  enforceHttps?: boolean;
  rateLimiting?: boolean;
  logRequests?: boolean;
  corsHeaders?: boolean;
}

// ==============================================
// FONCTIONS UTILITAIRES
// ==============================================

/**
 * Vérifie si une route est publique
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => {
    if (route === '/') return pathname === '/';
    return pathname.startsWith(route);
  });
}

/**
 * Vérifie si une route est d'authentification
 */
function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Vérifie si une route nécessite un paiement
 */
function isPremiumRoute(pathname: string): boolean {
  return PREMIUM_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Récupère les rôles requis pour une route
 */
function getRequiredRoles(pathname: string): Role[] | null {
  for (const [route, roles] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname.startsWith(route)) {
      return roles as Role[];
    }
  }
  return null;
}

/**
 * Extrait le token d'authentification de la requête
 */
function extractToken(request: NextRequest): string | null {
  // Vérifier le header Authorization
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Vérifier les cookies
  const tokenCookie = request.cookies.get('auth_token');
  if (tokenCookie) {
    return tokenCookie.value;
  }

  return null;
}

/**
 * Vérifie et décode un token JWT
 */
async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as TokenPayload;
  } catch (error) {
    console.error('Erreur de vérification du token:', error);
    return null;
  }
}

/**
 * Génère l'URL de redirection avec le paramètre redirect
 */
function getLoginUrl(request: NextRequest): string {
  const loginUrl = new URL('/auth/login', request.url);
  loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
  return loginUrl.toString();
}

/**
 * Génère l'URL de redirection vers le paiement
 */
function getPaymentUrl(request: NextRequest): string {
  const paymentUrl = new URL('/payment', request.url);
  paymentUrl.searchParams.set('redirect', request.nextUrl.pathname);
  return paymentUrl.toString();
}

/**
 * Détermine la redirection appropriée selon le rôle
 */
function getRoleBasedRedirect(role: Role): string {
  switch (role) {
    case 'ADMIN':
      return '/dashboard/admin';
    case 'FORMATEUR':
      return '/dashboard/formateur';
    case 'STUDENT':
      return '/dashboard/student';
    default:
      return '/dashboard';
  }
}

// ==============================================
// MIDDLEWARE PRINCIPAL
// ==============================================

/**
 * Middleware principal d'authentification
 */
export async function authMiddleware(
  request: NextRequest,
  options: MiddlewareOptions = {}
): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // ==============================================
  // 1. GESTION HTTPS EN PRODUCTION
  // ==============================================
  
  if (options.enforceHttps && process.env.NODE_ENV === 'production') {
    const proto = request.headers.get('x-forwarded-proto');
    if (proto && proto !== 'https') {
      const httpsUrl = new URL(request.url);
      httpsUrl.protocol = 'https:';
      return NextResponse.redirect(httpsUrl);
    }
  }

  // ==============================================
  // 2. HEADERS CORS (SI ACTIVÉ)
  // ==============================================
  
  if (options.corsHeaders) {
    response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  // ==============================================
  // 3. GESTION DES ROUTES PUBLIQUES
  // ==============================================
  
  if (isPublicRoute(pathname)) {
    return response;
  }

  // ==============================================
  // 4. EXTRACTION ET VÉRIFICATION DU TOKEN
  // ==============================================
  
  const token = extractToken(request);
  let user: TokenPayload | null = null;

  if (token) {
    user = await verifyToken(token);
    
    // Token invalide ou expiré
    if (!user) {
      // Nettoyer le cookie invalide
      const response = NextResponse.redirect(getLoginUrl(request));
      response.cookies.delete('auth_token');
      return response;
    }
  }

  // ==============================================
  // 5. GESTION DES ROUTES D'AUTHENTIFICATION
  // ==============================================
  
  if (isAuthRoute(pathname)) {
    // Si l'utilisateur est déjà connecté, rediriger vers son dashboard
    if (user) {
      const redirectUrl = getRoleBasedRedirect(user.role);
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    return response;
  }

  // ==============================================
  // 6. VÉRIFICATION DE L'AUTHENTIFICATION
  // ==============================================
  
  if (!user) {
    // Utilisateur non connecté tentant d'accéder à une route protégée
    return NextResponse.redirect(getLoginUrl(request));
  }

  // ==============================================
  // 7. VÉRIFICATION DES RÔLES
  // ==============================================
  
  const requiredRoles = getRequiredRoles(pathname);
  if (requiredRoles && !requiredRoles.includes(user.role)) {
    // Rôle insuffisant, rediriger vers le dashboard approprié
    const redirectUrl = getRoleBasedRedirect(user.role);
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // ==============================================
  // 8. VÉRIFICATION DU PAIEMENT (CONTENU PREMIUM)
  // ==============================================
  
  if (isPremiumRoute(pathname)) {
    // Les admins et formateurs contournent le paiement
    const canBypassPayment = user.role === 'ADMIN' || user.role === 'FORMATEUR';
    
    if (!canBypassPayment && !user.hasPaid) {
      return NextResponse.redirect(getPaymentUrl(request));
    }
  }

  // ==============================================
  // 9. LOGGING (SI ACTIVÉ)
  // ==============================================
  
  if (options.logRequests) {
    console.log(`[AUTH] ${user.email} (${user.role}) accessing ${pathname}`);
  }

  // ==============================================
  // 10. AJOUT D'HEADERS PERSONNALISÉS
  // ==============================================
  
  // Ajouter des informations utilisateur dans les headers pour l'API
  response.headers.set('X-User-ID', user.sub);
  response.headers.set('X-User-Role', user.role);
  response.headers.set('X-User-Email', user.email);
  response.headers.set('X-User-Has-Paid', user.hasPaid.toString());

  return response;
}

// ==============================================
// MIDDLEWARES SPÉCIALISÉS
// ==============================================

/**
 * Middleware pour les routes API
 */
export async function apiMiddleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Vérifier les méthodes HTTP autorisées
  const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'];
  if (!allowedMethods.includes(request.method)) {
    return new NextResponse('Method Not Allowed', { status: 405 });
  }

  // Gestion des requêtes OPTIONS (CORS preflight)
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': allowedMethods.join(', '),
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // Routes API publiques
  const publicApiRoutes = ['/api/health', '/api/auth/login', '/api/auth/register'];
  if (publicApiRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Vérification de l'authentification pour les autres routes API
  const token = extractToken(request);
  if (!token) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const user = await verifyToken(token);
  if (!user) {
    return new NextResponse('Invalid token', { status: 401 });
  }

  // Vérification des permissions API selon le rôle
  if (pathname.startsWith('/api/admin') && user.role !== 'ADMIN') {
    return new NextResponse('Forbidden', { status: 403 });
  }

  if (pathname.startsWith('/api/formateur') && !['FORMATEUR', 'ADMIN'].includes(user.role)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Ajouter les informations utilisateur dans les headers
  const response = NextResponse.next();
  response.headers.set('X-User-ID', user.sub);
  response.headers.set('X-User-Role', user.role);
  response.headers.set('X-User-Email', user.email);

  return response;
}

/**
 * Middleware de rate limiting
 */
export async function rateLimitMiddleware(request: NextRequest): Promise<NextResponse | null> {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const key = `rate_limit:${ip}`;
  
  // Implémentation simplifiée - en production, utilisez Redis ou une solution de cache
  // Cette implémentation est juste un exemple
  
  const limit = 100; // requêtes par fenêtre
  const window = 15 * 60 * 1000; // 15 minutes
  
  // En production, vous utiliseriez une solution de cache partagée
  // Pour l'exemple, on fait confiance au client
  
  return null; // Continuer le traitement
}

/**
 * Middleware de sécurité générale
 */
export async function securityMiddleware(request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.next();

  // Headers de sécurité
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;"
  );

  // Protection contre les attaques de timing
  const randomDelay = Math.random() * 10;
  await new Promise(resolve => setTimeout(resolve, randomDelay));

  return response;
}

// ==============================================
// CONFIGURATION ET EXPORTS
// ==============================================

/**
 * Configuration du middleware pour Next.js
 */
export const config = {
  matcher: [
    /*
     * Matcher pour toutes les routes sauf :
     * - api (handled by API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

/**
 * Middleware principal exporté pour Next.js
 */
export default async function middleware(request: NextRequest): Promise<NextResponse> {
  // Appliquer le middleware de sécurité
  let response = await securityMiddleware(request);

  // Appliquer le rate limiting
  const rateLimitResponse = await rateLimitMiddleware(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  // Appliquer le middleware d'authentification
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response = await apiMiddleware(request);
  } else {
    response = await authMiddleware(request, {
      enforceHttps: true,
      logRequests: process.env.NODE_ENV === 'development',
      corsHeaders: true,
    });
  }

  return response;
}

// ==============================================
// UTILITAIRES POUR LES API ROUTES
// ==============================================

/**
 * Utilitaire pour valider l'authentification dans les API routes
 */
export async function validateApiAuth(request: Request): Promise<{
  isValid: boolean;
  user?: TokenPayload;
  error?: string;
}> {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { isValid: false, error: 'Token manquant' };
  }

  const token = authHeader.substring(7);
  const user = await verifyToken(token);

  if (!user) {
    return { isValid: false, error: 'Token invalide' };
  }

  return { isValid: true, user };
}

/**
 * Décorateur pour protéger les API routes
 */
export function withAuth(roles?: Role[]) {
  return function(handler: Function) {
    return async function(request: Request, context: any) {
      const authResult = await validateApiAuth(request);
      
      if (!authResult.isValid) {
        return new Response(authResult.error, { status: 401 });
      }

      if (roles && !roles.includes(authResult.user!.role)) {
        return new Response('Accès refusé', { status: 403 });
      }

      // Ajouter l'utilisateur au contexte
      context.user = authResult.user;
      
      return handler(request, context);
    };
  };
}

/**
 * Utilitaire pour récupérer l'utilisateur depuis les headers (côté serveur)
 */
export function getUserFromHeaders(headers: Headers): TokenPayload | null {
  const userId = headers.get('X-User-ID');
  const userRole = headers.get('X-User-Role');
  const userEmail = headers.get('X-User-Email');
  const userHasPaid = headers.get('X-User-Has-Paid');

  if (!userId || !userRole || !userEmail) {
    return null;
  }

  return {
    sub: userId,
    role: userRole as Role,
    email: userEmail,
    hasPaid: userHasPaid === 'true',
    firstName: '', // Ces champs ne sont pas dans les headers par sécurité
    lastName: '',
    iat: 0,
    exp: 0,
  };
}