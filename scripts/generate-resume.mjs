/**
 * Renders the resume to public/resume.pdf.
 *
 *   npm run resume
 *
 * data/site.ts is the single source of truth: this loads `?print=resume` — the
 * same ResumeDocument the on-site popup renders — and prints it. The
 * downloadable PDF therefore cannot drift from the site.
 */

import { resolve } from 'node:path';
import { stat } from 'node:fs/promises';
import { projectRoot, withPage } from './render.mjs';

const OUT = resolve(projectRoot, 'public/resume.pdf');

await withPage({ query: '?print=resume', selector: '.resume-doc' }, async (page) => {
  await page.pdf({
    path: OUT,
    format: 'A4',
    printBackground: true,
    margin: { top: '12mm', bottom: '12mm', left: '14mm', right: '14mm' },
  });
});

const { size } = await stat(OUT);
console.log(`Wrote public/resume.pdf (${(size / 1024).toFixed(1)} KB) from src/data/site.ts`);
