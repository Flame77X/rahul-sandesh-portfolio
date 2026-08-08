import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useMediaQuery, usePrefersReducedMotion } from '../../hooks/useEnvironment';

/**
 * Custom cursor. The stylesheet hides the native cursor under exactly the same
 * media query this component mounts on, so there is never a state where both
 * are hidden.
 */
const Cursor = () => {
  const enabled = useMediaQuery('(min-width: 768px) and (pointer: fine)');
  const reducedMotion = usePrefersReducedMotion();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY });
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(Boolean(target.closest('a, button, input, textarea, .hover-target')));
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white mix-blend-difference pointer-events-none z-[9999]"
      animate={{
        x: position.x - 16,
        y: position.y - 16,
        scale: isHovering ? 2.5 : 1,
        opacity: isHovering ? 0.5 : 1,
      }}
      transition={
        reducedMotion
          ? { duration: 0 }
          : { type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }
      }
    />
  );
};

export default Cursor;
