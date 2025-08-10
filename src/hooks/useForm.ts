import { useState, useCallback } from 'react';
import { FormState, FormConfig, ValidationSchema } from '@/types/forms';

export function useForm<T extends Record<string, any>>(config: FormConfig<T>) {
  const [state, setState] = useState<FormState<T>>({
    values: config.initialValues,
    errors: {},
    touched: {},
    dirty: {},
    isValid: true,
    isSubmitting: false,
    submitCount: 0,
  });

  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setState(prev => ({
      ...prev,
      values: { ...prev.values, [field]: value },
      dirty: { ...prev.dirty, [field]: true },
    }));
  }, []);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, [field]: error },
    }));
  }, []);

  const setFieldTouched = useCallback((field: keyof T, touched: boolean = true) => {
    setState(prev => ({
      ...prev,
      touched: { ...prev.touched, [field]: touched },
    }));
  }, []);

  const validateField = useCallback(async (field: keyof T): Promise<string | undefined> => {
    if (!config.validationSchema || !config.validationSchema[field]) {
      return undefined;
    }

    const value = state.values[field];
    const rules = config.validationSchema[field]!;
    let error: string | undefined;

    if (rules.required && !value) {
      error = typeof rules.required === 'string' ? rules.required : 'Ce champ est requis';
    } else if (value) {
      if (rules.minLength && value.length < rules.minLength) {
        error = typeof rules.minLength === 'string' ? rules.minLength : `Minimum ${rules.minLength} caractères`;
      } else if (rules.maxLength && value.length > rules.maxLength) {
        error = typeof rules.maxLength === 'string' ? rules.maxLength : `Maximum ${rules.maxLength} caractères`;
      } else if (rules.min && value < rules.min) {
        error = typeof rules.min === 'string' ? rules.min : `Valeur minimum: ${rules.min}`;
      } else if (rules.max && value > rules.max) {
        error = typeof rules.max === 'string' ? rules.max : `Valeur maximum: ${rules.max}`;
      } else if (rules.pattern && !rules.pattern.test(value)) {
        error = typeof rules.pattern === 'string' ? rules.pattern : 'Format invalide';
      } else if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = typeof rules.email === 'string' ? rules.email : 'Email invalide';
      } else if (rules.phone && !/^(\+237|237)?\s?[679]\d{8}$/.test(value)) {
        error = typeof rules.phone === 'string' ? rules.phone : 'Numéro de téléphone invalide';
      } else if (rules.custom) {
        error = rules.custom(value);
      }
    }

    if (error) {
      setFieldError(field, error);
    } else {
      setState(prev => ({
        ...prev,
        errors: { ...prev.errors, [field]: undefined },
      }));
    }

    return error;
  }, [state.values, config.validationSchema, setFieldError]);

  const validateForm = useCallback(async (): Promise<Partial<Record<keyof T, string>>> => {
    if (!config.validationSchema) {
      return {};
    }

    const errors: Partial<Record<keyof T, string>> = {};
    const fields = Object.keys(config.validationSchema) as (keyof T)[];

    for (const field of fields) {
      const error = await validateField(field);
      if (error) {
        errors[field] = error;
      }
    }

    const isValid = Object.keys(errors).length === 0;
    setState(prev => ({ ...prev, errors, isValid }));

    return errors;
  }, [config.validationSchema, validateField]);

  const resetForm = useCallback((values?: Partial<T>) => {
    setState({
      values: { ...config.initialValues, ...values },
      errors: {},
      touched: {},
      dirty: {},
      isValid: true,
      isSubmitting: false,
      submitCount: 0,
    });
  }, [config.initialValues]);

  const submitForm = useCallback(async () => {
    const errors = await validateForm();
    
    if (Object.keys(errors).length === 0) {
      setState(prev => ({ ...prev, isSubmitting: true, submitCount: prev.submitCount + 1 }));
      
      try {
        await config.onSubmit(state.values);
      } finally {
        setState(prev => ({ ...prev, isSubmitting: false }));
      }
    }
  }, [state.values, validateForm, config.onSubmit]);

  const handleChange = useCallback((field: keyof T) => (value: any) => {
    setFieldValue(field, value);
    
    if (config.validateOnChange) {
      validateField(field);
    }
  }, [setFieldValue, config.validateOnChange, validateField]);

  const handleBlur = useCallback((field: keyof T) => () => {
    setFieldTouched(field);
    
    if (config.validateOnBlur) {
      validateField(field);
    }
  }, [setFieldTouched, config.validateOnBlur, validateField]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  }, [submitForm]);

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    dirty: state.dirty,
    isValid: state.isValid,
    isSubmitting: state.isSubmitting,
    submitCount: state.submitCount,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    validateField,
    validateForm,
    resetForm,
    submitForm,
    handleChange,
    handleBlur,
    handleSubmit,
  };
}
