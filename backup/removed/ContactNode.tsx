import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

const Node = () => {
  const ref = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
    if (ringRef.current) {
      const s = 1 + (Math.sin(state.clock.elapsedTime * 1.5) * 0.5 + 0.5) * 0.4;
      ringRef.current.scale.setScalar(s);
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.7 - (s - 1) * 1.4;
    }
  });

  return (
    <>
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.6}>
        <mesh ref={ref}>
          <icosahedronGeometry args={[0.55, 1]} />
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#3b82f6"
            emissiveIntensity={0.7}
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>
      </Float>
      <mesh ref={ringRef}>
        <torusGeometry args={[0.7, 0.012, 8, 64]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.7} toneMapped={false} />
      </mesh>
    </>
  );
};

const ContactNode = () => {
  return (
    <div className="w-32 h-32 md:w-40 md:h-40 mx-auto">
      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 2.6], fov: 45 }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[3, 3, 3]} intensity={1.8} color="#60a5fa" />
        <pointLight position={[-3, -2, 2]} intensity={1} color="#1e40af" />
        <Node />
      </Canvas>
    </div>
  );
};

export default ContactNode;
