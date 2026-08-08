/**
 * Shared browser plumbing for the asset generators.
 *
 * Boots the Vite dev server, opens a page in the Chrome or Edge already
 * installed on the machine (playwright-core ships no browser of its own), runs
 * the caller's function, and tears everything down.
 */

import { createServer } from 'vite';
import { chromium } from 'playwright-core';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

export const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const CHANNELS = ['chrome', 'msedge'];

async function launch() {
  const failures = [];
  for (const channel of CHANNELS) {
    try {
      return await chromium.launch({ channel });
    } catch (error) {
      failures.push(`${channel}: ${error.message.split('\n')[0]}`);
    }
  }
  try {
    return await chromium.launch();
  } catch (error) {
    failures.push(`bundled: ${error.message.split('\n')[0]}`);
  }
  throw new Error(
    `Could not launch a browser. Install Google Chrome or Microsoft Edge.\n  ${failures.join('\n  ')}`
  );
}

/**
 * @param {{ query: string, selector: string, viewport?: {width:number,height:number} }} options
 * @param {(page: import('playwright-core').Page) => Promise<void>} fn
 */
export async function withPage({ query, selector, viewport }, fn) {
  const server = await createServer({
    root: projectRoot,
    logLevel: 'error',
    server: { port: 5199, strictPort: false },
  });
  await server.listen();

  const base = server.resolvedUrls?.local?.[0] ?? `http://localhost:${server.config.server.port}/`;
  const target = new URL(query, base).href;

  let browser;
  try {
    browser = await launch();
    const page = await browser.newPage(viewport ? { viewport } : {});

    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));

    await page.goto(target, { waitUntil: 'networkidle' });
    await page.waitForSelector(selector, { timeout: 15000 });
    // Webfonts must resolve before capture or the output falls back to serif.
    await page.evaluate(() => document.fonts.ready);

    if (errors.length) {
      throw new Error(`Page errors while rendering ${query}:\n  ${errors.join('\n  ')}`);
    }

    await fn(page);
  } finally {
    await browser?.close();
    await server.close();
  }
}
