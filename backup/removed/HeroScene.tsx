import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Lightformer, MeshDistortMaterial } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * The one remaining WebGL surface on the site: a single distorted icosahedron
 * with two orbit rings, sitting behind the hero.
 *
 * Deliberately excluded — each was measured against what it added on screen:
 *   - EffectComposer / bloom / chromatic aberration (large, invisible at this scale)
 *   - Environment preset="studio" (fetches an HDR from a CDN at runtime)
 *   - particle field, camera waypoint rig, fullscreen noise shader
 * The ambient gradient that used to be a fragment shader is now plain CSS.
 */

const Subject = ({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    const mesh = meshRef.current;
    if (mesh) {
      mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, mouse.current.y * 0.4, 0.04);
      mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, mouse.current.x * 0.5, 0.04);
      const target = hovered ? 2.15 : 2;
      mesh.scale.setScalar(THREE.MathUtils.lerp(mesh.scale.x, target, 0.06));
    }
    if (groupRef.current) {
      // Gentle parallax so the subject tracks the pointer without a camera rig.
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        mouse.current.x * 0.35,
        0.05
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        mouse.current.y * 0.25,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.4} floatIntensity={1}>
        <mesh
          ref={meshRef}
          scale={2}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <icosahedronGeometry args={[1, 6]} />
          <MeshDistortMaterial
            color={hovered ? '#dbeafe' : '#ffffff'}
            envMapIntensity={1.8}
            metalness={0.9}
            roughness={0.1}
            distort={0.4}
            speed={2.5}
          />
        </mesh>
      </Float>

      <Float speed={4} rotationIntensity={1.5} floatIntensity={0.5}>
        <mesh rotation={[Math.PI / 3, 0, 0]} scale={3.5}>
          <torusGeometry args={[1, 0.005, 12, 100]} />
          <meshBasicMaterial color="#60a5fa" toneMapped={false} />
        </mesh>
      </Float>

      <Float speed={3} rotationIntensity={2} floatIntensity={0.5}>
        <mesh rotation={[-Math.PI / 4, Math.PI / 6, 0]} scale={4.5}>
          <torusGeometry args={[1, 0.005, 12, 100]} />
          <meshBasicMaterial color="#93c5fd" toneMapped={false} />
        </mesh>
      </Float>
    </group>
  );
};

const HeroScene = () => {
  const mouse = useRef({ x: 0, y: 0 });
  // Nothing to draw once the hero has scrolled away — stop the render loop.
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onScroll = () => setInView(window.scrollY < window.innerHeight * 1.1);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 h-screen w-full" aria-hidden="true">
      <Canvas
        frameloop={inView ? 'always' : 'never'}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, stencil: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 10], fov: 45 }}
      >
        <ambientLight intensity={0.4} />
        <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={4} color="#3b82f6" distance={25} />
        <pointLight position={[-10, -5, 5]} intensity={3} color="#1e40af" />

        {/* Locally generated environment map — keeps the metal readable with no CDN fetch. */}
        <Environment resolution={64}>
          <Lightformer intensity={2} position={[0, 4, -6]} scale={[10, 4, 1]} color="#ffffff" />
          <Lightformer intensity={1.2} position={[-6, 1, 2]} scale={[6, 6, 1]} color="#60a5fa" />
          <Lightformer intensity={0.8} position={[6, -2, 2]} scale={[6, 6, 1]} color="#1e40af" />
        </Environment>

        <Subject mouse={mouse} />
      </Canvas>
    </div>
  );
};

export default HeroScene;