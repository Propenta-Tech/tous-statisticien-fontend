/**
 * Utilitaires mathématiques pour Tous Statisticien Academy
 * Calculs statistiques, pourcentages, et fonctions mathématiques
 */

/**
 * Interface pour les statistiques descriptives
 */
interface DescriptiveStats {
  mean: number;
  median: number;
  mode: number[];
  min: number;
  max: number;
  range: number;
  variance: number;
  standardDeviation: number;
  count: number;
  sum: number;
}

/**
 * Interface pour un point de données avec coordonnées
 */
interface DataPoint {
  x: number;
  y: number;
}

/**
 * Interface pour les résultats de régression linéaire
 */
interface LinearRegressionResult {
  slope: number;
  intercept: number;
  rSquared: number;
  equation: string;
}

/**
 * Interface pour les statistiques de notes
 */
interface GradeStats {
  average: number;
  median: number;
  highest: number;
  lowest: number;
  passRate: number;
  distribution: Record<string, number>;
  letterGrades: Record<string, number>;
}

/**
 * Calcule la moyenne d'un tableau de nombres
 */
export function calculateMean(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}

/**
 * Calcule la médiane d'un tableau de nombres
 */
export function calculateMedian(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  
  const sorted = [...numbers].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  
  return sorted[middle];
}

/**
 * Calcule le mode (valeur(s) la/les plus fréquente(s))
 */
export function calculateMode(numbers: number[]): number[] {
  if (numbers.length === 0) return [];
  
  const frequency = new Map<number, number>();
  
  numbers.forEach(num => {
    frequency.set(num, (frequency.get(num) || 0) + 1);
  });
  
  const maxFrequency = Math.max(...frequency.values());
  
  return Array.from(frequency.entries())
    .filter(([, freq]) => freq === maxFrequency)
    .map(([num]) => num);
}

/**
 * Calcule la variance d'un tableau de nombres
 */
export function calculateVariance(numbers: number[], isPopulation: boolean = false): number {
  if (numbers.length === 0) return 0;
  
  const mean = calculateMean(numbers);
  const squaredDifferences = numbers.map(num => Math.pow(num - mean, 2));
  const divisor = isPopulation ? numbers.length : numbers.length - 1;
  
  return squaredDifferences.reduce((sum, diff) => sum + diff, 0) / divisor;
}

/**
 * Calcule l'écart-type d'un tableau de nombres
 */
export function calculateStandardDeviation(numbers: number[], isPopulation: boolean = false): number {
  return Math.sqrt(calculateVariance(numbers, isPopulation));
}

/**
 * Calcule toutes les statistiques descriptives
 */
export function calculateDescriptiveStats(numbers: number[]): DescriptiveStats {
  if (numbers.length === 0) {
    return {
      mean: 0, median: 0, mode: [], min: 0, max: 0,
      range: 0, variance: 0, standardDeviation: 0,
      count: 0, sum: 0
    };
  }
  
  const mean = calculateMean(numbers);
  const median = calculateMedian(numbers);
  const mode = calculateMode(numbers);
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  const range = max - min;
  const variance = calculateVariance(numbers);
  const standardDeviation = Math.sqrt(variance);
  const count = numbers.length;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  
  return {
    mean, median, mode, min, max, range,
    variance, standardDeviation, count, sum
  };
}

/**
 * Calcule le pourcentage avec précision
 */
export function calculatePercentage(
  value: number, 
  total: number, 
  precision: number = 2
): number {
  if (total === 0) return 0;
  return Number(((value / total) * 100).toFixed(precision));
}

/**
 * Calcule le pourcentage de changement
 */
export function calculatePercentageChange(
  oldValue: number, 
  newValue: number, 
  precision: number = 2
): number {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return Number((((newValue - oldValue) / oldValue) * 100).toFixed(precision));
}

/**
 * Arrondit un nombre à la précision spécifiée
 */
export function roundToPrecision(number: number, precision: number = 2): number {
  const factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

/**
 * Clamp une valeur entre min et max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Convertit une note en pourcentage
 */
export function scoreToPercentage(score: number, maxScore: number): number {
  return calculatePercentage(score, maxScore);
}

/**
 * Convertit un pourcentage en note littérale
 */
export function percentageToLetterGrade(percentage: number): string {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
}

/**
 * Calcule les statistiques de notes d'une classe
 */
export function calculateGradeStats(
  grades: number[], 
  maxScore: number = 100,
  passingScore: number = 60
): GradeStats {
  if (grades.length === 0) {
    return {
      average: 0, median: 0, highest: 0, lowest: 0,
      passRate: 0, distribution: {}, letterGrades: {}
    };
  }
  
  const percentages = grades.map(grade => scoreToPercentage(grade, maxScore));
  const stats = calculateDescriptiveStats(percentages);
  
  // Taux de réussite
  const passCount = percentages.filter(p => p >= passingScore).length;
  const passRate = calculatePercentage(passCount, percentages.length);
  
  // Distribution par tranches
  const distribution = {
    '90-100': percentages.filter(p => p >= 90).length,
    '80-89': percentages.filter(p => p >= 80 && p < 90).length,
    '70-79': percentages.filter(p => p >= 70 && p < 80).length,
    '60-69': percentages.filter(p => p >= 60 && p < 70).length,
    '0-59': percentages.filter(p => p < 60).length
  };
  
  // Notes littérales
  const letterGrades = {
    'A': percentages.filter(p => p >= 90).length,
    'B': percentages.filter(p => p >= 80 && p < 90).length,
    'C': percentages.filter(p => p >= 70 && p < 80).length,
    'D': percentages.filter(p => p >= 60 && p < 70).length,
    'F': percentages.filter(p => p < 60).length
  };
  
  return {
    average: stats.mean,
    median: stats.median,
    highest: stats.max,
    lowest: stats.min,
    passRate,
    distribution,
    letterGrades
  };
}

/**
 * Calcule la progression en pourcentage
 */
export function calculateProgress(completed: number, total: number): number {
  return calculatePercentage(completed, total);
}

/**
 * Génère une série de nombres aléatoires
 */
export function generateRandomNumbers(count: number, min: number = 0, max: number = 100): number[] {
  return Array.from({ length: count }, () => 
    Math.floor(Math.random() * (max - min + 1)) + min
  );
}

/**
 * Calcule la corrélation de Pearson entre deux séries
 */
export function calculateCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length === 0) return 0;
  
  const n = x.length;
  const sumX = x.reduce((sum, val) => sum + val, 0);
  const sumY = y.reduce((sum, val) => sum + val, 0);
  const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
  const sumXX = x.reduce((sum, val) => sum + val * val, 0);
  const sumYY = y.reduce((sum, val) => sum + val * val, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
  
  return denominator === 0 ? 0 : numerator / denominator;
}

/**
 * Calcule une régression linéaire simple
 */
export function calculateLinearRegression(points: DataPoint[]): LinearRegressionResult {
  if (points.length < 2) {
    return { slope: 0, intercept: 0, rSquared: 0, equation: 'y = 0' };
  }
  
  const x = points.map(p => p.x);
  const y = points.map(p => p.y);
  
  const n = points.length;
  const sumX = x.reduce((sum, val) => sum + val, 0);
  const sumY = y.reduce((sum, val) => sum + val, 0);
  const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
  const sumXX = x.reduce((sum, val) => sum + val * val, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Coefficient de détermination R²
  const meanY = sumY / n;
  const totalSumSquares = y.reduce((sum, val) => sum + Math.pow(val - meanY, 2), 0);
  const residualSumSquares = y.reduce((sum, val, i) => {
    const predicted = slope * x[i] + intercept;
    return sum + Math.pow(val - predicted, 2);
  }, 0);
  
  const rSquared = 1 - (residualSumSquares / totalSumSquares);
  
  const equation = `y = ${roundToPrecision(slope, 4)}x + ${roundToPrecision(intercept, 4)}`;
  
  return { slope, intercept, rSquared, equation };
}

/**
 * Normalise un tableau de nombres entre 0 et 1
 */
export function normalizeArray(numbers: number[]): number[] {
  if (numbers.length === 0) return [];
  
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  const range = max - min;
  
  if (range === 0) return numbers.map(() => 0);
  
  return numbers.map(num => (num - min) / range);
}

/**
 * Calcule le Z-score d'une valeur
 */
export function calculateZScore(value: number, mean: number, standardDeviation: number): number {
  if (standardDeviation === 0) return 0;
  return (value - mean) / standardDeviation;
}

/**
 * Calcule les percentiles d'un tableau
 */
export function calculatePercentile(numbers: number[], percentile: number): number {
  if (numbers.length === 0) return 0;
  
  const sorted = [...numbers].sort((a, b) => a - b);
  const index = (percentile / 100) * (sorted.length - 1);
  
  if (Number.isInteger(index)) {
    return sorted[index];
  }
  
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

/**
 * Interpole entre deux valeurs
 */
export function interpolate(start: number, end: number, factor: number): number {
  return start + (end - start) * clamp(factor, 0, 1);
}

/**
 * Calcule la distance euclidienne entre deux points
 */
export function calculateEuclideanDistance(point1: DataPoint, point2: DataPoint): number {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}