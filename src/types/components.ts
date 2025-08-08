// ==============================================
// TYPES COMPOSANTS - TOUS STATISTICIEN ACADEMY
// ==============================================
// Types pour les props des composants réutilisables

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Role, ThemeColor, ComponentSize, ButtonVariant } from './index';

// ==============================================
// TYPES DE BASE POUR LES COMPOSANTS
// ==============================================

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  'data-testid'?: string;
}

export interface InteractiveComponentProps extends BaseComponentProps {
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

// ==============================================
// TYPES POUR LES COMPOSANTS UI
// ==============================================

// Props pour le composant Button
export interface ButtonProps extends InteractiveComponentProps {
  variant?: ButtonVariant;
  size?: ComponentSize;
  fullWidth?: boolean;
  leftIcon?: LucideIcon | React.ReactElement;
  rightIcon?: LucideIcon | React.ReactElement;
  type?: 'button' | 'submit' | 'reset';
  href?: string;
  target?: '_blank' | '_self';
  as?: 'button' | 'a' | 'div';
}

// Props pour le composant Input
export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number' | 'search';
  label?: string;
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  size?: ComponentSize;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  onRightIconClick?: () => void;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  min?: number;
  max?: number;
  step?: number;
  maxLength?: number;
  pattern?: string;
  autoComplete?: string;
  autoFocus?: boolean;
}

// Props pour le composant Textarea
export interface TextareaProps extends Omit<InputProps, 'type' | 'leftIcon' | 'rightIcon'> {
  rows?: number;
  cols?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

// Props pour le composant Select
export interface SelectProps extends BaseComponentProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string | number;
  defaultValue?: string | number;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  size?: ComponentSize;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  loading?: boolean;
  onChange?: (value: string | number | (string | number)[]) => void;
  onSearch?: (query: string) => void;
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  icon?: LucideIcon;
  description?: string;
}

// Props pour le composant Modal
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  centered?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  footer?: React.ReactNode;
  loading?: boolean;
}

// Props pour le composant Card
export interface CardProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated' | 'filled';
  padding?: ComponentSize;
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

// Props pour le composant Badge
export interface BadgeProps extends BaseComponentProps {
  variant?: 'solid' | 'outline' | 'subtle' | 'ghost';
  color?: ThemeColor;
  size?: ComponentSize;
  rounded?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  icon?: LucideIcon;
}

// Props pour le composant Avatar
export interface AvatarProps extends BaseComponentProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: ComponentSize;
  shape?: 'circle' | 'square';
  fallbackBg?: string;
  online?: boolean;
  onClick?: () => void;
}

// Props pour le composant Tooltip
export interface TooltipProps extends BaseComponentProps {
  content: string | React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'focus';
  delay?: number;
  disabled?: boolean;
}

// Props pour le composant Toast/Notification
export interface ToastProps extends BaseComponentProps {
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Props pour le composant ProgressBar
export interface ProgressBarProps extends BaseComponentProps {
  value: number;
  max?: number;
  size?: ComponentSize;
  color?: ThemeColor;
  label?: string;
  showPercentage?: boolean;
  animated?: boolean;
  striped?: boolean;
}

// Props pour le composant Spinner/Loading
export interface SpinnerProps extends BaseComponentProps {
  size?: ComponentSize;
  color?: ThemeColor;
  label?: string;
}

// ==============================================
// TYPES POUR LES COMPOSANTS DE FORMULAIRE
// ==============================================

export interface FormFieldProps extends BaseComponentProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  optional?: boolean;
}

export interface CheckboxProps extends FormFieldProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  size?: ComponentSize;
  onChange?: (checked: boolean) => void;
}

export interface RadioProps extends FormFieldProps {
  name: string;
  value: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  size?: ComponentSize;
  onChange?: (value: string) => void;
}

export interface SwitchProps extends Omit<CheckboxProps, 'indeterminate'> {
  size?: 'sm' | 'md' | 'lg';
}

export interface FileUploadProps extends FormFieldProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // en bytes
  maxFiles?: number;
  disabled?: boolean;
  loading?: boolean;
  preview?: boolean;
  dragAndDrop?: boolean;
  onFilesSelected?: (files: File[]) => void;
  onFileRemoved?: (index: number) => void;
  onUploadProgress?: (progress: number) => void;
  onUploadComplete?: (urls: string[]) => void;
  onUploadError?: (error: string) => void;
}

// ==============================================
// TYPES POUR LES COMPOSANTS DE LAYOUT
// ==============================================

export interface HeaderProps extends BaseComponentProps {
  logo?: string | React.ReactElement;
  title?: string;
  navigation?: NavItem[];
  actions?: React.ReactNode;
  user?: {
    name: string;
    avatar?: string;
    role: Role;
  };
  onMenuToggle?: () => void;
  sticky?: boolean;
}

export interface SidebarProps extends BaseComponentProps {
  navigation: NavItem[];
  isOpen?: boolean;
  onClose?: () => void;
  variant?: 'overlay' | 'persistent' | 'permanent';
  width?: string | number;
  user?: {
    name: string;
    avatar?: string;
    role: Role;
  };
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: LucideIcon;
  badge?: string | number;
  active?: boolean;
  disabled?: boolean;
  children?: NavItem[];
  roles?: Role[];
}

export interface FooterProps extends BaseComponentProps {
  logo?: string | React.ReactElement;
  description?: string;
  links?: Array<{
    title: string;
    items: Array<{
      label: string;
      href: string;
    }>;
  }>;
  socialLinks?: Array<{
    platform: string;
    url: string;
    icon: LucideIcon;
  }>;
  copyright?: string;
}

export interface BreadcrumbProps extends BaseComponentProps {
  items: BreadcrumbItem[];
  separator?: string | React.ReactElement;
  maxItems?: number;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
  icon?: LucideIcon;
}

export interface ContainerProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  centered?: boolean;
  padding?: ComponentSize;
}

// ==============================================
// TYPES POUR LES COMPOSANTS DE DONNÉES
// ==============================================

export interface TableProps<T = any> extends BaseComponentProps {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  empty?: React.ReactNode;
  selectable?: boolean;
  selectedRows?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  sortable?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (column: string, order: 'asc' | 'desc') => void;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
  };
  actions?: TableAction<T>[];
  rowKey?: keyof T | ((row: T) => string);
  striped?: boolean;
  bordered?: boolean;
  size?: ComponentSize;
}

export interface TableColumn<T = any> {
  key: keyof T | string;
  title: string;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T, index: number) => React.ReactNode;
  className?: string;
}

export interface TableAction<T = any> {
  key: string;
  label: string;
  icon?: LucideIcon;
  color?: ThemeColor;
  onClick: (row: T, index: number) => void;
  disabled?: (row: T) => boolean;
  visible?: (row: T) => boolean;
}

export interface PaginationProps extends BaseComponentProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showInfo?: boolean;
  showSizeSelector?: boolean;
  sizeOptions?: number[];
  disabled?: boolean;
}

// ==============================================
// TYPES POUR LES COMPOSANTS DE GRAPHIQUES
// ==============================================

export interface ChartBaseProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  height?: number;
  width?: number;
  loading?: boolean;
  error?: string;
  empty?: React.ReactNode;
}

export interface LineChartProps extends ChartBaseProps {
  data: Array<Record<string, any>>;
  xAxisKey: string;
  lines: Array<{
    key: string;
    name: string;
    color?: string;
    strokeWidth?: number;
  }>;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
}

export interface BarChartProps extends ChartBaseProps {
  data: Array<Record<string, any>>;
  xAxisKey: string;
  bars: Array<{
    key: string;
    name: string;
    color?: string;
  }>;
  orientation?: 'horizontal' | 'vertical';
  stacked?: boolean;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
}

export interface PieChartProps extends ChartBaseProps {
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  showLabels?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  innerRadius?: number;
  outerRadius?: number;
}

export interface StatCardProps extends BaseComponentProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  color?: ThemeColor;
  trend?: {
    value: number;
    label: string;
    direction: 'up' | 'down' | 'neutral';
  };
  loading?: boolean;
  onClick?: () => void;
}

// ==============================================
// TYPES POUR LES COMPOSANTS VIDEO
// ==============================================

export interface VideoPlayerProps extends BaseComponentProps {
  src: string;
  title?: string;
  poster?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  playbackRates?: number[];
  quality?: Array<{
    label: string;
    src: string;
  }>;
  subtitles?: Array<{
    label: string;
    src: string;
    srcLang: string;
  }>;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onProgress?: (percentage: number) => void;
  protected?: boolean;
}

export interface VideoControlsProps extends BaseComponentProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  playbackRate: number;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
  onFullscreenToggle: () => void;
  onPlaybackRateChange: (rate: number) => void;
}

// ==============================================
// TYPES POUR LES COMPOSANTS SPÉCIALISÉS
// ==============================================

export interface ClassCardProps extends BaseComponentProps {
  virtualClass: {
    id: string;
    name: string;
    level: string;
    description: string;
    modulesCount?: number;
    studentsCount?: number;
    thumbnail?: string;
    progress?: number;
  };
  variant?: 'default' | 'compact' | 'detailed';
  showProgress?: boolean;
  showStats?: boolean;
  actions?: Array<{
    label: string;
    icon?: LucideIcon;
    onClick: () => void;
    color?: ThemeColor;
  }>;
  onClick?: () => void;
}

export interface ModuleCardProps extends BaseComponentProps {
  module: {
    id: string;
    title: string;
    order: number;
    lecturesCount?: number;
    evaluationsCount?: number;
    progress?: number;
    completed?: boolean;
  };
  variant?: 'default' | 'compact';
  showProgress?: boolean;
  actions?: Array<{
    label: string;
    icon?: LucideIcon;
    onClick: () => void;
  }>;
  onClick?: () => void;
}

export interface LectureCardProps extends BaseComponentProps {
  lecture: {
    id: string;
    title: string;
    type: 'VIDEO' | 'PDF' | 'AUDIO' | 'DOCUMENT';
    duration?: number;
    size?: number;
    thumbnail?: string;
    completed?: boolean;
  };
  variant?: 'list' | 'grid';
  showMetadata?: boolean;
  actions?: Array<{
    label: string;
    icon?: LucideIcon;
    onClick: () => void;
  }>;
  onClick?: () => void;
}

export interface EvaluationCardProps extends BaseComponentProps {
  evaluation: {
    id: string;
    title: string;
    type: 'QUIZ' | 'EXAM' | 'ASSIGNMENT' | 'PROJECT';
    startDate: string;
    endDate: string;
    duration?: number;
    maxScore?: number;
    submitted?: boolean;
    grade?: number;
    status: 'upcoming' | 'active' | 'ended';
  };
  variant?: 'default' | 'compact';
  showStatus?: boolean;
  actions?: Array<{
    label: string;
    icon?: LucideIcon;
    onClick: () => void;
    disabled?: boolean;
  }>;
  onClick?: () => void;
}

export interface UserCardProps extends BaseComponentProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    avatar?: string;
    lastLogin?: string;
    isOnline?: boolean;
  };
  variant?: 'default' | 'compact' | 'detailed';
  showRole?: boolean;
  showStatus?: boolean;
  actions?: Array<{
    label: string;
    icon?: LucideIcon;
    onClick: () => void;
    color?: ThemeColor;
  }>;
  onClick?: () => void;
}

// ==============================================
// TYPES POUR LES COMPOSANTS DE NOTIFICATION
// ==============================================

export interface NotificationPanelProps extends BaseComponentProps {
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: string;
    read: boolean;
    actionUrl?: string;
  }>;
  loading?: boolean;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onNotificationClick?: (notification: any) => void;
  maxHeight?: number;
}

export interface AlertProps extends BaseComponentProps {
  type: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: ButtonVariant;
  }>;
}

// ==============================================
// TYPES POUR L'ACCESSIBILITÉ
// ==============================================

export interface A11yProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-hidden'?: boolean;
  'aria-live'?: 'off' | 'polite' | 'assertive';
  'aria-pressed'?: boolean;
  'aria-selected'?: boolean;
  'aria-checked'?: boolean;
  'aria-disabled'?: boolean;
  role?: string;
  tabIndex?: number;
}

// ==============================================
// TYPES POUR LES ANIMATIONS
// ==============================================

export interface AnimationProps {
  animate?: boolean;
  duration?: number;
  delay?: number;
  easing?: string;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
}

export interface TransitionProps extends AnimationProps {
  show: boolean;
  appear?: boolean;
  enter?: string;
  enterFrom?: string;
  enterTo?: string;
  leave?: string;
  leaveFrom?: string;
  leaveTo?: string;
}

// ==============================================
// TYPES GÉNÉRIQUES POUR LES COMPOSANTS
// ==============================================

// Type générique pour les composants avec des variants
export interface VariantComponentProps<T extends string> extends BaseComponentProps {
  variant?: T;
}

// Type générique pour les composants avec taille
export interface SizedComponentProps extends BaseComponentProps {
  size?: ComponentSize;
}

// Type générique pour les composants avec couleur
export interface ColoredComponentProps extends BaseComponentProps {
  color?: ThemeColor;
}

// Type pour les composants contrôlés
export interface ControlledComponentProps<T> {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
}

// Type pour les composants avec état de chargement
export interface LoadingComponentProps extends BaseComponentProps {
  loading?: boolean;
  loadingText?: string;
}

// ==============================================
// TYPES POUR LES RENDER PROPS
// ==============================================

export interface RenderPropComponent<T> {
  children: (props: T) => React.ReactNode;
}

export interface SlotProps {
  [key: string]: React.ReactNode;
}

// ==============================================
// EXPORTS DE COMMODITÉ
// ==============================================

// Union types pour faciliter l'usage
export type InputComponent = InputProps | TextareaProps | SelectProps;
export type FormComponent = InputComponent | CheckboxProps | RadioProps | SwitchProps;
export type InteractiveComponent = ButtonProps | InteractiveComponentProps;
export type LayoutComponent = HeaderProps | SidebarProps | FooterProps | ContainerProps;
export type DataComponent = TableProps | PaginationProps;
export type ChartComponent = LineChartProps | BarChartProps | PieChartProps;
export type CardComponent = ClassCardProps | ModuleCardProps | LectureCardProps | EvaluationCardProps | UserCardProps;