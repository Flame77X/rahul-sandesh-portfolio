import { ReactLenis } from '@studio-freight/react-lenis';
import type { ReactNode } from 'react';
import { usePrefersReducedMotion } from '../../hooks/useEnvironment';

const Layout = ({ children }: { children: ReactNode }) => {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <ReactLenis root options={{ smoothWheel: !reducedMotion, syncTouch: false }}>
      <div className="relative w-full min-h-screen">{children}</div>
    </ReactLenis>
  );
};

export default Layout;
