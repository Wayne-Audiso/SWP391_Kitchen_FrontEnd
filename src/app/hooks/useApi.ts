import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: object) => void;
  onError?: (error: Error) => void;
}

export interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (...args: (string | number | boolean | null | object)[]) => Promise<T | null>;
  reset: () => void;
}

type ApiArg = string | number | boolean | null | object;

type ApiResponseLike<T> = { data: T } | T;

const toError = (err: object | null): Error => {
  if (err instanceof Error) return err;
  return new Error('An unexpected error occurred.');
};

export function useApi<T extends object>(
  apiFunction: (...args: ApiArg[]) => Promise<ApiResponseLike<T>>,
  options: Omit<UseApiOptions, 'onSuccess'> & { onSuccess?: (data: T) => void } = {}
): UseApiReturn<T> {
  const { immediate = false, onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(immediate);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...args: ApiArg[]): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiFunction(...args);
        const result = typeof response === 'object' && response !== null && 'data' in response
          ? (response as { data: T }).data
          : (response as T);

        setData(result);

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        const errorObj = typeof err === 'object' ? toError(err) : new Error('An unexpected error occurred.');
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

type PaginationInfo = { total: number; totalPages: number };

type WithPagination<T> = T & { pagination?: PaginationInfo };

export function usePaginatedApi<T extends object>(
  apiFunction: (params: object) => Promise<ApiResponseLike<WithPagination<T[]>>>,
  options: UsePaginatedApiOptions = {}
): UsePaginatedApiReturn<T> {
  const { initialPage = 1, initialPageSize = 10, ...apiOptions } = options;

  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const apiHook = useApi<T[]>(apiFunction, apiOptions);

  const execute = useCallback(
    async (customParams?: object) => {
      const params = {
        page,
        pageSize,
        ...customParams,
      };

      const response = await apiHook.execute(params);

      if (response && typeof response === 'object' && Object.prototype.hasOwnProperty.call(response, 'pagination')) {
        const pagination = (response as { pagination?: PaginationInfo }).pagination;
        if (pagination) {
          setTotal(pagination.total);
          setTotalPages(pagination.totalPages);
        }
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
  onSuccess?: (data: object) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

export interface UseMutationReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  mutate: (...args: ApiArg[]) => Promise<T | null>;
  reset: () => void;
}

export function useMutation<T extends object>(
  apiFunction: (...args: ApiArg[]) => Promise<ApiResponseLike<T>>,
  options: Omit<UseMutationOptions, 'onSuccess'> & { onSuccess?: (data: T) => void } = {}
): UseMutationReturn<T> {
  const { onSuccess, onError, successMessage, errorMessage } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (...args: ApiArg[]): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiFunction(...args);
        const result = typeof response === 'object' && response !== null && 'data' in response
          ? (response as { data: T }).data
          : (response as T);

        setData(result);

        if (successMessage) {
          toast.success(successMessage);
        }

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        const errorObj = typeof err === 'object' ? toError(err) : new Error('An unexpected error occurred.');
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
