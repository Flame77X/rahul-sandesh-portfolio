import { motion } from 'framer-motion';
import { ArrowRight, FileText } from 'lucide-react';
import { profile } from '../../data/site';

const Hero = ({ onOpenResume }: { onOpenResume: () => void }) => (
  <section id="hero" className="px-4 pt-32 pb-24 md:px-8 md:pt-44 md:pb-32">
    <div className="mx-auto max-w-[1280px]">
      <div className="mx-auto max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="label-mono mb-6"
        >
          {profile.tagline}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="font-display text-[clamp(2.5rem,7vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.02em] text-ink"
        >
          {profile.headline[0]} {profile.headline[1]}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-ink-2"
        >
          {profile.summary}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a
            href="#work"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-solid px-7 py-3.5 font-bold text-on-solid transition-opacity hover:opacity-85 sm:w-auto"
          >
            View Selected Work
            <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
          </a>
          <button
            onClick={onOpenResume}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-ink px-7 py-3.5 font-bold text-ink transition-colors hover:bg-surface-3 sm:w-auto"
          >
            <FileText size={16} /> Resume
          </button>
        </motion.div>
      </div>

    </div>
  </section>
);

export default Hero;
