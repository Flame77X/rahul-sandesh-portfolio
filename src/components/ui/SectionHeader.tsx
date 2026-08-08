import { motion } from 'framer-motion';
import { fadeUp } from './motion';

/** Consistent editorial section opener: mono eyebrow, serif headline, lede. */
const SectionHeader = ({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) => (
  <motion.div {...fadeUp} className="mb-14">
    <div className="label-mono text-accent">{eyebrow}</div>
    <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] text-ink">
      {title}
    </h2>
    {lede && <p className="mt-5 max-w-2xl text-lg leading-8 text-ink-2">{lede}</p>}
  </motion.div>
);

export default SectionHeader;
