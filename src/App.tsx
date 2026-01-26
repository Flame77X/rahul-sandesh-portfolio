import Layout from './components/ui/Layout';
import ResumeModal from './components/ui/ResumeModal';
import Terminal from './components/ui/Terminal';
import TechCloud from './components/canvas/TechCloud';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Github, Linkedin, Mail, ArrowRight, ExternalLink, Send } from 'lucide-react';

const Cursor = ({ isMobile }: { isMobile: boolean }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (isMobile) return;

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button') || target.closest('.hover-target')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    }

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    }
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white mix-blend-difference pointer-events-none z-[9999] hidden md:block"
      animate={{
        x: mousePosition.x - 16,
        y: mousePosition.y - 16,
        scale: isHovering ? 2.5 : 1,
        opacity: isHovering ? 0.5 : 1
      }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    />
  )
}

const scaleAnimation = {
  initial: { scale: 0.9, opacity: 0 },
  whileInView: { scale: 1, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  viewport: { once: true, margin: "-50px" }
};

const fadeUpAnimation = {
  initial: { y: 50, opacity: 0 },
  whileInView: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
  viewport: { once: true, margin: "-50px" }
};

function App() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.9]);

  // Typing Effect
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const words = ["Generative AI Specialist", "Machine Learning Researcher", "Entrepreneurial Engineer"];

  // Mobile Check
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % words.length;
      const fullText = words[i];

      setText(isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1));

      setTypingSpeed(isDeleting ? 30 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, words]);

  // Form State
  const [result, setResult] = useState("");

  // Resume Modal State
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const resumeUrl = "/resume.pdf";

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget; // Capture before await
    setResult("Initializing Uplink...");
    const formData = new FormData(form);

    formData.append("access_key", "62c4a56c-ff2a-4076-9613-f952d47bf17b");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setResult("Signal Transmitted Successfully. Stand by for response.");
        form.reset(); // Use captured reference
      } else {
        console.error("Error", data);
        setResult(data.message);
      }
    } catch (error: any) {
      console.error("Transmission Error:", error);
      setResult(`Transmission Failed: ${error.message || "Unknown Error"}`);
    }
  };

  return (
    <Layout>
      <Cursor isMobile={isMobile} />
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 origin-left z-[100]" style={{ scaleX }} />

      <div ref={containerRef} className="relative">

        {/* Navigation */}
        <header className="fixed top-0 w-full p-6 md:p-8 flex justify-between items-center z-50 pointer-events-none">
          <div className="text-xl md:text-2xl font-bold tracking-tight font-display text-white mix-blend-difference pointer-events-auto">RAHUL.S</div>

          <nav className="hidden md:flex gap-1 text-sm font-medium tracking-wide backdrop-blur-xl bg-white/5 px-2 py-2 rounded-full border border-white/5 pointer-events-auto">
            {['Home', 'About', 'Experience', 'Work', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase() === 'home' ? 'hero' : item.toLowerCase()}`}
                className="px-5 py-2 rounded-full hover:bg-white/10 transition-all duration-300 text-gray-300 hover:text-white"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex gap-4 mix-blend-difference text-white pointer-events-auto">
            <a href="https://github.com/Flame77X" target="_blank" className="hover:scale-110 transition-transform"><Github size={20} /></a>
            <a href="https://www.linkedin.com/in/rahul-sandesh-8a1786246/" target="_blank" className="hover:scale-110 transition-transform"><Linkedin size={20} /></a>
            <a href="mailto:rahulsandeshx3000@gmail.com" className="hover:scale-110 transition-transform"><Mail size={20} /></a>
          </div>
        </header>

        {/* Hero Section */}
        <motion.section
          id="hero"
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="h-screen w-full flex flex-col justify-center items-center text-center px-4 sticky top-0"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-blue-400 text-xs font-bold uppercase tracking-[0.2em] shadow-lg shadow-blue-500/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Available for Generative AI & ML Roles
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "circOut" }}
            className="text-6xl md:text-[140px] leading-[0.9] font-bold font-display tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500 drop-shadow-2xl"
          >
            ARCHITECTING <br /> INTELLIGENCE
          </motion.h1>

          <div className="h-8 mt-8">
            <span className="text-lg md:text-2xl text-blue-400 font-mono tracking-wide">
              {text}
              <span className="animate-pulse">|</span>
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-12 flex flex-col md:flex-row gap-6 items-center z-20"
          >
            <a href="#work" className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg flex items-center gap-2 hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_-5px_rgba(59,130,246,0.5)]">
              Enter Inference Lab
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <button
              onClick={() => setIsResumeOpen(true)}
              className="flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-white/60 hover:text-white transition-colors"
            >
              View Resume <ExternalLink size={14} />
            </button>
          </motion.div>
        </motion.section>

        <div className="relative z-10 bg-[#050505]/95 backdrop-blur-3xl border-t border-white/10 mt-[100vh] shadow-[0_-20px_60px_rgba(0,0,0,0.8)]">

          {/* Philosophy Section */}
          <section id="about" className="py-32 px-6">
            <div className="max-w-7xl mx-auto">
              <motion.div {...fadeUpAnimation} className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
                <div>
                  <div className="mb-6 text-blue-500 text-xs font-black uppercase tracking-[0.3em]">System Philosophy</div>
                  <h2 className="text-4xl md:text-7xl font-display font-medium leading-[1.1] text-white">
                    Redefining <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">interaction</span> through neural design.
                  </h2>
                </div>
                <p className="text-xl text-gray-400 leading-relaxed font-light">
                  "I believe AI systems should be <span className="text-white font-medium">observable</span>, <span className="text-white font-medium">modular</span>, and designed for high-impact human augmentation."
                </p>
              </motion.div>

              {/* Tech Cloud Visualization */}
              <div className="w-full flex justify-center mb-24 cursor-grab active:cursor-grabbing">
                <TechCloud />
              </div>

              <Terminal />
            </div>
          </section>

          {/* Experience (Ordered First) */}
          <section id="experience" className="py-32 px-6 border-t border-white/5">
            <div className="max-w-4xl mx-auto">
              <motion.h2 {...fadeUpAnimation} className="text-4xl md:text-6xl font-display font-bold mb-20 text-center">Experience Tenure</motion.h2>
              <div className="space-y-12 relative before:absolute before:left-0 md:before:left-1/2 before:top-0 before:h-full before:w-px before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                {[
                  { year: "Now", title: "Product Dev Intern", company: "Drizzla Digital Solutions", desc: "Leading R&D for scalable systems and internal tooling." },
                  { year: "2025", title: "AI Engineering Intern", company: "Pramana AyurTech", desc: "Built RAG systems improving retrieval by 35%." },
                  { year: "2021", title: "Founder & Lead", company: "Printing Enterprise", desc: "Scaling enterprise node serving 300+ clients." },
                  { year: "Leadership", title: "Treasurer", company: "AI Council Providence", desc: "Managed financial allocation for 200+ neural researchers." },
                  { year: "Leadership", title: "Event Lead", company: "Campus Esports", desc: "Orchestrated competitive events and operations." },
                ].map((exp, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className={`relative flex flex-col md:flex-row ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''} items-center justify-between`}
                  >
                    <div className="hidden md:block w-[calc(50%-3rem)]" />
                    <div className="absolute left-0 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-black border-2 border-white z-10 shadow-[0_0_10px_white]" />
                    <div className="w-full md:w-[calc(50%-3rem)] pl-8 md:pl-0">
                      <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/30 transition-colors backdrop-blur-sm">
                        <div className="text-blue-400 font-mono text-sm mb-2 font-bold uppercase tracking-widest">{exp.year}</div>
                        <h3 className="text-2xl font-display font-bold mb-1">{exp.title}</h3>
                        <div className="text-gray-400 mb-4 font-medium">{exp.company}</div>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{exp.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Projects Section - Manual Card Layout (Reverted) */}
          <section id="work" className="py-32 px-6 border-t border-white/5">
            <div className="max-w-7xl mx-auto">
              <motion.div {...fadeUpAnimation} className="flex flex-col md:flex-row justify-between items-end mb-24">
                <div>
                  <h2 className="text-6xl md:text-9xl font-display font-bold tracking-tighter opacity-10 absolute -translate-y-1/2 select-none text-white">LAB</h2>
                  <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tighter relative z-10 text-white">INFERENCE <br /> LAB</h2>
                </div>
                <div className="relative z-10 flex gap-4 mt-8 md:mt-0">
                  {['AI', 'Robotics', 'Web'].map(tag => (
                    <span key={tag} className="px-4 py-2 rounded-full border border-white/20 text-xs font-bold uppercase tracking-widest text-white/60 hover:bg-white hover:text-black transition-colors cursor-pointer">{tag}</span>
                  ))}
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Project 1 - Flagship AI Interviewer */}
                <motion.div {...scaleAnimation} className="col-span-1 lg:col-span-2 group relative min-h-[600px] bg-neutral-900 rounded-[2.5rem] overflow-hidden border border-white/10 hover:border-blue-500/30 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-black z-0 pointer-events-none" />
                  <div className="absolute top-10 right-10 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="text-white" />
                  </div>

                  <div className="absolute bottom-0 left-0 p-12 z-20 w-full bg-gradient-to-t from-black via-black/80 to-transparent">
                    <div className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">Flagship Case Study</div>
                    <h3 className="text-4xl md:text-5xl font-display font-bold mb-6">Voca AI</h3>
                    <p className="text-gray-300 text-lg max-w-xl leading-relaxed mb-8">
                      Agentic, real-time interview system combining LLM reasoning, emotion analysis, and sub-100ms inference pipelines.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {['Python', 'Llama 3', 'FastAPI', 'Groq LPU'].map(tag => (
                        <span key={tag} className="px-3 py-1 rounded-md bg-white/10 text-xs font-bold text-white/80">{tag}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Project 2 - BloodSync */}
                <motion.div {...scaleAnimation} transition={{ delay: 0.1 }} className="group relative min-h-[600px] bg-neutral-900 rounded-[2.5rem] overflow-hidden border border-white/10 hover:border-rose-500/30 transition-all duration-500">
                  <div className="absolute bottom-0 left-0 p-10 z-20 bg-gradient-to-t from-black via-black/80 to-transparent w-full">
                    <div className="text-rose-500 text-xs font-bold uppercase tracking-widest mb-3">NLU Engine</div>
                    <h3 className="text-3xl font-display font-bold mb-4">BloodSync AI Bot</h3>
                    <p className="text-gray-400 leading-relaxed mb-6">Real-time matching system utilizing Telegram Cloud API and Cloud Firestore.</p>
                  </div>
                </motion.div>

                {/* Project 3 - Doctus Grid */}
                <motion.div {...scaleAnimation} transition={{ delay: 0.2 }} className="col-span-1 lg:col-span-3 min-h-[500px] bg-neutral-900 rounded-[2.5rem] overflow-hidden border border-white/10 hover:border-emerald-500/30 p-12 flex flex-col md:flex-row gap-12 items-center">
                  <div className="md:w-1/2 relative z-10">
                    <div className="text-emerald-500 text-xs font-bold uppercase tracking-widest mb-4">EdTech Platform</div>
                    <h3 className="text-4xl md:text-5xl font-display font-bold mb-6">Doctus Grid</h3>
                    <p className="text-gray-400 text-lg leading-relaxed mb-8">
                      A multimodal educational station featuring a multi-persona engine. The system adapts its teaching style dynamically based on student interaction, supporting image generation and persistent memory sessions.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {['React', 'Node.js', 'PostgreSQL', 'Pollinations AI'].map(tag => (
                        <span key={tag} className="px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-bold">{tag}</span>
                      ))}
                    </div>
                    <a
                      href="https://doctus-grid.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-sm transition-colors"
                    >
                      View Live <ExternalLink size={16} />
                    </a>
                  </div>
                  <div className="md:w-1/2 h-full min-h-[300px] bg-emerald-900/10 rounded-3xl border border-white/5 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                    <span className="text-emerald-500/30 font-display text-4xl font-bold">UI INTERFACE</span>
                  </div>
                </motion.div>

                {/* 4. ChromoShift AI */}
                <motion.div {...scaleAnimation} className="bg-neutral-900 rounded-[2.5rem] p-10 border border-white/10 hover:border-yellow-500/30 transition-colors">
                  <div className="text-yellow-500 text-xs font-bold uppercase tracking-widest mb-4">Vision Lab</div>
                  <h3 className="text-2xl font-display font-bold mb-4">ChromoShift AI</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">Deep learning system designed to automatically colorize grayscale image datasets using pattern recognition.</p>
                </motion.div>

                {/* 5. ROS Mobile Bot */}
                <motion.div {...scaleAnimation} className="bg-neutral-900 rounded-[2.5rem] p-10 border border-white/10 hover:border-gray-500/30 transition-colors">
                  <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">Robotics</div>
                  <h3 className="text-2xl font-display font-bold mb-4">ROS Mobile Bot</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">Navigation platform with Python and ROS multi-sensor fusion for spatial environment classification.</p>
                </motion.div>

                {/* 6. Live Scoreboard */}
                <motion.div {...scaleAnimation} className="bg-neutral-900 rounded-[2.5rem] p-10 border border-white/10 hover:border-cyan-500/30 transition-colors">
                  <div className="text-cyan-500 text-xs font-bold uppercase tracking-widest mb-4">Real-time Web</div>
                  <h3 className="text-2xl font-display font-bold mb-4">Live Scoreboard</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">React platform delivering match scores to 200+ students via Firebase real-time subscription models.</p>
                </motion.div>

                {/* 7. UAV Drone */}
                <motion.div {...scaleAnimation} className="bg-neutral-900 rounded-[2.5rem] p-10 border border-white/10 hover:border-purple-500/30 transition-colors">
                  <div className="text-purple-500 text-xs font-bold uppercase tracking-widest mb-4">Aerial Systems</div>
                  <h3 className="text-2xl font-display font-bold mb-4">UAV Drone</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">Semi-autonomous flight prototype programmed with custom firmware for stable aerial navigation.</p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section id="contact" className="py-32 px-6 border-t border-white/5">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="p-8 md:p-16 rounded-[3rem] bg-gradient-to-b from-blue-900/10 to-transparent border border-white/10 backdrop-blur-sm relative overflow-hidden"
              >
                <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter mb-8 text-white relative z-10">Initialize Protocol.</h2>

                {/* Web3Forms Endpoint. Requires Access Key. */}
                {/* Web3Forms React Logic */}
                <form onSubmit={onSubmit} className="space-y-4 relative z-10 mb-12">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="name" placeholder="Name" required className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-white focus:border-blue-500 focus:outline-none transition-colors" />
                    <input type="email" name="email" placeholder="Email" required className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-white focus:border-blue-500 focus:outline-none transition-colors" />
                  </div>
                  <textarea name="message" rows={4} placeholder="Message..." required className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-white focus:border-blue-500 focus:outline-none transition-colors resize-none" />

                  <button type="submit" className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2">
                    Transmit Signal <Send size={18} />
                  </button>

                  {result && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-white font-mono text-sm mt-4 p-4 bg-white/10 rounded-lg border border-white/10"
                    >
                      {result}
                    </motion.div>
                  )}
                </form>

                <div className="relative z-10 pt-12 border-t border-white/10">
                  <h3 className="text-blue-400 text-xs font-bold uppercase tracking-[0.2em] mb-6">Or Sync Directly</h3>
                  <a
                    href="https://cal.com/rahul-sandesh-tt7vft/30min"
                    target="_blank"
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-105 transition-all text-white font-bold"
                  >
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    Book a 30min Sync
                    <ExternalLink size={16} />
                  </a>
                </div>
              </motion.div>
            </div>
          </section>

          <footer className="py-12 border-t border-white/10 text-center text-white/30 text-xs font-bold tracking-[0.2em] uppercase">
            © 2026 Rahul Sandesh • Optimized Neural Portfolio
          </footer>

        </div>
      </div>
      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} resumeUrl={resumeUrl} />
    </Layout>
  );
}

export default App;
