import { certifications, education, experience, profile, projects, skills } from '../data/site';

/**
 * Keyword-routed responder for the terminal widget.
 *
 * This is deliberate string matching, not a model — but it now reads from
 * data/site.ts, so its answers can never drift from what the rest of the page
 * and the resume say.
 */

const list = (items: string[]) => items.join(', ');

const answers: { match: string[]; reply: () => string }[] = [
  {
    match: ['who', 'about', 'name', 'rahul', 'yourself', 'summary'],
    reply: () => `${profile.name} — ${profile.tagline}\n\n${profile.summary}`,
  },
  {
    match: ['skill', 'stack', 'tech', 'program', 'language', 'tool'],
    reply: () => skills.map((g) => `${g.label}: ${list(g.items)}`).join('\n'),
  },
  {
    match: ['project', 'work', 'built', 'build', 'made', 'portfolio'],
    reply: () =>
      projects
        .map((p, i) => {
          const period = p.period ? ` (${p.period})` : '';
          const link = p.href ? `\n   ${p.href}` : '';
          return `${i + 1}. ${p.title}${period} — ${p.desc}${link}`;
        })
        .join('\n'),
  },
  {
    match: ['voca', 'interview'],
    reply: () => {
      const p = projects.find((x) => x.title === 'Voca AI');
      return p ? `${p.title} — ${p.desc}\nStack: ${list(p.tags ?? [])}` : 'No entry found.';
    },
  },
  {
    match: ['doctus', 'grid', 'persona', 'edtech'],
    reply: () => {
      const p = projects.find((x) => x.title === 'Doctus Grid');
      return p ? `${p.title} — ${p.desc}\nStack: ${list(p.tags ?? [])}\n${p.href}` : 'No entry found.';
    },
  },
  {
    match: ['experience', 'job', 'intern', 'company', 'role', 'drizzla', 'pramana'],
    reply: () =>
      experience
        .map((e) => `${e.period} — ${e.title}, ${e.company}\n   ${e.points[0]}`)
        .join('\n'),
  },
  {
    match: ['education', 'college', 'degree', 'study', 'btech', 'university'],
    reply: () =>
      `${education.degree}\n${education.school}, ${education.location} (${education.period})\nCoursework: ${list(education.coursework)}`,
  },
  {
    match: ['cert', 'course', 'training'],
    reply: () => certifications.map((c) => `${c.name} — ${c.issuer}`).join('\n'),
  },
  {
    match: ['resume', 'cv', 'download'],
    reply: () => `Resume: ${profile.resumeUrl} — or use the "View Resume" button in the hero.`,
  },
  {
    match: ['contact', 'email', 'reach', 'hire', 'call', 'available'],
    reply: () =>
      `Email: ${profile.email}\nLinkedIn: ${profile.linkedin}\nGitHub: ${profile.github}\nBook a call: ${profile.calendar}`,
  },
];

export const askAI = async (query: string): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const q = query.toLowerCase();
  const hit = answers.find((a) => a.match.some((keyword) => q.includes(keyword)));
  if (hit) return hit.reply();

  return "No match. Try: about, skills, projects, experience, education, certifications, resume, or contact.";
};
