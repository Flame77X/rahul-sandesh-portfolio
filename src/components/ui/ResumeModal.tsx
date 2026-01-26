import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ChevronLeft, ChevronRight, Loader2, ZoomIn, ZoomOut } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF Worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface ResumeModalProps {
    isOpen: boolean;
    onClose: () => void;
    resumeUrl: string;
}

const ResumeModal = ({ isOpen, onClose, resumeUrl }: ResumeModalProps) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(true);
    const [scale, setScale] = useState(0.8);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setLoading(false);
    }

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-6xl h-[90vh] bg-[#1a1a1a] border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl relative"
                >
                    {/* Header Controls */}
                    <div className="absolute top-4 right-4 z-50 flex gap-2">
                        <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md rounded-full px-2 border border-white/10 mr-2">
                            <button
                                onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
                                className="p-2 text-white/70 hover:text-white transition-colors"
                            >
                                <ZoomOut size={16} />
                            </button>
                            <span className="text-xs font-mono text-white/50 w-8 text-center">{Math.round(scale * 100)}%</span>
                            <button
                                onClick={() => setScale(s => Math.min(2.0, s + 0.1))}
                                className="p-2 text-white/70 hover:text-white transition-colors"
                            >
                                <ZoomIn size={16} />
                            </button>
                        </div>

                        <a
                            href={resumeUrl}
                            download
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-full bg-black/50 hover:bg-white/20 text-white transition-colors backdrop-blur-md border border-white/10"
                            title="Download PDF"
                        >
                            <Download size={20} />
                        </a>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-black/50 hover:bg-red-500/20 hover:text-red-400 text-white transition-colors backdrop-blur-md border border-white/10"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* PDF Container */}
                    <div className="flex-1 overflow-auto p-4 md:p-8 flex items-center justify-center bg-[#0a0a0a]">
                        {loading && (
                            <div className="absolute inset-0 flex items-center justify-center text-blue-400">
                                <Loader2 size={32} className="animate-spin" />
                            </div>
                        )}

                        <Document
                            file={resumeUrl}
                            onLoadSuccess={onDocumentLoadSuccess}
                            loading={<div className="text-white/50 text-sm">Initializing Neural Docs...</div>}
                            error={<div className="text-red-400 text-sm max-w-xs text-center">Failed to load document. Please check the file path.</div>}
                            className="shadow-2xl"
                        >
                            <Page
                                pageNumber={pageNumber}
                                scale={scale}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                className="rounded-lg overflow-hidden border border-white/10 shadow-lg"
                            />
                        </Document>
                    </div>

                    {/* Pagination Controls */}
                    {numPages > 1 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 z-50">
                            <button
                                disabled={pageNumber <= 1}
                                onClick={() => setPageNumber(prev => prev - 1)}
                                className="text-white hover:text-blue-400 disabled:opacity-30 transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className="text-white font-mono text-sm">{pageNumber} / {numPages}</span>
                            <button
                                disabled={pageNumber >= numPages}
                                onClick={() => setPageNumber(prev => prev + 1)}
                                className="text-white hover:text-blue-400 disabled:opacity-30 transition-colors"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}

                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ResumeModal;
