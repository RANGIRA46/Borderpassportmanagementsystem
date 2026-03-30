import { useState, useCallback } from 'react';
import borderCrossingApi from '../endpoints/borderCrossingApi';
import {
  BorderCrossingResponse,
  BorderCrossingRequest,
  PaginationParams,
  PaginatedResponse,
  ApiException,
} from '../client/types';

interface BorderCrossingState {
  crossings: PaginatedResponse<BorderCrossingResponse> | null;
  selectedCrossing: BorderCrossingResponse | null;
  loading: boolean;
  error: string | null;
}

interface UseBorderCrossingsReturn extends BorderCrossingState {
  fetchCrossings: (params?: PaginationParams) => Promise<void>;
  fetchCrossing: (id: string) => Promise<void>;
  recordCrossing: (data: BorderCrossingRequest) => Promise<BorderCrossingResponse | null>;
  clearError: () => void;
  clearSelected: () => void;
}

export function useBorderCrossings(): UseBorderCrossingsReturn {
  const [state, setState] = useState<BorderCrossingState>({
    crossings: null,
    selectedCrossing: null,
    loading: false,
    error: null,
  });

  const setLoading = (loading: boolean) =>
    setState((prev) => ({ ...prev, loading }));

  const setError = (error: string | null) =>
    setState((prev) => ({ ...prev, error, loading: false }));

  const fetchCrossings = useCallback(async (params?: PaginationParams): Promise<void> => {
    try {
      setLoading(true);
      setState((prev) => ({ ...prev, error: null }));
      const crossings = await borderCrossingApi.list(params);
      setState((prev) => ({ ...prev, crossings, loading: false }));
    } catch (err) {
      const message = err instanceof ApiException ? err.message : 'Failed to load border crossings.';
      setError(message);
    }
  }, []);

  const fetchCrossing = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setState((prev) => ({ ...prev, error: null }));
      const selectedCrossing = await borderCrossingApi.getById(id);
      setState((prev) => ({ ...prev, selectedCrossing, loading: false }));
    } catch (err) {
      const message = err instanceof ApiException ? err.message : 'Failed to load border crossing details.';
      setError(message);
    }
  }, []);

  const recordCrossing = useCallback(async (data: BorderCrossingRequest): Promise<BorderCrossingResponse | null> => {
    try {
      setLoading(true);
      setState((prev) => ({ ...prev, error: null }));
      const crossing = await borderCrossingApi.create(data);
      setState((prev) => ({
        ...prev,
        loading: false,
        crossings: prev.crossings
          ? {
              ...prev.crossings,
              data: [crossing, ...prev.crossings.data],
              total: prev.crossings.total + 1,
            }
          : null,
      }));
      return crossing;
    } catch (err) {
      const message = err instanceof ApiException ? err.message : 'Failed to record border crossing.';
      setError(message);
      return null;
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const clearSelected = useCallback(() => {
    setState((prev) => ({ ...prev, selectedCrossing: null }));
  }, []);

  return {
    ...state,
    fetchCrossings,
    fetchCrossing,
    recordCrossing,
    clearError,
    clearSelected,
  };
}

export default useBorderCrossings;
