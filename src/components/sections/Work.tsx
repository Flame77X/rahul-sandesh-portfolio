import { motion } from 'framer-motion';
import ProjectThumb from '../ui/ProjectThumb';
import SectionHeader from '../ui/SectionHeader';
import { fadeUp } from '../ui/motion';
import { projects, type Project } from '../../data/site';

/**
 * Cards are presentational only — no outbound links and no status badges.
 * Each entry states what the project is and what it was built with.
 */

const Tags = ({ tags, muted }: { tags?: string[]; muted?: boolean }) =>
  tags?.length ? (
    <ul className="mt-6 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li
          key={tag}
          className={`rounded px-2.5 py-1 font-mono text-xs ${
            muted
              ? 'border border-on-solid/20 text-on-solid/80'
              : 'border border-line bg-surface-2 text-ink-2'
          }`}
        >
          {tag}
        </li>
      ))}
    </ul>
  ) : null;

/** Flagship — inverted obsidian panel, the one high-contrast moment on the page. */
const FeaturedCard = ({ project }: { project: Project }) => (
  <motion.article {...fadeUp} className="overflow-hidden rounded bg-solid text-on-solid">
    <div className="grid grid-cols-1 lg:grid-cols-12">
      <div className="p-8 md:p-12 lg:col-span-7">
        <div className="label-mono text-on-solid/60">{project.kind}</div>
        <h3 className="mt-4 font-display text-3xl font-bold leading-tight md:text-4xl">
          {project.title}
        </h3>
        {project.period && (
          <div className="label-mono mt-4 text-on-solid/60">{project.period}</div>
        )}
        <p className="mt-6 max-w-xl text-[15px] leading-7 text-on-solid/75">{project.desc}</p>
        <Tags tags={project.tags} muted />
      </div>

      <div className="relative min-h-[220px] border-t border-on-solid/10 lg:col-span-5 lg:border-l lg:border-t-0">
        <div className="absolute inset-0 p-10 text-on-solid/45">
          <ProjectThumb
            motif={project.motif}
            image={project.image}
            alt={`${project.title} preview`}
          />
        </div>
      </div>
    </div>
  </motion.article>
);

const Card = ({ project, index }: { project: Project; index: number }) => (
  <motion.article
    {...fadeUp}
    transition={{ ...fadeUp.transition, delay: Math.min(index * 0.05, 0.2) }}
    className="flex h-full flex-col rounded border border-line bg-surface-1 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgb(0_0_0/0.06)]"
  >
    <div className="h-36 border-b border-line-soft p-8 text-accent">
      <ProjectThumb motif={project.motif} image={project.image} alt={`${project.title} preview`} />
    </div>

    <div className="flex flex-1 flex-col p-7">
      <div className="label-mono">{project.kind}</div>
      <h3 className="mt-3 font-display text-xl font-semibold text-ink">{project.title}</h3>
      {project.period && <div className="label-mono mt-2">{project.period}</div>}
      <p className="mt-4 flex-1 text-[15px] leading-7 text-ink-2">{project.desc}</p>
      <Tags tags={project.tags} />
    </div>
  </motion.article>
);

const Work = () => {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section id="work" className="border-t border-line-soft px-4 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeader
          eyebrow="Selected Work"
          title="Projects"
          lede="Applied systems built around LLM inference, retrieval, and the data pipelines feeding them."
        />

        <div className="space-y-5">
          {featured.map((p) => (
            <FeaturedCard key={p.title} project={p} />
          ))}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p, i) => (
              <Card key={p.title} project={p} index={i} />
            ))}
          </div>
        </div>

        {/*
          The cards are deliberately a summary. This is the handoff — without
          it a curious visitor reaches the end of the grid with nowhere to go.
        */}
        <motion.div
          {...fadeUp}
          className="mt-14 flex flex-col items-start gap-4 border-t border-line-soft pt-10 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-[17px] text-ink-2">
            Happy to walk through the architecture and trade-offs behind any of these.
          </p>
          <a
            href="#contact"
            className="shrink-0 rounded-lg border border-ink px-6 py-3 font-bold text-ink transition-colors hover:bg-surface-3"
          >
            Get in touch
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Work;
