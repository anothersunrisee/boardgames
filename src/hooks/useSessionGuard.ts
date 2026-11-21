import { useEffect } from 'react';

/**
 * useSessionGuard Hook
 * Mencegah reload F5, penutupan tab tidak sengaja, atau navigasi back
 * saat sesi permainan aktif sedang berlangsung.
 */
export function useSessionGuard(isGameActive = true) {
  useEffect(() => {
    if (!isGameActive) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Standar browser modern: browser akan menampilkan dialog konfirmasi native
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isGameActive]);
}
