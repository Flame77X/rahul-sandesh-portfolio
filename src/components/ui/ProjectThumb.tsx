import type { ThumbMotif } from '../../data/site';

/**
 * Flat SVG plate for a project card. Draws in `currentColor`, so a card sets
 * the tone by setting its own text colour — that keeps it legible on the light
 * surface, on the inverted obsidian panel, and in dark theme without variants.
 *
 * Pass `image` (a path under /public) to show a real screenshot instead —
 * that is the preferred end state for every card.
 */

const motifs: Record<ThumbMotif, React.ReactNode> = {
  knot: (
    <g fill="none" stroke="currentColor" strokeWidth="0.7">
      <ellipse cx="60" cy="40" rx="26" ry="13" />
      <ellipse cx="60" cy="40" rx="26" ry="13" transform="rotate(60 60 40)" />
      <ellipse cx="60" cy="40" rx="26" ry="13" transform="rotate(120 60 40)" />
      <circle cx="60" cy="40" r="3.5" fill="currentColor" stroke="none" />
    </g>
  ),
  nodes: (
    <g stroke="currentColor" strokeWidth="0.7">
      <path d="M30 22 L60 40 L92 20 M30 58 L60 40 L92 60 M30 22 L30 58 M92 20 L92 60" fill="none" opacity="0.5" />
      {[[30, 22], [92, 20], [60, 40], [30, 58], [92, 60]].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.8" fill="currentColor" stroke="none" />
      ))}
    </g>
  ),
  grid: (
    <g fill="none" stroke="currentColor" strokeWidth="0.7">
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => (
          <rect
            key={`${r}-${c}`}
            x={38 + c * 16}
            y={22 + r * 16}
            width="11"
            height="11"
            opacity={0.45 + ((r + c) % 3) * 0.25}
          />
        ))
      )}
    </g>
  ),
  waves: (
    <g fill="none" stroke="currentColor" strokeWidth="0.7">
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d={`M14 ${20 + i * 10} Q 45 ${10 + i * 10}, 60 ${20 + i * 10} T 106 ${20 + i * 10}`}
          opacity={1 - i * 0.15}
        />
      ))}
    </g>
  ),
  wireframe: (
    <g fill="none" stroke="currentColor" strokeWidth="0.7">
      <path d="M60 12 L88 40 L60 68 L32 40 Z" />
      <path d="M60 12 L60 68 M32 40 L88 40" opacity="0.5" />
      <path d="M60 12 L44 54 L76 54 Z" opacity="0.35" />
    </g>
  ),
  rings: (
    <g fill="none" stroke="currentColor" strokeWidth="0.7">
      {[10, 17, 24, 31].map((r, i) => (
        <ellipse
          key={r}
          cx="60"
          cy="40"
          rx={r}
          ry={r * 0.42}
          opacity={1 - i * 0.18}
          transform={`rotate(${i * 22} 60 40)`}
        />
      ))}
    </g>
  ),
  float: (
    <g fill="none" stroke="currentColor" strokeWidth="0.7">
      <path d="M60 16 L84 56 L36 56 Z" />
      <path d="M60 16 L60 56 M36 56 L84 56" opacity="0.45" />
      <ellipse cx="60" cy="64" rx="20" ry="3" opacity="0.25" />
    </g>
  ),
};

interface ProjectThumbProps {
  motif: ThumbMotif;
  image?: string;
  alt: string;
  className?: string;
}

const ProjectThumb = ({ motif, image, alt, className = '' }: ProjectThumbProps) => {
  if (image) {
    return (
      <img
        src={image}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 120 80"
      className={`h-full w-full ${className}`}
      preserveAspectRatio="xMidYMid meet"
      role="presentation"
    >
      {motifs[motif]}
    </svg>
  );
};

export default ProjectThumb;
