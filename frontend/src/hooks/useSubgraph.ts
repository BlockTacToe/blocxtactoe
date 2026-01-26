'use client';

import { useState, useCallback } from 'react';

const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/1724161/blocxtactoe-subgraph/v0.0.1';

export function useSubgraph() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const query = useCallback(async <T>(queryString: string, variables: Record<string, any> = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(SUBGRAPH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: queryString,
          variables,
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      return result.data as T;
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(err.message || 'Unknown error'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { query, loading, error };
}
