import { motion } from 'framer-motion';
import SectionHeader from '../ui/SectionHeader';
import { fadeUp } from '../ui/motion';
import { principles, profile, skills } from '../../data/site';

const About = () => (
  <section id="about" className="border-t border-line-soft px-4 py-24 md:px-8 md:py-32">
    <div className="mx-auto max-w-[1280px]">
      <SectionHeader
        eyebrow="About"
        title="How I build"
        lede="A methodical approach to applied machine learning: measurable outcomes, systems that can be inspected, and interfaces that stay legible as complexity grows."
      />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <motion.div {...fadeUp} className="lg:col-span-7">
          <h3 className="font-display text-2xl font-semibold text-ink">The short version</h3>
          <p className="mt-5 text-[17px] leading-8 text-ink-2">{profile.summary}</p>
          <p className="mt-5 text-[17px] leading-8 text-ink-2">
            Most of my work sits where a model meets a real workflow — clinical documentation,
            interview practice, donor matching — so the interesting problems are rarely the model
            itself. They are retrieval quality, data shape, and whether the person on the other side
            can trust the output.
          </p>

          <blockquote className="mt-8 border-l-2 border-accent bg-surface-2 py-5 pl-6 pr-5">
            <p className="font-mono text-sm leading-7 text-ink">{profile.philosophy}</p>
          </blockquote>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
          className="lg:col-span-5"
        >
          <img
            src={profile.portrait}
            alt={profile.name}
            width={1086}
            height={1448}
            loading="lazy"
            decoding="async"
            className="mb-8 w-full rounded border border-line object-cover"
          />

          <dl>
            {[
              { k: 'Based in', v: profile.location },
              { k: 'Focus', v: 'LLM inference · RAG · NLP pipelines' },
              { k: 'Currently', v: 'Associate Software Engineer at Drizzla' },
              { k: 'Studied', v: 'B.Tech CSE (AI), Providence College of Engineering' },
            ].map((row) => (
              <div
                key={row.k}
                className="flex flex-col gap-1 border-b border-line-soft py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
              >
                <dt className="label-mono shrink-0">{row.k}</dt>
                <dd className="text-[15px] text-ink sm:text-right">{row.v}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>

      {/* Operating principles */}
      <div className="mt-24">
        <motion.h3 {...fadeUp} className="font-display text-2xl font-semibold text-ink">
          Operating principles
        </motion.h3>
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {principles.map((p, i) => (
            <motion.div
              key={p.index}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.07 }}
              className="flex flex-col rounded border border-line bg-surface-1 p-7 transition-shadow hover:shadow-[0_10px_40px_rgb(0_0_0/0.05)]"
            >
              <h4 className="font-display text-xl font-semibold leading-snug text-ink">
                {p.title}
              </h4>
              <p className="mt-4 flex-1 text-[15px] leading-7 text-ink-2">{p.body}</p>
              <div className="label-mono mt-7 border-t border-line-soft pt-4">
                {p.index} // {p.tag}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="mt-24">
        <motion.h3 {...fadeUp} className="font-display text-2xl font-semibold text-ink">
          Stack
        </motion.h3>
        <div className="mt-8 divide-y divide-line-soft border-y border-line-soft">
          {skills.map((group, i) => (
            <motion.div
              key={group.label}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.05 }}
              className="grid grid-cols-1 gap-4 py-6 md:grid-cols-12 md:gap-8"
            >
              <div className="label-mono md:col-span-3 md:pt-1">{group.label}</div>
              <ul className="flex flex-wrap gap-2 md:col-span-9">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded border border-line bg-surface-1 px-3 py-1.5 text-sm text-ink"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default About;
