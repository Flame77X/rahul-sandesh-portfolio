import { motion } from 'framer-motion';
import SectionHeader from '../ui/SectionHeader';
import { fadeUp } from '../ui/motion';
import { certifications, education, experience } from '../../data/site';

const Experience = () => (
  <section id="experience" className="border-t border-line-soft px-4 py-24 md:px-8 md:py-32">
    <div className="mx-auto max-w-[1280px]">
      <SectionHeader
        eyebrow="Experience"
        title="Where I've worked"
        lede="A chronological record of roles, and what each one actually shipped."
      />

      {/* Editorial data list: mono period rail, generous padding, hairline rules */}
      <div className="divide-y divide-line-soft border-y border-line-soft">
        {experience.map((exp, i) => (
          <motion.article
            key={`${exp.company}-${exp.title}`}
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: Math.min(i * 0.06, 0.24) }}
            className="grid grid-cols-1 gap-5 py-10 md:grid-cols-12 md:gap-8"
          >
            <div className="md:col-span-3">
              <div className="label-mono text-accent">{exp.period}</div>
              {exp.location && <div className="label-mono mt-2">{exp.location}</div>}
            </div>

            <div className="md:col-span-9">
              <h3 className="font-display text-2xl font-semibold text-ink">{exp.title}</h3>
              <div className="mt-1 text-[15px] text-ink-2">{exp.company}</div>
              <ul className="mt-5 space-y-3">
                {exp.points.map((point) => (
                  <li
                    key={point}
                    className="relative pl-5 text-[15px] leading-7 text-ink-2 before:absolute before:left-0 before:top-[0.7em] before:h-1 before:w-1 before:rounded-full before:bg-accent"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2">
        <motion.div {...fadeUp} className="rounded border border-line bg-surface-1 p-8">
          <div className="label-mono text-accent">Education</div>
          <h3 className="mt-4 font-display text-xl font-semibold leading-snug text-ink">
            {education.degree}
          </h3>
          <div className="mt-1 text-[15px] text-ink-2">{education.school}</div>
          <div className="label-mono mt-2">
            {education.period} // {education.location}
          </div>
          <ul className="mt-6 flex flex-wrap gap-2">
            {education.coursework.map((course) => (
              <li
                key={course}
                className="rounded border border-line bg-surface-2 px-3 py-1.5 text-sm text-ink"
              >
                {course}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.08 }}
          className="rounded border border-line bg-surface-1 p-8"
        >
          <div className="label-mono text-accent">Certifications</div>
          <ul className="mt-5 divide-y divide-line-soft">
            {certifications.map((cert) => (
              <li key={cert.name} className="py-3.5">
                <div className="text-[15px] leading-6 text-ink">{cert.name}</div>
                <div className="label-mono mt-1">{cert.issuer}</div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  </section>
);

export default Experience;
