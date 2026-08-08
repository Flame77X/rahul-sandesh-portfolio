import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { askAI } from '../../services/ai';
import { profile } from '../../data/site';

const TOPICS = [
  'about',
  'skills',
  'projects',
  'experience',
  'education',
  'certifications',
  'resume',
  'contact',
];

const WELCOME = [
  `${profile.name} — interactive console.`,
  `Type a topic to look it up: ${TOPICS.join(', ')}. Type 'help' for this list, 'clear' to reset.`,
];

const Terminal = () => {
  const [history, setHistory] = useState<string[]>(WELCOME);
  const [input, setInput] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleCommand = async (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') return;

    const cmd = input.trim();
    if (!cmd) return;

    setHistory((prev) => [...prev, `> ${cmd}`]);
    setInput('');

    const lower = cmd.toLowerCase();

    if (lower === 'clear') {
      setHistory([]);
      return;
    }

    if (lower === 'help') {
      setHistory((prev) => [...prev, `Topics: ${TOPICS.join(', ')}. 'clear' resets the console.`]);
      return;
    }

    setIsBusy(true);
    try {
      const reply = await askAI(cmd);
      setHistory((prev) => [...prev, reply]);
    } catch {
      setHistory((prev) => [...prev, 'Lookup failed. Try again.']);
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isBusy]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className="mt-24 overflow-hidden rounded border border-line bg-surface-1"
    >
      <div className="flex items-center justify-between border-b border-line-soft bg-surface-2 px-4 py-2.5">
        <div className="label-mono">Console</div>
        <button
          onClick={() => setHistory(WELCOME)}
          className="label-mono transition-colors hover:text-accent"
        >
          Reset
        </button>
      </div>

      <div
        ref={scrollRef}
        className="h-72 space-y-2 overflow-y-auto p-6 font-mono text-[13px] leading-6"
        data-lenis-prevent
      >
        {history.map((line, i) => (
          <div
            key={i}
            className={`whitespace-pre-wrap ${line.startsWith('>') ? 'text-accent' : 'text-ink-2'}`}
          >
            {line}
          </div>
        ))}

        {isBusy && <div className="text-accent">Looking up…</div>}

        <div className="flex items-center gap-2 text-accent">
          <span aria-hidden="true">$</span>
          <label htmlFor="console-input" className="sr-only">
            Console input
          </label>
          <input
            id="console-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            className="w-full border-none bg-transparent text-ink caret-accent outline-none"
            placeholder="Type 'help' or a topic…"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Terminal;
