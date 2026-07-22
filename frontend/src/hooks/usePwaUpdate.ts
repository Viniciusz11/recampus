import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { toast } from 'sonner';

/**
 * Registra o Service Worker (o vite-plugin-pwa injeta o registro em si;
 * este hook só reage ao resultado) e avisa o usuário quando o app termina
 * de cachear tudo o que precisa para funcionar offline.
 */
export function usePwaUpdate(): void {
  const {
    offlineReady: [offlineReady, setOfflineReady],
  } = useRegisterSW();

  useEffect(() => {
    if (offlineReady) {
      toast.success('ReCampus está pronto para uso offline.');
      setOfflineReady(false);
    }
  }, [offlineReady, setOfflineReady]);
}
