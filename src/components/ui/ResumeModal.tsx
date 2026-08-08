import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ExternalLink } from 'lucide-react';
import ResumeDocument from './ResumeDocument';

/**
 * Popup wrapper around ResumeDocument.
 *
 * The body used to be an <iframe> pointed at the PDF, which stacked the
 * browser's own viewer toolbar and thumbnail rail on top of this header — two
 * sets of chrome around the content, and only page one on mobile Safari.
 * Rendering the document natively also means the popup and the downloadable
 * PDF come from the same component (see scripts/generate-resume.mjs).
 */

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeUrl: string;
}

const ResumeModal = ({ isOpen, onClose, resumeUrl }: ResumeModalProps) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Resume"
          className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm md:p-8"
        >
          <motion.div
            initial={{ scale: 0.98, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0, y: 12 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            className="flex h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded border border-line bg-surface-1"
          >
            <header className="flex items-center justify-between gap-4 border-b border-line-soft bg-surface-2 px-5 py-3">
              <div className="label-mono">Resume</div>
              <div className="flex items-center gap-1">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-9 w-9 place-items-center rounded text-ink-2 transition-colors hover:bg-surface-3 hover:text-ink"
                  title="Open the PDF in a new tab"
                  aria-label="Open the PDF in a new tab"
                >
                  <ExternalLink size={17} />
                </a>
                <a
                  href={resumeUrl}
                  download
                  className="grid h-9 w-9 place-items-center rounded text-ink-2 transition-colors hover:bg-surface-3 hover:text-ink"
                  title="Download PDF"
                  aria-label="Download the PDF"
                >
                  <Download size={17} />
                </a>
                <button
                  onClick={onClose}
                  className="grid h-9 w-9 place-items-center rounded text-ink-2 transition-colors hover:bg-surface-3 hover:text-ink"
                  aria-label="Close resume"
                >
                  <X size={17} />
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10 md:py-10" data-lenis-prevent>
              <ResumeDocument />

              <div className="mx-auto mt-8 max-w-2xl border-t border-line-soft pt-6">
                <a
                  href={resumeUrl}
                  download
                  className="inline-flex items-center gap-2 rounded-lg bg-solid px-6 py-3 text-sm font-bold text-on-solid transition-opacity hover:opacity-85"
                >
                  <Download size={15} /> Download PDF
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResumeModal;
