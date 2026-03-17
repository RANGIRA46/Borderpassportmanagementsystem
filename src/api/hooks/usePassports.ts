import { useState, useEffect, useCallback } from 'react';
import passportApi from '../endpoints/passportApi';
import {
  PassportResponse,
  PassportRequest,
  PassportStatusHistory,
  PaginationParams,
  PaginatedResponse,
  ApiException,
} from '../client/types';

interface PassportState {
  passports: PaginatedResponse<PassportResponse> | null;
  selectedPassport: PassportResponse | null;
  history: PassportStatusHistory[];
  loading: boolean;
  error: string | null;
}

interface UsePassportsReturn extends PassportState {
  fetchPassports: (params?: PaginationParams) => Promise<void>;
  fetchPassport: (id: string) => Promise<void>;
  createPassport: (data: PassportRequest) => Promise<PassportResponse | null>;
  updatePassport: (id: string, data: Partial<PassportRequest>) => Promise<PassportResponse | null>;
  deletePassport: (id: string) => Promise<boolean>;
  fetchHistory: (id: string) => Promise<void>;
  uploadDocument: (id: string, file: File, documentType: string) => Promise<boolean>;
  clearError: () => void;
  clearSelected: () => void;
}

export function usePassports(): UsePassportsReturn {
  const [state, setState] = useState<PassportState>({
    passports: null,
    selectedPassport: null,
    history: [],
    loading: false,
    error: null,
  });

  const setLoading = (loading: boolean) =>
    setState((prev) => ({ ...prev, loading }));

  const setError = (error: string | null) =>
    setState((prev) => ({ ...prev, error, loading: false }));

  const fetchPassports = useCallback(async (params?: PaginationParams): Promise<void> => {
    try {
      setLoading(true);
      setState((prev) => ({ ...prev, error: null }));
      const passports = await passportApi.list(params);
      setState((prev) => ({ ...prev, passports, loading: false }));
    } catch (err) {
      const message = err instanceof ApiException ? err.message : 'Failed to load passports.';
      setError(message);
    }
  }, []);

  const fetchPassport = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setState((prev) => ({ ...prev, error: null }));
      const selectedPassport = await passportApi.getById(id);
      setState((prev) => ({ ...prev, selectedPassport, loading: false }));
    } catch (err) {
      const message = err instanceof ApiException ? err.message : 'Failed to load passport details.';
      setError(message);
    }
  }, []);

  const createPassport = useCallback(async (data: PassportRequest): Promise<PassportResponse | null> => {
    try {
      setLoading(true);
      setState((prev) => ({ ...prev, error: null }));
      const passport = await passportApi.create(data);
      setState((prev) => ({
        ...prev,
        loading: false,
        passports: prev.passports
          ? { ...prev.passports, data: [passport, ...prev.passports.data], total: prev.passports.total + 1 }
          : null,
      }));
      return passport;
    } catch (err) {
      const message = err instanceof ApiException ? err.message : 'Failed to submit passport application.';
      setError(message);
      return null;
    }
  }, []);

  const updatePassport = useCallback(
    async (id: string, data: Partial<PassportRequest>): Promise<PassportResponse | null> => {
      try {
        setLoading(true);
        setState((prev) => ({ ...prev, error: null }));
        const updated = await passportApi.update(id, data);
        setState((prev) => ({
          ...prev,
          loading: false,
          selectedPassport: prev.selectedPassport?.id === id ? updated : prev.selectedPassport,
          passports: prev.passports
            ? {
                ...prev.passports,
                data: prev.passports.data.map((p) => (p.id === id ? updated : p)),
              }
            : null,
        }));
        return updated;
      } catch (err) {
        const message = err instanceof ApiException ? err.message : 'Failed to update passport application.';
        setError(message);
        return null;
      }
    },
    []
  );

  const deletePassport = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setState((prev) => ({ ...prev, error: null }));
      await passportApi.delete(id);
      setState((prev) => ({
        ...prev,
        loading: false,
        passports: prev.passports
          ? {
              ...prev.passports,
              data: prev.passports.data.filter((p) => p.id !== id),
              total: prev.passports.total - 1,
            }
          : null,
        selectedPassport: prev.selectedPassport?.id === id ? null : prev.selectedPassport,
      }));
      return true;
    } catch (err) {
      const message = err instanceof ApiException ? err.message : 'Failed to delete passport application.';
      setError(message);
      return false;
    }
  }, []);

  const fetchHistory = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setState((prev) => ({ ...prev, error: null }));
      const history = await passportApi.getHistory(id);
      setState((prev) => ({ ...prev, history, loading: false }));
    } catch (err) {
      const message = err instanceof ApiException ? err.message : 'Failed to load passport history.';
      setError(message);
    }
  }, []);

  const uploadDocument = useCallback(
    async (id: string, file: File, documentType: string): Promise<boolean> => {
      try {
        setLoading(true);
        setState((prev) => ({ ...prev, error: null }));
        await passportApi.uploadDocument(id, file, documentType);
        setLoading(false);
        return true;
      } catch (err) {
        const message = err instanceof ApiException ? err.message : 'Failed to upload document.';
        setError(message);
        return false;
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const clearSelected = useCallback(() => {
    setState((prev) => ({ ...prev, selectedPassport: null, history: [] }));
  }, []);

  return {
    ...state,
    fetchPassports,
    fetchPassport,
    createPassport,
    updatePassport,
    deletePassport,
    fetchHistory,
    uploadDocument,
    clearError,
    clearSelected,
  };
}

export default usePassports;
