import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface UseApiOptions {
  immediate?: boolean; // Auto-fetch on mount
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

/**
 * Custom hook for making API calls with loading and error states
 * @param apiFunction - The API function to call
 * @param options - Configuration options
 */
export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<any>,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const { immediate = false, onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(immediate);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiFunction(...args);
        const result = response?.data || response;

        setData(result);

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err: any) {
        const errorObj = err as Error;
        setError(errorObj);

        if (onError) {
          onError(errorObj);
        }

        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

/**
 * Hook for paginated API calls
 */
export interface UsePaginatedApiOptions extends UseApiOptions {
  initialPage?: number;
  initialPageSize?: number;
}

export interface UsePaginatedApiReturn<T> extends UseApiReturn<T[]> {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  refresh: () => void;
}

export function usePaginatedApi<T = any>(
  apiFunction: (params: any) => Promise<any>,
  options: UsePaginatedApiOptions = {}
): UsePaginatedApiReturn<T> {
  const { initialPage = 1, initialPageSize = 10, ...apiOptions } = options;

  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const apiHook = useApi<T[]>(apiFunction, apiOptions);

  const execute = useCallback(
    async (customParams?: any) => {
      const params = {
        page,
        pageSize,
        ...customParams,
      };

      const response = await apiHook.execute(params);

      if (response && (response as any).pagination) {
        const paginationData = (response as any).pagination;
        setTotal(paginationData.total);
        setTotalPages(paginationData.totalPages);
      }

      return response;
    },
    [apiHook.execute, page, pageSize]
  );

  const nextPage = useCallback(() => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  }, [page, totalPages]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  }, [page]);

  const refresh = useCallback(() => {
    execute();
  }, [execute]);

  useEffect(() => {
    if (options.immediate !== false) {
      execute();
    }
  }, [page, pageSize]);

  return {
    ...apiHook,
    execute,
    page,
    pageSize,
    total,
    totalPages,
    setPage,
    setPageSize,
    nextPage,
    prevPage,
    refresh,
  };
}

/**
 * Hook for mutations (POST, PUT, PATCH, DELETE)
 */
export interface UseMutationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  successMessage?: string;
  errorMessage?: string;
}

export interface UseMutationReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  mutate: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export function useMutation<T = any>(
  apiFunction: (...args: any[]) => Promise<any>,
  options: UseMutationOptions = {}
): UseMutationReturn<T> {
  const { onSuccess, onError, successMessage, errorMessage } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (...args: any[]): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiFunction(...args);
        const result = response?.data || response;

        setData(result);

        if (successMessage) {
          toast.success(successMessage);
        }

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err: any) {
        const errorObj = err as Error;
        setError(errorObj);

        if (errorMessage) {
          toast.error(errorMessage);
        }

        if (onError) {
          onError(errorObj);
        }

        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, onSuccess, onError, successMessage, errorMessage]
  );

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    mutate,
    reset,
  };
}
