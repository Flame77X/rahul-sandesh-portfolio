import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, OrbitControls, Float } from '@react-three/drei'
import * as THREE from 'three'

interface TagProps {
    text: string;
    position: THREE.Vector3;
    color: string;
}

const Tag = ({ text, position, color }: TagProps) => {
    const [hovered, setHovered] = useState(false)
    const ref = useRef<THREE.Group>(null)

    useFrame(({ camera }) => {
        if (ref.current) {
            ref.current.quaternion.copy(camera.quaternion)
        }
    })

    return (
        <group ref={ref} position={position}>
            <Text
                color={hovered ? 'white' : color}
                fontSize={hovered ? 0.4 : 0.25}
                anchorX="center"
                anchorY="middle"
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                {text}
            </Text>
        </group>
    )
}

const Cloud = ({ count = 40, radius = 4 }) => {
    const group = useRef<THREE.Group>(null)

    const tags = useMemo(() => {
        const skills = [
            { t: "Python", c: "#3b82f6" }, { t: "React", c: "#61dafb" }, { t: "Llama 3", c: "#a855f7" },
            { t: "Three.js", c: "#ffffff" }, { t: "TypeScript", c: "#3178c6" }, { t: "ROS", c: "#ef4444" },
            { t: "Groq", c: "#f97316" }, { t: "FastAPI", c: "#22c55e" }, { t: "Node.js", c: "#84ba64" },
            { t: "TensorFlow", c: "#fb923c" }, { t: "PyTorch", c: "#ea580c" }, { t: "Docker", c: "#2496ed" },
            { t: "PostgreSQL", c: "#336791" }, { t: "Firebase", c: "#ffca28" }, { t: "C++", c: "#00599c" },
            { t: "OpenCV", c: "#5c3ee8" }, { t: "RAG", c: "#ec4899" }, { t: "LangChain", c: "#14b8a6" },
            { t: "Git", c: "#f1502f" }, { t: "Linux", c: "#fbbf24" }, { t: "Next.js", c: "#ffffff" },
            { t: "Tailwind", c: "#38bdf8" }, { t: "Framer", c: "#0055ff" }, { t: "Vercel", c: "#ffffff" },
            { t: "Figma", c: "#f24e1e" }, { t: "DeepFace", c: "#a855f7" }, { t: "Flask", c: "#ffffff" },
            { t: "Arduino", c: "#00979d" }, { t: "Raspberry Pi", c: "#c51a4a" }, { t: "HTML5", c: "#e34f26" }
        ]

        const temp = []
        const phi = Math.PI * (3 - Math.sqrt(5))

        for (let i = 0; i < skills.length; i++) {
            const y = 1 - (i / (skills.length - 1)) * 2
            const r = Math.sqrt(1 - y * y)
            const theta = phi * i

            const x = Math.cos(theta) * r
            const z = Math.sin(theta) * r

            temp.push({
                ...skills[i],
                pos: new THREE.Vector3(x * radius, y * radius, z * radius)
            })
        }
        return temp
    }, [radius])

    return (
        <group ref={group}>
            {tags.map((tag, i) => (
                <Float key={i} speed={1} rotationIntensity={0} floatIntensity={0.2}>
                    <Tag text={tag.t} color={tag.c} position={tag.pos} />
                </Float>
            ))}
        </group>
    )
}

const TechCloud = () => {
    return (
        <div className="h-[500px] w-full cursor-grab active:cursor-grabbing">
            <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 9], fov: 50 }}>
                <Cloud />
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={0.5}
                />
            </Canvas>
        </div>
    )
}

export default TechCloud;
