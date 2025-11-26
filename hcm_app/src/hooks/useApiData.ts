import { useCallback, useEffect, useState } from 'react';

import { ApiClientType } from '../api';
import { useApi } from '../hooks/useApi';

type ApiData<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refresh: () => void;
};

/**
 * A hook for fetching data using an API function and returning the result and loading state.
 * @param apiFunction The function to call to fetch the data, takes an ApiClientType object as input and returns a Promise of an ApiResponse object.
 * @returns An ApiData object containing the fetched data, loading state, error object and a refresh function to refetch the data.
 */
export function useApiData<T>(
  apiFunction: (api: ApiClientType) => Promise<ApiResponse<T>>
): ApiData<T> {
  const api = useApi();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const memoizedApiFunction = useCallback(apiFunction, [api]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await memoizedApiFunction(api);
      setData(response.results);
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [memoizedApiFunction, api]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
}
