import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop
 * Secara otomatis mereset scroll window dan container dokumen ke posisi paling atas (0, 0)
 * setiap kali terjadi navigasi rute (ganti halaman, tombol back, next, reload rute, dll).
 */
export const ScrollToTop: React.FC = () => {
  const { pathname, search, key } = useLocation();

  useEffect(() => {
    // 1. Reset window viewport scroll
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // 2. Reset document element & body scroll
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }

    // 3. Reset any custom scrollable container
    const customScrollables = document.querySelectorAll(
      '.custom-scroll, [data-scroll-container], main, #root'
    );
    customScrollables.forEach((el) => {
      el.scrollTop = 0;
    });
  }, [pathname, search, key]);

  return null;
};

export default ScrollToTop;
