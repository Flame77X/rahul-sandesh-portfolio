import { Canvas, useFrame } from '@react-three/fiber';
import { useProgress } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

const SpinningPolyhedron = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.x += dt * 0.6;
    ref.current.rotation.y += dt * 0.4;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#3b82f6"
        emissive="#3b82f6"
        emissiveIntensity={0.6}
        metalness={0.7}
        roughness={0.25}
        flatShading
      />
    </mesh>
  );
};

const Loader = () => {
  const { progress, active } = useProgress();
  const [hidden, setHidden] = useState(false);
  const [minTimeMet, setMinTimeMet] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMinTimeMet(true), 1100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!active && minTimeMet) {
      const t = setTimeout(() => setHidden(true), 500);
      return () => clearTimeout(t);
    }
  }, [active, minTimeMet]);

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-ink-0"
        >
          <div className="w-44 h-44 md:w-56 md:h-56">
            <Canvas
              gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
              dpr={[1, 1.5]}
              camera={{ position: [0, 0, 3.5], fov: 40 }}
            >
              <ambientLight intensity={0.4} />
              <pointLight position={[3, 3, 3]} intensity={2} color="#60a5fa" />
              <pointLight position={[-3, -2, 2]} intensity={1.2} color="#1e40af" />
              <SpinningPolyhedron />
            </Canvas>
          </div>

          <div className="mt-10 text-accent text-xs font-mono tracking-[0.3em] uppercase">
            Booting Neural Node
          </div>

          <div className="mt-6 w-56 md:w-72 h-px bg-ink-3 overflow-hidden relative">
            <motion.div
              className="absolute inset-y-0 left-0 bg-accent"
              animate={{ width: `${Math.max(8, Math.min(100, progress))}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>

          <div className="mt-3 text-ink-6 text-[10px] font-mono tracking-widest">
            {Math.floor(progress)}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
