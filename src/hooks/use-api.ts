"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

interface ApiCallOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

interface ApiState {
  data: any;
  loading: boolean;
  error: Error | null;
}

export function useApi() {
  const [state, setState] = useState<ApiState>({
    data: null,
    loading: false,
    error: null
  });

  const callApi = useCallback(async (
    url: string,
    options: RequestInit = {},
    apiOptions: ApiCallOptions = {}
  ) => {
    const {
      onSuccess,
      onError,
      showSuccessToast = false,
      showErrorToast = true,
      successMessage = "Operation completed successfully",
      errorMessage = "An error occurred"
    } = apiOptions;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || errorMessage);
        throw error;
      }

      const data = await response.json();
      
      setState(prev => ({ ...prev, data, loading: false, error: null }));
      
      if (showSuccessToast) {
        toast.success(successMessage);
      }
      
      if (onSuccess) {
        onSuccess(data);
      }
      
      return data;
    } catch (error) {
      const err = error as Error;
      setState(prev => ({ ...prev, loading: false, error: err }));
      
      if (showErrorToast) {
        toast.error(err.message || errorMessage);
      }
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null
    });
  }, []);

  return {
    ...state,
    callApi,
    reset
  };
}

export function useLazyApi() {
  const [state, setState] = useState<ApiState>({
    data: null,
    loading: false,
    error: null
  });

  const execute = useCallback(async (
    url: string,
    options: RequestInit = {},
    apiOptions: ApiCallOptions = {}
  ) => {
    const {
      onSuccess,
      onError,
      showSuccessToast = false,
      showErrorToast = true,
      successMessage = "Operation completed successfully",
      errorMessage = "An error occurred"
    } = apiOptions;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || errorMessage);
        throw error;
      }

      const data = await response.json();
      
      setState(prev => ({ ...prev, data, loading: false, error: null }));
      
      if (showSuccessToast) {
        toast.success(successMessage);
      }
      
      if (onSuccess) {
        onSuccess(data);
      }
      
      return data;
    } catch (error) {
      const err = error as Error;
      setState(prev => ({ ...prev, loading: false, error: err }));
      
      if (showErrorToast) {
        toast.error(err.message || errorMessage);
      }
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null
    });
  }, []);

  return {
    ...state,
    execute,
    reset
  };
}