import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import * as THREE from 'three';

export type Motif = 'knot' | 'nodes' | 'grid' | 'shader' | 'wireframe' | 'rings' | 'float';

// ---------------------------------------------------------------------------
// Motif components
// ---------------------------------------------------------------------------
const Knot = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.x += dt * 0.4;
    ref.current.rotation.y += dt * 0.25;
  });
  return (
    <mesh ref={ref}>
      <torusKnotGeometry args={[0.7, 0.22, 96, 14]} />
      <meshStandardMaterial color="#3b82f6" emissive="#1e3a8a" emissiveIntensity={0.6} metalness={0.85} roughness={0.25} />
    </mesh>
  );
};

const Nodes = () => {
  const groupRef = useRef<THREE.Group>(null);
  const positions = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      arr.push([Math.cos(a) * 0.9, Math.sin(a * 1.6) * 0.5, Math.sin(a) * 0.9]);
    }
    return arr;
  }, []);
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.4;
    groupRef.current.children.forEach((c, i) => {
      const s = 1 + Math.sin(state.clock.elapsedTime * 2 + i * 0.5) * 0.25;
      c.scale.setScalar(s);
    });
  });
  return (
    <group ref={groupRef}>
      {positions.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={1.2} toneMapped={false} />
        </mesh>
      ))}
      {/* Connecting lines via thin tori */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.9, 0.005, 8, 64]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.8} toneMapped={false} />
      </mesh>
    </group>
  );
};

const Grid = () => {
  const ref = useRef<THREE.Group>(null);
  const cubes = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let x = 0; x < 3; x++)
      for (let y = 0; y < 3; y++)
        for (let z = 0; z < 3; z++)
          arr.push([(x - 1) * 0.5, (y - 1) * 0.5, (z - 1) * 0.5]);
    return arr;
  }, []);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.18;
    ref.current.rotation.y = state.clock.elapsedTime * 0.3;
    ref.current.children.forEach((c, i) => {
      const s = 0.85 + Math.sin(state.clock.elapsedTime * 1.5 + i * 0.4) * 0.15;
      c.scale.setScalar(s);
    });
  });
  return (
    <group ref={ref}>
      {cubes.map((p, i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={[0.18, 0.18, 0.18]} />
          <meshStandardMaterial color="#3b82f6" emissive="#1e40af" emissiveIntensity={0.4} metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
};

const ShaderPlane = () => {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
  });
  return (
    <mesh rotation={[-0.2, 0.3, 0]}>
      <planeGeometry args={[2.2, 1.6, 64, 48]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={/* glsl */ `
          uniform float uTime;
          varying vec2 vUv;
          varying float vWave;
          void main() {
            vUv = uv;
            vec3 pos = position;
            float w = sin(pos.x * 3.0 + uTime) * 0.05 + cos(pos.y * 4.0 + uTime * 1.3) * 0.04;
            pos.z += w;
            vWave = w;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={/* glsl */ `
          varying vec2 vUv;
          varying float vWave;
          uniform float uTime;
          void main() {
            vec3 c1 = vec3(0.231, 0.510, 0.965);
            vec3 c2 = vec3(0.06, 0.10, 0.30);
            vec3 c3 = vec3(0.95, 0.97, 1.0);
            float t = sin(vUv.x * 3.0 + uTime * 0.5) * 0.5 + 0.5;
            vec3 col = mix(c2, c1, t);
            col = mix(col, c3, vWave * 5.0);
            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
};

const Wireframe = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.x += dt * 0.3;
    ref.current.rotation.y += dt * 0.45;
  });
  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[0.95, 0]} />
      <meshBasicMaterial color="#60a5fa" wireframe toneMapped={false} />
    </mesh>
  );
};

const Rings = () => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.children.forEach((c, i) => {
      c.rotation.x = state.clock.elapsedTime * (0.3 + i * 0.15);
      c.rotation.y = state.clock.elapsedTime * (0.2 + i * 0.12) * (i % 2 === 0 ? 1 : -1);
    });
  });
  return (
    <group ref={ref}>
      {[0.5, 0.75, 1.0, 1.25].map((r, i) => (
        <mesh key={i}>
          <torusGeometry args={[r, 0.012, 8, 80]} />
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1.2 - i * 0.2} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
};

const FloatShape = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state, dt) => {
    if (!ref.current) return;
    ref.current.rotation.x += dt * 0.25;
    ref.current.rotation.z += dt * 0.18;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.2;
  });
  return (
    <mesh ref={ref}>
      <tetrahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#dbeafe" emissive="#3b82f6" emissiveIntensity={0.5} metalness={0.85} roughness={0.2} flatShading />
    </mesh>
  );
};

const MotifMesh = ({ motif }: { motif: Motif }) => {
  switch (motif) {
    case 'knot': return <Knot />;
    case 'nodes': return <Nodes />;
    case 'grid': return <Grid />;
    case 'shader': return <ShaderPlane />;
    case 'wireframe': return <Wireframe />;
    case 'rings': return <Rings />;
    case 'float': return <FloatShape />;
  }
};

// ---------------------------------------------------------------------------
// Main wrapper — IntersectionObserver gates rendering to save GPU
// ---------------------------------------------------------------------------
const ProjectCanvas = ({ motif, className }: { motif: Motif; className?: string }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05, rootMargin: '100px' }
    );
    obs.observe(wrapperRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className={className}>
      {visible && (
        <Canvas
          frameloop="always"
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, depth: true, powerPreference: 'low-power' }}
          camera={{ position: [0, 0, 3.2], fov: 40 }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.6} />
            <pointLight position={[3, 3, 3]} intensity={1.5} color="#60a5fa" />
            <pointLight position={[-3, -2, 2]} intensity={1} color="#1e40af" />
            <MotifMesh motif={motif} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
};

export default ProjectCanvas;
