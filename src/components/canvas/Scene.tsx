import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, MeshDistortMaterial, Sparkles, PerspectiveCamera, Ring, useTexture } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

const OrganicShape = ({ isMobile }: { isMobile: boolean }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);

    useFrame((state) => {
        if (meshRef.current) {
            // Slower rotation on mobile
            const rotationSpeed = isMobile ? 0.2 : 0.5;
            meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, state.mouse.y * rotationSpeed, 0.05);
            meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, state.mouse.x * rotationSpeed, 0.05);
        }
    });

    return (
        <group>
            <Float speed={isMobile ? 1 : 2} rotationIntensity={isMobile ? 0.2 : 0.5} floatIntensity={1}>
                <mesh
                    ref={meshRef}
                    scale={isMobile ? 1.8 : (hovered ? 2.2 : 2)}
                    onPointerOver={() => !isMobile && setHover(true)}
                    onPointerOut={() => !isMobile && setHover(false)}
                >
                    {/* Lower resolution geometry on mobile */}
                    <icosahedronGeometry args={[1, isMobile ? 4 : 10]} />

                    {/* Simplified material for mobile to save GPU */}
                    {isMobile ? (
                        <meshStandardMaterial
                            color="#e2e8f0"
                            roughness={0.2}
                            metalness={0.8}
                        />
                    ) : (
                        <MeshDistortMaterial
                            color={hovered ? "#cbd5e1" : "#ffffff"}
                            envMapIntensity={2}
                            metalness={0.9}
                            roughness={0.1}
                            distort={0.4}
                            speed={3}
                            clearcoat={1}
                            clearcoatRoughness={0}
                        />
                    )}
                </mesh>
            </Float>

            {/* Orbiting Ring 1 */}
            <Float speed={4} rotationIntensity={1.5} floatIntensity={0.5}>
                <mesh rotation={[Math.PI / 3, 0, 0]} scale={isMobile ? 2.5 : 3.5}>
                    <torusGeometry args={[1, 0.005, 16, isMobile ? 32 : 100]} />
                    <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={2} toneMapped={false} />
                </mesh>
            </Float>

            {/* Orbiting Ring 2 */}
            <Float speed={3} rotationIntensity={2} floatIntensity={0.5}>
                <mesh rotation={[-Math.PI / 4, Math.PI / 6, 0]} scale={isMobile ? 3.5 : 4.5}>
                    <torusGeometry args={[1, 0.005, 16, isMobile ? 32 : 100]} />
                    <meshStandardMaterial color="#a78bfa" emissive="#8b5cf6" emissiveIntensity={2} toneMapped={false} />
                </mesh>
            </Float>
        </group>
    );
};

const BackgroundEffects = ({ isMobile }: { isMobile: boolean }) => {
    // Disable expensive effects on mobile
    if (isMobile) return null;

    return (
        <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={1} mipmapBlur intensity={0.8} radius={0.6} />
            <ChromaticAberration offset={[0.002, 0.002]} blendFunction={BlendFunction.NORMAL} />
            <Noise opacity={0.06} />
            <Vignette eskil={false} offset={0.1} darkness={0.6} />
        </EffectComposer>
    )
}

const Scene = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-screen -z-10 bg-black">
            <Canvas
                gl={{
                    antialias: !isMobile, // Disable antialias on mobile for performance
                    alpha: false,
                    stencil: false,
                    depth: false,
                    powerPreference: "high-performance"
                }}
                dpr={isMobile ? [1, 1] : [1, 1.5]} // Cap DPR at 1 on mobile
            >
                <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                <color attach="background" args={['#030303']} />

                <ambientLight intensity={0.2} />
                <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={5} color="#blue" distance={20} />
                <pointLight position={[-10, -5, 5]} intensity={5} color="#purple" />

                <Environment preset="studio" />

                <group position={[0, 0, 0]}>
                    <OrganicShape isMobile={isMobile} />
                    {!isMobile && <Sparkles count={100} scale={12} size={2} speed={0.4} opacity={0.5} color="#ffffff" />}
                </group>

                <BackgroundEffects isMobile={isMobile} />
            </Canvas>
        </div>
    );
};

export default Scene;
