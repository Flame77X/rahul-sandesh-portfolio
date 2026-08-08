import {
  certifications,
  education,
  experience,
  profile,
  projects,
  skills,
} from '../../data/site';

/**
 * The resume itself, rendered from data/site.ts.
 *
 * One component with two consumers:
 *   - ResumeModal shows it in the popup
 *   - scripts/generate-resume.mjs prints it to public/resume.pdf
 *
 * That is what keeps the downloadable PDF and the on-site view from drifting:
 * they are the same markup and the same data, so there is nothing to sync.
 * Edit site.ts, run `npm run resume`.
 */

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="resume-section border-t border-line-soft pt-3.5">
    <h3 className="label-mono text-accent">{title}</h3>
    <div className="mt-3">{children}</div>
  </section>
);

const EntryHead = ({ title, meta }: { title: string; meta?: string }) => (
  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
    <h4 className="font-display text-[17px] font-semibold text-ink">{title}</h4>
    {meta && <span className="label-mono shrink-0">{meta}</span>}
  </div>
);

const ResumeDocument = () => (
  <article className="resume-doc mx-auto max-w-2xl space-y-3">
    <header className="text-center">
      <h1 className="font-display text-3xl font-bold tracking-tight text-ink">{profile.name}</h1>
      <p className="mt-2 text-[15px] text-ink-2">{profile.tagline}</p>
      <p className="label-mono mt-3">
        {profile.location} // {profile.email}
      </p>
      <p className="label-mono mt-1">
        {profile.linkedin.replace('https://www.', '')} // {profile.github.replace('https://', '')}
      </p>
    </header>

    <Section title="Summary">
      <p className="text-[14px] leading-[1.5] text-ink-2">{profile.summary}</p>
    </Section>

    <Section title="Experience">
      <div className="space-y-3.5">
        {experience.map((exp) => (
          <div key={`${exp.company}-${exp.title}`} className="resume-entry">
            <EntryHead title={exp.title} meta={exp.period} />
            <div className="text-[13.5px] text-ink-2">
              {exp.company}
              {exp.location && ` · ${exp.location}`}
            </div>
            <ul className="mt-2 space-y-1">
              {exp.points.map((point) => (
                <li
                  key={point}
                  className="relative pl-4 text-[13.5px] leading-[1.5] text-ink-2 before:absolute before:left-0 before:top-[0.62em] before:h-1 before:w-1 before:rounded-full before:bg-accent"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>

    <Section title="Projects">
      <div className="space-y-3">
        {projects
          .filter((p) => p.period)
          .map((p) => (
            <div key={p.title} className="resume-entry">
              <EntryHead title={p.title} meta={p.period} />
              {p.tags && (
                <div className="mt-0.5 font-mono text-[11px] text-ink-3">{p.tags.join(' · ')}</div>
              )}
              <p className="mt-1 text-[13.5px] leading-[1.5] text-ink-2">{p.desc}</p>
            </div>
          ))}
      </div>
    </Section>

    <Section title="Education">
      <div className="resume-entry">
        <EntryHead title={education.degree} meta={education.period} />
        <div className="text-[13.5px] text-ink-2">
          {education.school} · {education.location}
        </div>
        <p className="mt-1 text-[13.5px] leading-[1.5] text-ink-2">
          Coursework: {education.coursework.join(', ')}
        </p>
      </div>
    </Section>

    <Section title="Skills">
      <dl className="space-y-1.5">
        {skills.map((group) => (
          <div key={group.label} className="resume-entry sm:flex sm:gap-4">
            <dt className="label-mono shrink-0 sm:w-36 sm:pt-1">{group.label}</dt>
            <dd className="text-[13.5px] leading-[1.5] text-ink-2">{group.items.join(', ')}</dd>
          </div>
        ))}
      </dl>
    </Section>

    <Section title="Certifications">
      <ul className="space-y-1.5">
        {certifications.map((cert) => (
          <li key={cert.name} className="text-[13.5px] leading-[1.5] text-ink-2">
            {cert.name} — <span className="text-ink-3">{cert.issuer}</span>
          </li>
        ))}
      </ul>
    </Section>
  </article>
);

export default ResumeDocument;
