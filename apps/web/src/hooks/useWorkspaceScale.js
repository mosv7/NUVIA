import { useLayoutEffect } from 'react';

// The existing overview's desktop canvas is the reference for every product page.
export default function useWorkspaceScale() {
  useLayoutEffect(() => {
    const fit = () =>
      document.documentElement.style.setProperty(
        '--overview-scale',
        String(Math.min(1.1, Math.max(1, document.documentElement.clientWidth / 1440))),
      );
    fit();
    addEventListener('resize', fit);
    return () => {
      removeEventListener('resize', fit);
      document.documentElement.style.removeProperty('--overview-scale');
    };
  }, []);
}

export { useWorkspaceScale };
