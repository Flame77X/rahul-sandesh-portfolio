import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import ResumeDocument from './components/ui/ResumeDocument.tsx'
import OgCard from './components/ui/OgCard.tsx'

/**
 * Two capture-only views, each rendered on its own with no page chrome:
 *   ?print=resume  -> scripts/generate-resume.mjs prints public/resume.pdf
 *   ?print=og      -> scripts/generate-og.mjs shoots public/og-image.png
 * Both read from data/site.ts, so the generated artifacts cannot drift.
 */
const printMode = new URLSearchParams(window.location.search).get('print');

if (printMode) {
  // Generated artifacts are always on paper white, whatever theme was last chosen.
  document.documentElement.dataset.theme = 'light';
  document.documentElement.classList.add('print-view');
}

const view =
  printMode === 'resume' ? (
    <div className="print-page">
      <ResumeDocument />
    </div>
  ) : printMode === 'og' ? (
    <OgCard />
  ) : (
    <App />
  );

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>{view}</ErrorBoundary>
  </StrictMode>,
)
