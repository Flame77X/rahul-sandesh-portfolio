import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import { navItems, profile } from '../../data/site';

const useActiveSection = () => {
  const [active, setActive] = useState(navItems[0].id);

  useEffect(() => {
    const observers = navItems
      .map(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return null;
        const obs = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) setActive(id);
          },
          { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
        );
        obs.observe(el);
        return obs;
      })
      .filter(Boolean) as IntersectionObserver[];

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return active;
};

const Nav = () => {
  const active = useActiveSection();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <>
      {/* Glassmorphic persistent bar — 80% surface + blur, hairline base */}
      <header className="fixed top-0 z-50 w-full border-b border-line-soft bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 md:px-8">
          <a
            href="#hero"
            className="font-display text-lg font-bold tracking-tight text-ink md:text-xl"
          >
            {profile.initials}
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
            {navItems.map(({ label, id }) => {
              const isActive = active === id;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative py-1 text-[15px] transition-colors ${
                    isActive ? 'text-ink' : 'text-ink-2 hover:text-ink'
                  }`}
                >
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="navUnderline"
                      className="absolute -bottom-0.5 left-0 right-0 h-px bg-ink"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="#contact"
              className="hidden rounded-lg bg-solid px-5 py-2.5 text-sm font-bold text-on-solid transition-opacity hover:opacity-85 sm:inline-block"
            >
              Connect
            </a>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="grid h-9 w-9 place-items-center rounded border border-line text-ink md:hidden"
            >
              <Menu size={16} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex flex-col bg-surface md:hidden"
          >
            <div className="flex h-16 items-center justify-between border-b border-line-soft px-4">
              <span className="font-display text-lg font-bold text-ink">{profile.initials}</span>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="grid h-9 w-9 place-items-center rounded border border-line text-ink"
              >
                <X size={16} />
              </button>
            </div>

            <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center px-6">
              {navItems.map(({ label, id }, i) => (
                <motion.a
                  key={id}
                  href={`#${id}`}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                  className="border-b border-line-soft py-5 font-display text-3xl font-semibold text-ink"
                >
                  {label}
                </motion.a>
              ))}
            </nav>

            <div className="p-6">
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg bg-solid py-4 text-center font-bold text-on-solid"
              >
                Connect
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav;
