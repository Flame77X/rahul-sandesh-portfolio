import { ArrowUp } from 'lucide-react';
import { navItems, profile } from '../../data/site';

const links = [
  { href: profile.linkedin, label: 'LinkedIn' },
  { href: profile.github, label: 'GitHub' },
  { href: `mailto:${profile.email}`, label: 'Email' },
];

const Footer = () => (
  <footer className="border-t border-line-soft px-4 py-14 md:px-8">
    <div className="mx-auto max-w-[1280px]">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="font-display text-lg font-bold tracking-tight text-ink">
            {profile.initials}
          </div>
          <p className="mt-2 max-w-xs text-sm leading-6 text-ink-2">{profile.blurb}</p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-7 gap-y-2">
          {navItems.map(({ label, id }) => (
            <a
              key={id}
              href={`#${id}`}
              className="text-sm text-ink-2 transition-colors hover:text-ink"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex flex-wrap gap-x-7 gap-y-2">
          {links.map(({ href, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="text-sm text-ink-2 transition-colors hover:text-ink"
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-line-soft pt-6 sm:flex-row sm:items-center">
        <div className="label-mono">
          © {new Date().getFullYear()} {profile.name}
        </div>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group label-mono inline-flex items-center gap-2 transition-colors hover:text-accent"
        >
          Back to top
          <ArrowUp size={13} className="transition-transform group-hover:-translate-y-0.5" />
        </button>
      </div>
    </div>
  </footer>
);

export default Footer;
