/** Shared scroll-reveal presets so every section animates identically. */

export const fadeUp = {
  initial: { y: 40, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  transition: { duration: 0.7, ease: 'easeOut' as const },
  viewport: { once: true, margin: '-50px' },
};

export const scaleIn = {
  initial: { scale: 0.96, opacity: 0 },
  whileInView: { scale: 1, opacity: 1 },
  transition: { duration: 0.6, ease: 'easeOut' as const },
  viewport: { once: true, margin: '-50px' },
};
