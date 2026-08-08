import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Send } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import { fadeUp } from '../ui/motion';
import { profile } from '../../data/site';

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'ok'; message: string }
  | { kind: 'error'; message: string };

/** Spec calls for bottom-border-only fields with a cyan focus underline. */
const fieldClass =
  'w-full border-0 border-b border-line bg-transparent px-0 py-3 text-ink placeholder:text-ink-3 focus:border-accent focus:outline-none focus:ring-0 transition-colors';

const Contact = () => {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus({ kind: 'sending' });

    const formData = new FormData(form);
    formData.append('access_key', profile.web3formsKey);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        setStatus({ kind: 'ok', message: 'Message sent. I will get back to you shortly.' });
        form.reset();
      } else {
        setStatus({
          kind: 'error',
          message: data.message ?? 'Something went wrong. Email me directly instead.',
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setStatus({ kind: 'error', message: `Could not send: ${message}` });
    }
  };

  return (
    <section id="contact" className="border-t border-line-soft px-4 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeader
          eyebrow="Contact"
          title="Get in touch"
          lede="Open to AI/ML engineering work, collaborations, and interesting problems. I read everything that comes through."
        />

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          <motion.form {...fadeUp} onSubmit={onSubmit} className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="label-mono mb-1 block">
                  Name
                </label>
                <input id="name" name="name" type="text" required placeholder="Your name" className={fieldClass} />
              </div>
              <div>
                <label htmlFor="email" className="label-mono mb-1 block">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@company.com"
                  className={fieldClass}
                />
              </div>
            </div>

            <div className="mt-8">
              <label htmlFor="message" className="label-mono mb-1 block">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                placeholder="What are you working on?"
                className={`${fieldClass} resize-none`}
              />
            </div>

            <button
              type="submit"
              disabled={status.kind === 'sending'}
              className="mt-10 inline-flex items-center justify-center gap-2 rounded-lg bg-solid px-8 py-3.5 font-bold text-on-solid transition-opacity hover:opacity-85 disabled:opacity-50"
            >
              {status.kind === 'sending' ? 'Sending…' : 'Send message'}
              <Send size={16} />
            </button>

            {(status.kind === 'ok' || status.kind === 'error') && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                role="status"
                aria-live="polite"
                className={`mt-6 border-l-2 py-3 pl-4 font-mono text-sm ${
                  status.kind === 'ok' ? 'border-accent text-ink-2' : 'border-red-500 text-ink'
                }`}
              >
                {status.message}
              </motion.p>
            )}
          </motion.form>

          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="rounded border border-line bg-surface-1 p-8">
              <div className="label-mono text-accent">Direct</div>

              <dl className="mt-5 divide-y divide-line-soft">
                {[
                  { k: 'Email', v: profile.email, href: `mailto:${profile.email}` },
                  { k: 'LinkedIn', v: 'rahul-sandesh', href: profile.linkedin },
                  { k: 'GitHub', v: 'Flame77X', href: profile.github },
                ].map((row) => (
                  <div key={row.k} className="flex items-baseline justify-between gap-4 py-4">
                    <dt className="label-mono">{row.k}</dt>
                    <dd className="min-w-0 text-right">
                      <a
                        href={row.href}
                        target={row.href.startsWith('http') ? '_blank' : undefined}
                        rel={row.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="break-all text-[15px] text-ink underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                      >
                        {row.v}
                      </a>
                    </dd>
                  </div>
                ))}
                <div className="flex items-baseline justify-between gap-4 py-4">
                  <dt className="label-mono">Based in</dt>
                  <dd className="text-right text-[15px] text-ink">{profile.location}</dd>
                </div>
              </dl>

              <a
                href={profile.calendar}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-ink px-6 py-3.5 font-bold text-ink transition-colors hover:bg-surface-3"
              >
                Book a 30 min call <ArrowUpRight size={16} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
