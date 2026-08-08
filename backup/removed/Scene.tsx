import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, MeshDistortMaterial, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Shader background — fluid noise plane that reacts to mouse + scroll
// ---------------------------------------------------------------------------
const bgVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const bgFrag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uMouse;
  uniform float uAspect;

  vec3 permute(vec3 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                       + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = vec2((uv.x - 0.5) * uAspect, uv.y - 0.5) * 2.5;
    float t = uTime * 0.06;
    vec2 m = uMouse * 0.4;
    float n1 = snoise(p + t + m);
    float n2 = snoise(p * 1.8 - t * 1.2 - m * 0.5);
    float n3 = snoise(p * 4.0 + t * 0.4);
    float n  = n1 + n2 * 0.55 + n3 * 0.18;

    float d = distance(uv, vec2(0.5));

    vec3 base   = vec3(0.018, 0.020, 0.024);
    vec3 accent = vec3(0.231, 0.510, 0.965); // #3b82f6
    vec3 deep   = vec3(0.06, 0.10, 0.30);

    float halo = smoothstep(0.0, 1.0, n * 0.5 + 0.5);
    float intensity = halo * (0.22 - d * 0.18);
    intensity += smoothstep(0.78, 0.0, d) * 0.04;
    intensity += uScroll * 0.05;

    vec3 col = base + mix(deep, accent, halo) * intensity;

    // Vignette
    col *= 1.0 - smoothstep(0.55, 1.0, d) * 0.55;

    gl_FragColor = vec4(col, 1.0);
  }
`;

const ShaderBackground = ({ scrollRef, mouseRef }: { scrollRef: React.MutableRefObject<number>; mouseRef: React.MutableRefObject<{ x: number; y: number }> }) => {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uTime:   { value: 0 },
    uScroll: { value: 0 },
    uMouse:  { value: new THREE.Vector2(0, 0) },
    uAspect: { value: window.innerWidth / window.innerHeight },
  }), []);

  useEffect(() => {
    const onResize = () => {
      uniforms.uAspect.value = window.innerWidth / window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [uniforms]);

  useFrame((state) => {
    if (!matRef.current) return;
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uScroll.value = scrollRef.current;
    uniforms.uMouse.value.lerp(
      new THREE.Vector2(mouseRef.current.x, mouseRef.current.y),
      0.04
    );
  });

  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={bgVert}
        fragmentShader={bgFrag}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
};

// ---------------------------------------------------------------------------
// Hero subject — distort sphere + scroll-reactive morph
// ---------------------------------------------------------------------------
const OrganicShape = ({ isMobile, scrollRef, mouseRef }: { isMobile: boolean; scrollRef: React.MutableRefObject<number>; mouseRef: React.MutableRefObject<{ x: number; y: number }> }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<any>(null);
  const [hovered, setHover] = useState(false);

  useFrame((_, delta) => {
    if (meshRef.current) {
      const s = scrollRef.current;
      const targetX = mouseRef.current.y * (isMobile ? 0.2 : 0.5);
      const targetY = mouseRef.current.x * (isMobile ? 0.2 : 0.5) + s * 1.2;
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetX, 0.04);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetY, 0.04);
      // Pulse scale subtly with scroll
      const baseScale = isMobile ? 1.8 : (hovered ? 2.2 : 2);
      const target = baseScale * (1 + s * 0.08);
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, target, 0.05));
    }
    if (groupRef.current) {
      // Scroll moves the whole group rightward and back
      const s = scrollRef.current;
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, s * 1.2, 0.06);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, -s * 1.5, 0.06);
    }
    // Increase distort with scroll for "agitation"
    if (matRef.current && 'distort' in matRef.current) {
      const s = scrollRef.current;
      matRef.current.distort = THREE.MathUtils.lerp(matRef.current.distort, 0.4 + s * 0.35, 0.08);
    }
    void delta;
  });

  return (
    <group ref={groupRef}>
      <Float speed={isMobile ? 1 : 2} rotationIntensity={isMobile ? 0.2 : 0.5} floatIntensity={1}>
        <mesh
          ref={meshRef}
          scale={isMobile ? 1.8 : 2}
          onPointerOver={() => !isMobile && setHover(true)}
          onPointerOut={() => !isMobile && setHover(false)}
        >
          <icosahedronGeometry args={[1, isMobile ? 3 : 8]} />
          {isMobile ? (
            <meshStandardMaterial color="#e2e8f0" roughness={0.2} metalness={0.8} />
          ) : (
            <MeshDistortMaterial
              ref={matRef}
              color={hovered ? "#dbeafe" : "#ffffff"}
              envMapIntensity={2.2}
              metalness={0.92}
              roughness={0.08}
              distort={0.4}
              speed={3}
              clearcoat={1}
              clearcoatRoughness={0}
            />
          )}
        </mesh>
      </Float>

      <Float speed={4} rotationIntensity={1.5} floatIntensity={0.5}>
        <mesh rotation={[Math.PI / 3, 0, 0]} scale={isMobile ? 2.5 : 3.5}>
          <torusGeometry args={[1, 0.005, 16, isMobile ? 32 : 100]} />
          <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
      </Float>

      <Float speed={3} rotationIntensity={2} floatIntensity={0.5}>
        <mesh rotation={[-Math.PI / 4, Math.PI / 6, 0]} scale={isMobile ? 3.5 : 4.5}>
          <torusGeometry args={[1, 0.005, 16, isMobile ? 32 : 100]} />
          <meshStandardMaterial color="#93c5fd" emissive="#3b82f6" emissiveIntensity={1.0} toneMapped={false} />
        </mesh>
      </Float>
    </group>
  );
};

// ---------------------------------------------------------------------------
// Particle swarm — visible mid-scroll, drifts past camera
// ---------------------------------------------------------------------------
const ParticleField = ({ scrollRef, isMobile }: { scrollRef: React.MutableRefObject<number>; isMobile: boolean }) => {
  const ref = useRef<THREE.Points>(null);
  const count = isMobile ? 200 : 600;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 30;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 25 - 5;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const s = scrollRef.current;
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, -2 + s * 8, 0.05);
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = THREE.MathUtils.clamp(s * 1.4, 0, 0.7);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#60a5fa"
        size={isMobile ? 0.04 : 0.025}
        sizeAttenuation
        transparent
        opacity={0}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
};

// ---------------------------------------------------------------------------
// Camera rig — dollies through scroll waypoints
// ---------------------------------------------------------------------------
const CameraRig = ({ scrollRef, mouseRef }: { scrollRef: React.MutableRefObject<number>; mouseRef: React.MutableRefObject<{ x: number; y: number }> }) => {
  const camRef = useRef<THREE.PerspectiveCamera>(null);

  // 4 waypoints across scroll [0..1]
  const waypoints = useMemo(() => [
    { pos: new THREE.Vector3(0, 0, 10),    look: new THREE.Vector3(0, 0, 0) },   // hero
    { pos: new THREE.Vector3(2.4, 0.6, 8), look: new THREE.Vector3(1, 0, -1) },  // philosophy
    { pos: new THREE.Vector3(-2.0, 1.2, 7), look: new THREE.Vector3(-0.5, 0.4, -1) }, // experience/work
    { pos: new THREE.Vector3(0, -1.2, 12), look: new THREE.Vector3(0, 0, -2) },  // late
  ], []);

  const tmpPos = useMemo(() => new THREE.Vector3(), []);
  const tmpLook = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (!camRef.current) return;
    const s = THREE.MathUtils.clamp(scrollRef.current, 0, 1);
    // Map s onto 3 segments
    const seg = s * (waypoints.length - 1);
    const i = Math.floor(seg);
    const t = seg - i;
    const a = waypoints[Math.min(i, waypoints.length - 1)];
    const b = waypoints[Math.min(i + 1, waypoints.length - 1)];
    tmpPos.lerpVectors(a.pos, b.pos, t);
    tmpLook.lerpVectors(a.look, b.look, t);

    // Mouse parallax
    tmpPos.x += mouseRef.current.x * 0.6;
    tmpPos.y += mouseRef.current.y * 0.4;

    camRef.current.position.lerp(tmpPos, 0.06);
    camRef.current.lookAt(tmpLook);
  });

  return <PerspectiveCamera ref={camRef} makeDefault position={[0, 0, 10]} fov={45} />;
};

// ---------------------------------------------------------------------------
// Post effects — DOF + bloom + chromatic aberration + noise + vignette
// ---------------------------------------------------------------------------
const BackgroundEffects = ({ isMobile }: { isMobile: boolean }) => {
  if (isMobile) return null;
  return (
    <EffectComposer disableNormalPass>
      <Bloom luminanceThreshold={0.85} mipmapBlur intensity={0.6} radius={0.5} />
      <ChromaticAberration offset={[0.0012, 0.0012]} blendFunction={BlendFunction.NORMAL} />
      <Noise opacity={0.035} />
      <Vignette eskil={false} offset={0.1} darkness={0.55} />
    </EffectComposer>
  );
};

// ---------------------------------------------------------------------------
// Main Scene
// ---------------------------------------------------------------------------
const Scene = () => {
  const [isMobile, setIsMobile] = useState(false);
  const scrollRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const max = (document.documentElement.scrollHeight - window.innerHeight) || 1;
      scrollRef.current = Math.min(1, Math.max(0, window.scrollY / max));
    };
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMove, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-screen -z-10 bg-ink-0">
      <Canvas
        gl={{
          antialias: !isMobile,
          alpha: false,
          stencil: false,
          depth: true,
          powerPreference: "high-performance"
        }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
      >
        <CameraRig scrollRef={scrollRef} mouseRef={mouseRef} />

        {/* Shader fluid background — desktop only for perf */}
        {!isMobile && <ShaderBackground scrollRef={scrollRef} mouseRef={mouseRef} />}

        <ambientLight intensity={0.25} />
        <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={5} color="#3b82f6" distance={20} />
        <pointLight position={[-10, -5, 5]} intensity={4} color="#1e40af" />

        <Environment preset="studio" />

        <OrganicShape isMobile={isMobile} scrollRef={scrollRef} mouseRef={mouseRef} />

        {!isMobile && <ParticleField scrollRef={scrollRef} isMobile={isMobile} />}

        <BackgroundEffects isMobile={isMobile} />
      </Canvas>
    </div>
  );
};

export default Scene;
