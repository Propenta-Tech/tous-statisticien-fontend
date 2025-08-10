"use client"
import React from 'react';
import { cn } from '@/lib/utils';
import { CreditCard, CheckCircle, XCircle, Clock, AlertCircle, DollarSign, Calendar, User } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  method: 'card' | 'bank_transfer' | 'paypal' | 'mobile_money';
  description: string;
  reference: string;
  createdAt: string;
  processedAt?: string;
  dueDate?: string;
  userId: string;
  userName: string;
  userEmail: string;
  items?: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  metadata?: {
    transactionId?: string;
    gateway?: string;
    last4?: string;
    brand?: string;
  };
}

interface PaymentCardProps {
  payment: Payment;
  className?: string;
  showDetails?: boolean;
  showActions?: boolean;
  showMetadata?: boolean;
  onRetry?: (payment: Payment) => void;
  onRefund?: (payment: Payment) => void;
  onClick?: (payment: Payment) => void;
  variant?: 'default' | 'compact' | 'detailed';
  loading?: boolean;
  userRole?: 'student' | 'admin';
}

const statusConfig = {
  pending: {
    label: 'En attente',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    badgeColor: 'bg-amber-500',
    icon: <Clock className="w-4 h-4" />,
  },
  completed: {
    label: 'Complété',
    color: 'bg-green-100 text-green-700 border-green-200',
    badgeColor: 'bg-green-500',
    icon: <CheckCircle className="w-4 h-4" />,
  },
  failed: {
    label: 'Échoué',
    color: 'bg-red-100 text-red-700 border-red-200',
    badgeColor: 'bg-red-500',
    icon: <XCircle className="w-4 h-4" />,
  },
  cancelled: {
    label: 'Annulé',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    badgeColor: 'bg-gray-500',
    icon: <XCircle className="w-4 h-4" />,
  },
  refunded: {
    label: 'Remboursé',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    badgeColor: 'bg-blue-500',
    icon: <CheckCircle className="w-4 h-4" />,
  },
};

const methodConfig = {
  card: {
    label: 'Carte bancaire',
    icon: <CreditCard className="w-4 h-4" />,
    color: 'bg-blue-100 text-blue-700',
  },
  bank_transfer: {
    label: 'Virement bancaire',
    icon: <DollarSign className="w-4 h-4" />,
    color: 'bg-green-100 text-green-700',
  },
  paypal: {
    label: 'PayPal',
    icon: <DollarSign className="w-4 h-4" />,
    color: 'bg-blue-100 text-blue-700',
  },
  mobile_money: {
    label: 'Mobile Money',
    icon: <DollarSign className="w-4 h-4" />,
    color: 'bg-purple-100 text-purple-700',
  },
};

export const PaymentCard: React.FC<PaymentCardProps> = ({
  payment,
  className,
  showDetails = true,
  showActions = true,
  showMetadata = true,
  onRetry,
  onRefund,
  onClick,
  variant = 'default',
  loading = false,
  userRole = 'student',
}) => {
  const status = statusConfig[payment.status];
  const method = methodConfig[payment.method];
  const isOverdue = payment.dueDate && new Date(payment.dueDate) < new Date();
  const canRetry = payment.status === 'failed';
  const canRefund = payment.status === 'completed' && userRole === 'admin';

  if (loading) {
    return (
      <Card className={cn("p-4 animate-pulse", className)}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          <div className="flex items-center space-x-4">
            <div className="h-3 bg-gray-200 rounded w-20"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </Card>
    );
  }

  const CardContent = () => (
    <Card 
      className={cn(
        "p-4 transition-all duration-200",
        onClick && "cursor-pointer hover:shadow-lg hover:scale-105",
        isOverdue && payment.status === 'pending' && "border-red-200 bg-red-50",
        className
      )}
      onClick={() => onClick?.(payment)}
    >
      {/* En-tête avec montant et statut */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <div className={cn("p-2 rounded-lg border", status.color)}>
              {status.icon}
            </div>
            <h3 className={cn(
              "font-semibold text-gray-900 truncate",
              variant === 'compact' ? "text-sm" : "text-base"
            )}>
              {payment.description}
            </h3>
          </div>
          
          <p className="text-xs text-gray-500">
            Réf: {payment.reference}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 ml-2">
          <div className="text-right">
            <p className={cn(
              "font-bold text-gray-900",
              variant === 'compact' ? "text-lg" : "text-xl"
            )}>
              {payment.amount.toLocaleString('fr-FR')} {payment.currency}
            </p>
          </div>
          <Badge variant="solid" className={status.badgeColor}>
            {status.label}
          </Badge>
        </div>
      </div>

      {/* Informations de paiement */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <div className={cn("p-1 rounded", method.color)}>
            {method.icon}
          </div>
          <span>{method.label}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <User className="w-3 h-3" />
          <span>{payment.userName}</span>
        </div>

        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <Calendar className="w-3 h-3" />
          <span>
            {new Date(payment.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>

        {payment.processedAt && (
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <CheckCircle className="w-3 h-3" />
            <span>
              Traité le {new Date(payment.processedAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short'
              })}
            </span>
          </div>
        )}
      </div>

      {/* Détails des articles */}
      {showDetails && payment.items && payment.items.length > 0 && variant !== 'compact' && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Articles</h4>
          <div className="space-y-1">
            {payment.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="text-gray-600">
                  {item.name} {item.quantity > 1 && `(x${item.quantity})`}
                </span>
                <span className="font-medium">
                  {(item.price * item.quantity).toLocaleString('fr-FR')} {payment.currency}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Métadonnées */}
      {showMetadata && payment.metadata && variant !== 'compact' && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Détails techniques</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {payment.metadata.transactionId && (
              <div>
                <span className="text-gray-500">Transaction ID:</span>
                <span className="ml-1 font-mono">{payment.metadata.transactionId}</span>
              </div>
            )}
            {payment.metadata.gateway && (
              <div>
                <span className="text-gray-500">Passerelle:</span>
                <span className="ml-1 font-medium">{payment.metadata.gateway}</span>
              </div>
            )}
            {payment.metadata.last4 && payment.metadata.brand && (
              <div>
                <span className="text-gray-500">Carte:</span>
                <span className="ml-1 font-medium">{payment.metadata.brand} ****{payment.metadata.last4}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Alertes */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {isOverdue && payment.status === 'pending' && (
            <div className="flex items-center space-x-1 text-xs text-red-600">
              <AlertCircle className="w-3 h-3" />
              <span>Paiement en retard</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
                         {canRetry && onRetry && (
               <Button
                 size="sm"
                 variant="outline"
                 onClick={() => onRetry(payment)}
               >
                 Réessayer
               </Button>
             )}
             
             {canRefund && onRefund && (
               <Button
                 size="sm"
                 variant="outline"
                 onClick={() => onRefund(payment)}
               >
                 Rembourser
               </Button>
             )}
           </div>
           
           {onClick && (
             <Button
               size="sm"
               variant="ghost"
               onClick={() => onClick(payment)}
             >
               Voir détails
             </Button>
           )}
        </div>
      )}

      {/* Variant détaillé */}
      {variant === 'detailed' && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-500">Statut:</span>
              <span className="ml-1 font-medium">{status.label}</span>
            </div>
            <div>
              <span className="text-gray-500">Méthode:</span>
              <span className="ml-1 font-medium">{method.label}</span>
            </div>
            <div>
              <span className="text-gray-500">Créé:</span>
              <span className="ml-1 font-medium">
                {new Date(payment.createdAt).toLocaleDateString('fr-FR')}
              </span>
            </div>
            {payment.dueDate && (
              <div>
                <span className="text-gray-500">Échéance:</span>
                <span className="ml-1 font-medium">
                  {new Date(payment.dueDate).toLocaleDateString('fr-FR')}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );

  return <CardContent />;
};
