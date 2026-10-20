import { useEffect } from 'react';
export function useWorkspaceScale() {
  useEffect(() => {
    const fit = () =>
      document.documentElement.style.setProperty(
        '--overview-scale',
        String(Math.max(1, document.documentElement.clientWidth / 1440)),
      );
    fit();
    addEventListener('resize', fit);
    return () => {
      removeEventListener('resize', fit);
      document.documentElement.style.removeProperty('--overview-scale');
    };
  }, []);
}
