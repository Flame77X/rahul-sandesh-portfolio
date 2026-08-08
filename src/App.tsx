import { useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

import Layout from './components/ui/Layout';
import ResumeModal from './components/ui/ResumeModal';
import Footer from './components/ui/Footer';

import Nav from './components/sections/Nav';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Experience from './components/sections/Experience';
import Work from './components/sections/Work';
import Contact from './components/sections/Contact';

import { profile } from './data/site';

function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  return (
    <Layout>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 right-0 top-0 z-[100] h-px origin-left bg-accent"
        style={{ scaleX }}
      />

      <Nav />

      <main>
        <Hero onOpenResume={() => setIsResumeOpen(true)} />
        <About />
        <Experience />
        <Work />
        <Contact />
      </main>

      <Footer />

      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        resumeUrl={profile.resumeUrl}
      />
    </Layout>
  );
}

export default App;
