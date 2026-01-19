import { useEffect, useState } from 'react';
import type { Repository, RepositoryStatsPayload } from '@/types/repositories';
import { withBasePath } from '@/lib/site';

const REPOSITORY_STATS_URL = withBasePath('/data/repositories.json');
const FALLBACK_URL =
  'https://raw.githubusercontent.com/markhazleton/github-stats-spark/main/data/repositories.json';

type RepositoryStatus = 'idle' | 'loading' | 'success' | 'error';

type RepositoryState = {
  status: RepositoryStatus;
  data: Repository[];
  metadata: RepositoryStatsPayload["metadata"] | null;
  error: string | null;
};

const getBootstrapPayload = () => {
  const globalPayload =
    typeof globalThis !== "undefined"
      ? (globalThis as { __REPOSITORY_STATS__?: RepositoryStatsPayload }).__REPOSITORY_STATS__
      : undefined;
  if (globalPayload?.repositories) {
    return globalPayload;
  }

  if (typeof window !== "undefined") {
    const windowPayload = (window as { __REPOSITORY_STATS__?: RepositoryStatsPayload })
      .__REPOSITORY_STATS__;
    if (windowPayload?.repositories) {
      return windowPayload;
    }
  }

  return null;
};

export function useRepositoryStats() {
  const bootstrapPayload = getBootstrapPayload();
  const [repositoryState, setRepositoryState] = useState<RepositoryState>({
    status: bootstrapPayload ? 'success' : 'idle',
    data: bootstrapPayload?.repositories ?? [],
    metadata: bootstrapPayload?.metadata ?? null,
    error: null,
  });

  useEffect(() => {
    if (bootstrapPayload) {
      return;
    }

    const controller = new AbortController();
    const loadRepositories = async () => {
      setRepositoryState((prev) => ({
        ...prev,
        status: 'loading',
        error: null,
      }));

      try {
        // Try local data file first for better performance
        let response = await fetch(REPOSITORY_STATS_URL, {
          signal: controller.signal,
          headers: {
            Accept: 'application/json',
          },
        });

        // Fallback to GitHub if local file not available
        if (!response.ok) {
          response = await fetch(FALLBACK_URL, {
            signal: controller.signal,
            cache: 'no-store',
            headers: {
              Accept: 'application/json',
            },
          });
        }

        if (!response.ok) {
          throw new Error(`Request failed (${response.status})`);
        }

        const payload = (await response.json()) as RepositoryStatsPayload;
        const repositories = Array.isArray(payload.repositories)
          ? payload.repositories
          : [];

        setRepositoryState({
          status: 'success',
          data: repositories,
          metadata: payload.metadata ?? null,
          error: null,
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setRepositoryState({
          status: 'error',
          data: [],
          metadata: null,
          error: 'Unable to load repository updates right now.',
        });
      }
    };

    void loadRepositories();

    return () => controller.abort();
  }, [bootstrapPayload]);

  return repositoryState;
}
