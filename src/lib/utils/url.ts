// ==============================================
// UTILITAIRES D'URL - TOUS STATISTICIEN ACADEMY
// ==============================================
// Fonctions pour la manipulation et validation des URLs

// ==============================================
// VALIDATION D'URLS
// ==============================================

/**
 * Vérifie si une chaîne est une URL valide
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Vérifie si une URL est externe (différent domaine)
 */
export function isExternalUrl(url: string): boolean {
  try {
    const urlObj = new URL(url, window.location.origin);
    return urlObj.origin !== window.location.origin;
  } catch {
    return false;
  }
}

/**
 * Vérifie si une URL utilise HTTPS
 */
export function isSecureUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

// ==============================================
// CONSTRUCTION D'URLS
// ==============================================

/**
 * Construit une URL avec des paramètres de requête
 */
export function buildUrl(baseUrl: string, params: Record<string, any> = {}): string {
  try {
    const url = new URL(baseUrl);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => url.searchParams.append(key, String(v)));
        } else {
          url.searchParams.set(key, String(value));
        }
      }
    });
    
    return url.toString();
  } catch {
    return baseUrl;
  }
}

/**
 * Ajoute des paramètres à une URL existante
 */
export function addUrlParams(url: string, params: Record<string, any>): string {
  return buildUrl(url, params);
}

/**
 * Supprime des paramètres d'une URL
 */
export function removeUrlParams(url: string, paramsToRemove: string[]): string {
  try {
    const urlObj = new URL(url);
    paramsToRemove.forEach(param => {
      urlObj.searchParams.delete(param);
    });
    return urlObj.toString();
  } catch {
    return url;
  }
}

/**
 * Construit une URL API complète
 */
export function buildApiUrl(endpoint: string, params: Record<string, any> = {}): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const fullEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return buildUrl(`${baseUrl}${fullEndpoint}`, params);
}

// ==============================================
// EXTRACTION DE DONNÉES D'URL
// ==============================================

/**
 * Extrait les paramètres de requête d'une URL
 */
export function getUrlParams(url: string): Record<string, string> {
  try {
    const urlObj = new URL(url);
    const params: Record<string, string> = {};
    
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    
    return params;
  } catch {
    return {};
  }
}

/**
 * Obtient un paramètre spécifique d'une URL
 */
export function getUrlParam(url: string, paramName: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get(paramName);
  } catch {
    return null;
  }
}

/**
 * Extrait le domaine d'une URL
 */
export function getDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return '';
  }
}

/**
 * Extrait le chemin d'une URL
 */
export function getPath(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname;
  } catch {
    return '';
  }
}

/**
 * Extrait le protocole d'une URL
 */
export function getProtocol(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol;
  } catch {
    return '';
  }
}

// ==============================================
// FORMATAGE D'URLS
// ==============================================

/**
 * Normalise une URL (ajoute le protocole si manquant)
 */
export function normalizeUrl(url: string): string {
  if (!url) return '';
  
  // Si l'URL ne commence pas par un protocole, ajouter https://
  if (!url.match(/^https?:\/\//)) {
    return `https://${url}`;
  }
  
  return url;
}

/**
 * Formate une URL pour l'affichage (sans protocole)
 */
export function formatDisplayUrl(url: string): string {
  try {
    const urlObj = new URL(normalizeUrl(url));
    return urlObj.hostname + urlObj.pathname + urlObj.search;
  } catch {
    return url;
  }
}

/**
 * Raccourcit une URL pour l'affichage
 */
export function shortenUrl(url: string, maxLength: number = 50): string {
  const displayUrl = formatDisplayUrl(url);
  
  if (displayUrl.length <= maxLength) {
    return displayUrl;
  }
  
  const domain = getDomain(url);
  const path = getPath(url);
  
  if (domain.length >= maxLength - 3) {
    return `${domain.substring(0, maxLength - 3)}...`;
  }
  
  const availableLength = maxLength - domain.length - 3;
  const truncatedPath = path.length > availableLength 
    ? `...${path.substring(path.length - availableLength)}`
    : path;
    
  return `${domain}${truncatedPath}`;
}

// ==============================================
// NAVIGATION ET ROUTES
// ==============================================

/**
 * Construit une URL de route avec des paramètres
 */
export function buildRoute(route: string, params: Record<string, string | number> = {}): string {
  let finalRoute = route;
  
  // Remplacer les paramètres de route (ex: /user/:id)
  Object.entries(params).forEach(([key, value]) => {
    finalRoute = finalRoute.replace(`:${key}`, String(value));
  });
  
  return finalRoute;
}

/**
 * Extrait les paramètres d'une route
 */
export function extractRouteParams(pattern: string, url: string): Record<string, string> {
  const params: Record<string, string> = {};
  
  // Convertir le pattern en regex
  const regexPattern = pattern.replace(/:([^/]+)/g, '([^/]+)');
  const regex = new RegExp(`^${regexPattern}$`);
  
  // Extraire les noms des paramètres
  const paramNames = [...pattern.matchAll(/:([^/]+)/g)].map(match => match[1]);
  
  // Matcher l'URL
  const match = url.match(regex);
  if (match) {
    paramNames.forEach((name, index) => {
      params[name] = match[index + 1];
    });
  }
  
  return params;
}

/**
 * Construit un breadcrumb à partir d'un chemin
 */
export function buildBreadcrumb(pathname: string): Array<{ label: string; href: string }> {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumb: Array<{ label: string; href: string }> = [];
  
  let currentPath = '';
  segments.forEach(segment => {
    currentPath += `/${segment}`;
    
    // Convertir le segment en label lisible
    const label = segment
      .replace(/-/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    breadcrumb.push({
      label,
      href: currentPath,
    });
  });
  
  return breadcrumb;
}

// ==============================================
// REDIRECTION ET NAVIGATION
// ==============================================

/**
 * Redirige vers une URL externe
 */
export function redirectToExternal(url: string, newTab: boolean = false): void {
  const normalizedUrl = normalizeUrl(url);
  
  if (newTab) {
    window.open(normalizedUrl, '_blank', 'noopener,noreferrer');
  } else {
    window.location.href = normalizedUrl;
  }
}

/**
 * Ouvre une URL dans un nouvel onglet
 */
export function openInNewTab(url: string): void {
  redirectToExternal(url, true);
}

/**
 * Retourne à la page précédente
 */
export function goBack(): void {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = '/';
  }
}

/**
 * Rafraîchit la page actuelle
 */
export function refreshPage(): void {
  window.location.reload();
}

// ==============================================
// UTILITAIRES DE PARTAGE
// ==============================================

/**
 * Construit une URL de partage Facebook
 */
export function buildFacebookShareUrl(url: string, text?: string): string {
  const params: Record<string, string> = { u: url };
  if (text) params.quote = text;
  
  return buildUrl('https://www.facebook.com/sharer/sharer.php', params);
}

/**
 * Construit une URL de partage Twitter
 */
export function buildTwitterShareUrl(url: string, text?: string, hashtags?: string[]): string {
  const params: Record<string, string> = { url };
  if (text) params.text = text;
  if (hashtags && hashtags.length > 0) params.hashtags = hashtags.join(',');
  
  return buildUrl('https://twitter.com/intent/tweet', params);
}

/**
 * Construit une URL de partage LinkedIn
 */
export function buildLinkedInShareUrl(url: string, title?: string, summary?: string): string {
  const params: Record<string, string> = { url };
  if (title) params.title = title;
  if (summary) params.summary = summary;
  
  return buildUrl('https://www.linkedin.com/sharing/share-offsite/', params);
}

/**
 * Construit une URL de partage WhatsApp
 */
export function buildWhatsAppShareUrl(text: string, url?: string): string {
  const message = url ? `${text} ${url}` : text;
  return buildUrl('https://wa.me/', { text: message });
}

/**
 * Construit une URL de partage par email
 */
export function buildEmailShareUrl(
  to?: string,
  subject?: string,
  body?: string,
  cc?: string,
  bcc?: string
): string {
  const params: Record<string, string> = {};
  if (subject) params.subject = subject;
  if (body) params.body = body;
  if (cc) params.cc = cc;
  if (bcc) params.bcc = bcc;
  
  const queryString = new URLSearchParams(params).toString();
  const recipient = to || '';
  
  return `mailto:${recipient}${queryString ? '?' + queryString : ''}`;
}

// ==============================================
// UTILITAIRES POUR L'API
// ==============================================

/**
 * Construit une URL pour l'upload de fichiers
 */
export function buildUploadUrl(endpoint: string): string {
  return buildApiUrl(endpoint);
}

/**
 * Construit une URL pour télécharger un fichier
 */
export function buildDownloadUrl(fileId: string, fileName?: string): string {
  const params: Record<string, string> = {};
  if (fileName) params.filename = fileName;
  
  return buildApiUrl(`/files/${fileId}`, params);
}

/**
 * Construit une URL d'avatar
 */
export function buildAvatarUrl(userId: string, size: number = 100): string {
  return buildApiUrl(`/users/${userId}/avatar`, { size });
}

/**
 * Construit une URL de miniature
 */
export function buildThumbnailUrl(
  fileId: string, 
  width: number = 300, 
  height: number = 200
): string {
  return buildApiUrl(`/files/${fileId}/thumbnail`, { width, height });
}

// ==============================================
// UTILITAIRES DE SLUG
// ==============================================

/**
 * Convertit une chaîne en slug URL-friendly
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9\s-]/g, '') // Supprime les caractères spéciaux
    .trim()
    .replace(/\s+/g, '-') // Remplace les espaces par des tirets
    .replace(/-+/g, '-') // Supprime les tirets multiples
    .replace(/^-+|-+$/g, ''); // Supprime les tirets en début et fin
}

/**
 * Génère un slug unique en ajoutant un numéro si nécessaire
 */
export function generateUniqueSlug(text: string, existingSlugs: string[]): string {
  const baseSlug = createSlug(text);
  
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }
  
  let counter = 1;
  let uniqueSlug = `${baseSlug}-${counter}`;
  
  while (existingSlugs.includes(uniqueSlug)) {
    counter++;
    uniqueSlug = `${baseSlug}-${counter}`;
  }
  
  return uniqueSlug;
}

// ==============================================
// UTILITAIRES DE DEEP LINKING
// ==============================================

/**
 * Construit une URL de deep link pour une ressource spécifique
 */
export function buildDeepLink(
  type: 'class' | 'module' | 'lecture' | 'evaluation',
  id: string,
  additionalParams?: Record<string, string>
): string {
  const baseRoutes = {
    class: '/classes',
    module: '/modules',
    lecture: '/lectures',
    evaluation: '/evaluations',
  };
  
  const route = `${baseRoutes[type]}/${id}`;
  return additionalParams ? buildUrl(route, additionalParams) : route;
}

/**
 * Construit une URL de partage avec token d'accès temporaire
 */
export function buildShareableUrl(
  resourceType: string,
  resourceId: string,
  token: string,
  expiresAt?: string
): string {
  const params: Record<string, string> = {
    type: resourceType,
    id: resourceId,
    token,
  };
  
  if (expiresAt) {
    params.expires = expiresAt;
  }
  
  return buildUrl('/shared', params);
}

// ==============================================
// UTILITAIRES DE CACHE ET OPTIMISATION
// ==============================================

/**
 * Ajoute un paramètre de cache-busting à une URL
 */
export function addCacheBuster(url: string): string {
  const timestamp = Date.now();
  return addUrlParams(url, { _t: timestamp });
}

/**
 * Ajoute une version à une URL pour le cache
 */
export function addVersionToUrl(url: string, version: string): string {
  return addUrlParams(url, { v: version });
}

// ==============================================
// UTILITAIRES DE RECHERCHE
// ==============================================

/**
 * Construit une URL de recherche avec filtres
 */
export function buildSearchUrl(
  query: string,
  filters: Record<string, any> = {},
  page: number = 1,
  limit: number = 10
): string {
  const params = {
    q: query,
    page,
    limit,
    ...filters,
  };
  
  return buildUrl('/search', params);
}

/**
 * Parse une URL de recherche pour extraire les paramètres
 */
export function parseSearchUrl(url: string): {
  query: string;
  filters: Record<string, string>;
  page: number;
  limit: number;
} {
  const params = getUrlParams(url);
  
  const { q = '', page = '1', limit = '10', ...filters } = params;
  
  return {
    query: q,
    filters,
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };
}

// ==============================================
// UTILITAIRES DE VALIDATION AVANCÉE
// ==============================================

/**
 * Vérifie si une URL pointe vers une image
 */
export function isImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.toLowerCase();
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(pathname);
  } catch {
    return false;
  }
}

/**
 * Vérifie si une URL pointe vers une vidéo
 */
export function isVideoUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.toLowerCase();
    return /\.(mp4|avi|mov|wmv|webm|mkv)$/i.test(pathname);
  } catch {
    return false;
  }
}

/**
 * Vérifie si une URL est une URL YouTube
 */
export function isYouTubeUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be');
  } catch {
    return false;
  }
}

/**
 * Extrait l'ID d'une vidéo YouTube
 */
export function extractYouTubeId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    
    if (urlObj.hostname.includes('youtu.be')) {
      return urlObj.pathname.slice(1);
    }
    
    if (urlObj.hostname.includes('youtube.com')) {
      return urlObj.searchParams.get('v');
    }
    
    return null;
  } catch {
    return null;
  }
}

// ==============================================
// UTILITAIRES DE PROXY ET CORS
// ==============================================

/**
 * Construit une URL proxy pour contourner CORS
 */
export function buildProxyUrl(targetUrl: string): string {
  return buildApiUrl('/proxy', { url: encodeURIComponent(targetUrl) });
}

/**
 * Vérifie si une URL nécessite un proxy
 */
export function needsProxy(url: string): boolean {
  return isExternalUrl(url) && !isSecureUrl(url);
}

// ==============================================
// UTILITAIRES D'INTERNATIONALISATION
// ==============================================

/**
 * Ajoute une locale à une URL
 */
export function addLocaleToUrl(url: string, locale: string): string {
  try {
    const urlObj = new URL(url, window.location.origin);
    const pathSegments = urlObj.pathname.split('/').filter(Boolean);
    
    // Supprimer l'ancienne locale si présente
    if (pathSegments[0] && pathSegments[0].match(/^[a-z]{2}$/)) {
      pathSegments.shift();
    }
    
    // Ajouter la nouvelle locale
    pathSegments.unshift(locale);
    urlObj.pathname = '/' + pathSegments.join('/');
    
    return urlObj.toString();
  } catch {
    return url;
  }
}

/**
 * Extrait la locale d'une URL
 */
export function extractLocaleFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url, window.location.origin);
    const pathSegments = urlObj.pathname.split('/').filter(Boolean);
    
    if (pathSegments[0] && pathSegments[0].match(/^[a-z]{2}$/)) {
      return pathSegments[0];
    }
    
    return null;
  } catch {
    return null;
  }
}

// ==============================================
// EXPORT PAR DÉFAUT
// ==============================================

export default {
  isValidUrl,
  isExternalUrl,
  isSecureUrl,
  buildUrl,
  addUrlParams,
  removeUrlParams,
  buildApiUrl,
  getUrlParams,
  getUrlParam,
  getDomain,
  getPath,
  getProtocol,
  normalizeUrl,
  formatDisplayUrl,
  shortenUrl,
  buildRoute,
  extractRouteParams,
  buildBreadcrumb,
  redirectToExternal,
  openInNewTab,
  goBack,
  refreshPage,
  buildFacebookShareUrl,
  buildTwitterShareUrl,
  buildLinkedInShareUrl,
  buildWhatsAppShareUrl,
  buildEmailShareUrl,
  createSlug,
  generateUniqueSlug,
  buildDeepLink,
  buildShareableUrl,
  addCacheBuster,
  addVersionToUrl,
  buildSearchUrl,
  parseSearchUrl,
  isImageUrl,
  isVideoUrl,
  isYouTubeUrl,
  extractYouTubeId,
  buildProxyUrl,
  needsProxy,
  addLocaleToUrl,
  extractLocaleFromUrl,
};