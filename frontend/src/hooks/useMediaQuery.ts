import { useCallback, useSyncExternalStore } from 'react';

/**
 * useSyncExternalStore (não useState+useEffect) porque matchMedia é um
 * sistema externo ao React - é exatamente o caso de uso que essa API
 * resolve, e evita side-effects de setState síncrono dentro de um efeito.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener('change', callback);
      return () => mediaQueryList.removeEventListener('change', callback);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
