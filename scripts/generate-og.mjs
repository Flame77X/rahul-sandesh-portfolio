/**
 * Renders the social preview card to public/og-image.png.
 *
 *   npm run og
 *
 * Regenerate whenever the name, role, or domain in site.ts changes — the card
 * is what LinkedIn, WhatsApp, Slack and Twitter show when the link is shared.
 *
 * Note: those platforms cache previews aggressively. After deploying a new
 * card, force a re-scrape (LinkedIn Post Inspector, Facebook Sharing Debugger)
 * or already-shared links keep showing the old one.
 */

import { resolve } from 'node:path';
import { stat } from 'node:fs/promises';
import { projectRoot, withPage } from './render.mjs';

const OUT = resolve(projectRoot, 'public/og-image.png');

await withPage(
  {
    query: '?print=og',
    selector: '.og-card',
    // Match the capture size exactly so nothing is scaled or clipped.
    viewport: { width: 1200, height: 630 },
  },
  async (page) => {
    const card = page.locator('.og-card');
    await card.screenshot({ path: OUT });
  }
);

const { size } = await stat(OUT);
console.log(`Wrote public/og-image.png (${(size / 1024).toFixed(1)} KB) from src/data/site.ts`);
