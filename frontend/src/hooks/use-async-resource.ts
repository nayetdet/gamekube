'use client';

import { useCallback, useEffect, useState } from 'react';

interface AsyncResource<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  reload: () => Promise<void>;
}

export function useAsyncResource<T>(load: () => Promise<T>): AsyncResource<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await load());
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason
          : new Error('Ocorreu um erro inesperado.'),
      );
    } finally {
      setLoading(false);
    }
  }, [load]);

  useEffect(() => {
    let current = true;
    async function loadResource() {
      await Promise.resolve();
      if (!current) return;
      setLoading(true);
      try {
        const nextData = await load();
        if (!current) return;
        setData(nextData);
        setError(null);
      } catch (reason) {
        if (!current) return;
        setError(
          reason instanceof Error
            ? reason
            : new Error('Ocorreu um erro inesperado.'),
        );
      } finally {
        if (current) setLoading(false);
      }
    }
    void loadResource();
    return () => {
      current = false;
    };
  }, [load]);

  return { data, error, loading, reload };
}
