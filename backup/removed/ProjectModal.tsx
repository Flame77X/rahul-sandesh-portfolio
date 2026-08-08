import { motion, AnimatePresence } from 'framer-motion';
import type { ProjectDetail } from '../../data/projects';
import { X, ExternalLink, Github, Layers, Zap, Cpu, Code } from 'lucide-react';

interface ProjectModalProps {
    project: ProjectDetail | null;
    isOpen: boolean;
    onClose: () => void;
}

// Color Mapping to ensure Tailwind generates these classes
const COLORS: Record<string, { bg: string, text: string, border: string, from: string }> = {
    blue: { bg: "bg-blue-500", text: "text-blue-500", border: "border-blue-500", from: "from-blue-900/20" },
    rose: { bg: "bg-rose-500", text: "text-rose-500", border: "border-rose-500", from: "from-rose-900/20" },
    emerald: { bg: "bg-emerald-500", text: "text-emerald-500", border: "border-emerald-500", from: "from-emerald-900/20" },
    yellow: { bg: "bg-yellow-500", text: "text-yellow-500", border: "border-yellow-500", from: "from-yellow-900/20" },
    gray: { bg: "bg-gray-500", text: "text-gray-500", border: "border-gray-500", from: "from-gray-900/20" },
    cyan: { bg: "bg-cyan-500", text: "text-cyan-500", border: "border-cyan-500", from: "from-cyan-900/20" },
    purple: { bg: "bg-purple-500", text: "text-purple-500", border: "border-purple-500", from: "from-purple-900/20" },
};

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
    if (!project) return null;
    const theme = COLORS[project.color] || COLORS.blue;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1000] cursor-pointer"
                    />

                    {/* Modal Container */}
                    <motion.div
                        layoutId={`project-${project.id}`}
                        className="fixed inset-4 md:inset-10 z-[1001] bg-[#0a0a0a] border border-white/10 rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-2xl overflow-y-auto md:overflow-hidden"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 z-50 p-2 rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/80 transition-all border border-white/10"
                        >
                            <X size={24} />
                        </button>

                        {/* Left: Visuals & Header */}
                        <div className={`md:w-1/3 bg-gradient-to-br ${theme.from} to-black p-8 md:p-12 relative flex flex-col justify-end`}>
                            <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="relative z-10"
                            >
                                <div className={`${theme.text} font-bold uppercase tracking-[0.2em] mb-4 text-xs md:text-sm`}>
                                    {project.category} • {project.status}
                                </div>
                                <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
                                    {project.title}
                                </h2>
                                <p className="text-lg text-white/80 font-medium leading-relaxed">
                                    {project.tagline}
                                </p>
                            </motion.div>
                        </div>

                        {/* Right: Details & Content */}
                        <div className="md:w-2/3 p-8 md:p-12 overflow-y-auto bg-[#0a0a0a]">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="max-w-3xl mx-auto space-y-12"
                            >
                                {/* Challenge & Solution */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <div className="flex items-center gap-3 mb-4 text-white/90 font-bold text-lg">
                                            <Zap size={20} className={theme.text} />
                                            The Challenge
                                        </div>
                                        <p className="text-gray-400 leading-relaxed font-light">
                                            {project.challenge}
                                        </p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-4 text-white/90 font-bold text-lg">
                                            <Cpu size={20} className={theme.text} />
                                            The Solution
                                        </div>
                                        <p className="text-gray-400 leading-relaxed font-light">
                                            {project.solution}
                                        </p>
                                    </div>
                                </div>

                                {/* Tech Stack */}
                                <div>
                                    <div className="flex items-center gap-3 mb-6 text-white/90 font-bold text-lg">
                                        <Code size={20} className={theme.text} />
                                        Core Technologies
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {project.tech.map((t, i) => (
                                            <span
                                                key={i}
                                                className={`px-4 py-2 rounded-lg ${theme.bg}/10 border ${theme.border}/20 ${theme.text} text-sm font-medium`}
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Key Features */}
                                <div>
                                    <div className="flex items-center gap-3 mb-6 text-white/90 font-bold text-lg">
                                        <Layers size={20} className={theme.text} />
                                        Key Architecture Features
                                    </div>
                                    <ul className="grid md:grid-cols-2 gap-4">
                                        {project.features.map((f, i) => (
                                            <li key={i} className="flex items-start gap-3 text-gray-400">
                                                <div className={`mt-1.5 w-1.5 h-1.5 rounded-full ${theme.bg}`} />
                                                <span className="leading-relaxed">{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Links */}
                                {project.links && (
                                    <div className="flex gap-4 pt-6 border-t border-white/10">
                                        {project.links.github && (
                                            <a href={project.links.github} target="_blank" className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-bold hover:bg-white/90 transition-colors">
                                                <Github size={18} /> View Code
                                            </a>
                                        )}
                                        {project.links.live && (
                                            <a href={project.links.live} target="_blank" className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white font-bold hover:bg-white/20 transition-colors border border-white/10">
                                                <ExternalLink size={18} /> Launch Demo
                                            </a>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ProjectModal;
