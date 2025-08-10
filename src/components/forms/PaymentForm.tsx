"use client"

import React, { useState } from 'react';
import { CreditCard, Smartphone, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { PaymentFormData, PaymentFormErrors } from '@/types/forms';
import { useForm } from '@/hooks/useForm';

interface PaymentFormProps {
  initialAmount?: number;
  onSuccess?: (paymentData: PaymentFormData) => void;
  onError?: (error: string) => void;
  className?: string;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  initialAmount = 0,
  onSuccess,
  onError,
  className = '',
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const initialValues: PaymentFormData = {
    amount: initialAmount,
    phoneNumber: '',
    paymentMethod: 'orange_money',
    acceptTerms: false,
  };

  const validateForm = (values: PaymentFormData): PaymentFormErrors => {
    const errors: PaymentFormErrors = {};

    if (!values.amount || values.amount <= 0) {
      errors.amount = 'Le montant doit être supérieur à 0';
    }

    if (!values.phoneNumber) {
      errors.phoneNumber = 'Le numéro de téléphone est requis';
    } else if (!/^(\+237|237)?\s?[679]\d{8}$/.test(values.phoneNumber)) {
      errors.phoneNumber = 'Format de numéro invalide (ex: 691234567)';
    }

    if (!values.paymentMethod) {
      errors.paymentMethod = 'Veuillez sélectionner une méthode de paiement';
    }

    if (!values.acceptTerms) {
      errors.acceptTerms = 'Vous devez accepter les conditions';
    }

    return errors;
  };

  const handleSubmit = async (values: PaymentFormData) => {
    try {
      setIsProcessing(true);
      
      // Simulation d'un appel API de paiement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowSuccess(true);
      onSuccess?.(values);
      
      // Reset du formulaire après 3 secondes
      setTimeout(() => {
        setShowSuccess(false);
        form.resetForm();
      }, 3000);
      
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Erreur lors du paiement');
    } finally {
      setIsProcessing(false);
    }
  };

  const form = useForm({
    initialValues,
    onValidate: validateForm,
    onSubmit: handleSubmit,
  });

  if (showSuccess) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-6 text-center ${className}`}>
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-green-800 mb-2">
          Paiement effectué avec succès !
        </h3>
        <p className="text-green-600">
          Votre paiement de {form.values.amount} FCFA a été traité.
        </p>
        <p className="text-sm text-green-500 mt-2">
          Vous recevrez un SMS de confirmation.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Paiement sécurisé
        </h2>
        <p className="text-gray-600">
          Complétez vos informations pour finaliser votre paiement
        </p>
      </div>

      <form onSubmit={form.handleSubmit} className="space-y-6">
        {/* Montant */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Montant à payer (FCFA)
          </label>
          <Input
            type="number"
            value={form.values.amount}
            onChange={(value) => form.setFieldValue('amount', parseFloat(value) || 0)}
            onBlur={() => form.setFieldTouched('amount')}
            error={form.touched.amount ? form.errors.amount : undefined}
            placeholder="0"
            min={0}
            step={100}
            leftIcon={CreditCard}
            className="w-full"
          />
        </div>

        {/* Méthode de paiement */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Méthode de paiement
          </label>
          <Select
            value={form.values.paymentMethod}
            onChange={(value) => form.setFieldValue('paymentMethod', value)}
            error={form.touched.paymentMethod ? form.errors.paymentMethod : undefined}
            options={[
              { value: 'orange_money', label: 'Orange Money' },
              { value: 'mtn_mobile_money', label: 'MTN Mobile Money' },
            ]}
            className="w-full"
          />
        </div>

        {/* Numéro de téléphone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Numéro de téléphone
          </label>
          <Input
            type="tel"
            value={form.values.phoneNumber}
            onChange={(value) => form.setFieldValue('phoneNumber', value)}
            onBlur={() => form.setFieldTouched('phoneNumber')}
            error={form.touched.phoneNumber ? form.errors.phoneNumber : undefined}
            placeholder="691234567"
            leftIcon={Smartphone}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Format: 691234567 ou +237691234567
          </p>
        </div>

        {/* Conditions */}
        <div className="flex items-start space-x-3">
        <Checkbox
          id="acceptTerms"
          checked={form.values.acceptTerms}
          onChange={(checked) => form.setFieldValue('acceptTerms', checked)}
          error={form.touched.acceptTerms ? form.errors.acceptTerms : undefined}
        />
          <div className="flex-1">
            <label htmlFor="acceptTerms" className="text-sm text-gray-700">
              J'accepte les{' '}
              <a href="/terms" className="text-primary-navy hover:underline">
                conditions générales
              </a>{' '}
              et la{' '}
              <a href="/privacy" className="text-primary-navy hover:underline">
                politique de confidentialité
              </a>
            </label>
          </div>
        </div>

        {/* Informations de sécurité */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-800 mb-1">
                Paiement sécurisé
              </h4>
              <p className="text-xs text-blue-600">
                Vos informations sont protégées par un cryptage SSL 256-bit. 
                Nous ne stockons jamais vos données de paiement.
              </p>
            </div>
          </div>
        </div>

        {/* Bouton de soumission */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isProcessing}
          disabled={!form.isValid || isProcessing}
          className="mt-6"
        >
          {isProcessing ? 'Traitement en cours...' : `Payer ${form.values.amount} FCFA`}
        </Button>

        {/* Message d'erreur général */}
        {Object.keys(form.errors).length > 0 && (
          <div className="flex items-center space-x-2 text-accent-red text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Veuillez corriger les erreurs ci-dessus</span>
          </div>
        )}
      </form>
    </div>
  );
};


