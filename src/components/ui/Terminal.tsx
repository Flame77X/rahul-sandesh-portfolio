import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { askAI } from '../../services/ai';

const Terminal = () => {
    const [history, setHistory] = useState<string[]>(["Welcome to Neural Node v2.1. Type 'help' or ask anything about me."]);
    const [input, setInput] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const commands: Record<string, string> = {
        help: "Available commands: about, skills, projects, contact, clear. Or ask me a question!",
        about: "Rahul Sandesh: AI Architect specialized in LLM workflows, RAG, and Robotics.",
        skills: "Core: Python, Llama 3.3, RAG, FastAPI, React, ROS, DeepFace, TensorFlow.",
        projects: "Loaded Modules: AI Interviewer, BloodSync, Doctus Grid, Nexus Assistant, ChromoShift, ROS Bot.",
        contact: "Signal Frequency: rahulsandeshx3000@gmail.com",
    };

    const handleCommand = async (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            const cmd = input.trim();
            if (!cmd) return;

            const lowerCmd = cmd.toLowerCase();

            // Add user input to history immediately
            setHistory(prev => [...prev, `> ${cmd}`]);
            setInput("");

            if (lowerCmd === 'clear') {
                setHistory([]);
                return;
            }

            if (commands[lowerCmd]) {
                setHistory(prev => [...prev, commands[lowerCmd]]);
            } else {
                // Determine if it's a question for AI
                setIsThinking(true);
                try {
                    const response = await askAI(cmd);
                    setHistory(prev => [...prev, response]);
                } catch (err) {
                    setHistory(prev => [...prev, "Neural network offline. Try again later."]);
                } finally {
                    setIsThinking(false);
                }
            }
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history, isThinking]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden bg-[#0a0a0a] border border-white/10 shadow-2xl font-mono text-sm md:text-base my-24"
        >
            <div className="bg-[#1a1a1a] px-4 py-2 flex items-center justify-between border-b border-white/5">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">rahul_ai_core_v2.1.sh</div>
                <button
                    onClick={() => setHistory([])}
                    className="text-white/40 hover:text-white hover:bg-white/10 px-3 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider transition-colors"
                >
                    Clear
                </button>
            </div>
            <div
                ref={scrollRef}
                className="p-6 h-80 overflow-y-auto space-y-2 text-gray-300 scrollbar-hide"
            >
                {history.map((line, i) => (
                    <div key={i} className={`${line.startsWith('>') ? 'text-blue-400 font-bold' : 'text-gray-400'} whitespace-pre-wrap`}>
                        {line}
                    </div>
                ))}

                {isThinking && (
                    <div className="text-blue-500 animate-pulse">Processing neural query...</div>
                )}

                <div className="flex items-center gap-2 text-blue-500 font-bold">
                    <span>$</span>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleCommand}
                        className="bg-transparent border-none outline-none text-white w-full caret-blue-500"
                        placeholder="Type 'help' or ask a question..."
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default Terminal;
