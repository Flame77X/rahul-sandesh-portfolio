export interface ProjectDetail {
    id: string;
    title: string;
    category: string;
    status: 'Live' | 'In Development' | 'Prototype' | 'Research';
    tagline: string;
    challenge: string;
    solution: string;
    tech: string[];
    features: string[];
    links?: {
        github?: string;
        live?: string;
        doc?: string;
    };
    color: string;
}

export const PROJECTS: ProjectDetail[] = [
    {
        id: "ai-interviewer",
        title: "Multi-Modal AI Interviewer",
        category: "Flagship AI",
        status: "In Development",
        tagline: "Agentic, real-time interview system with sub-100ms latency.",
        challenge: "Traditional resume screening is static, while human interviews are inconsistent and expensive to scale. Existing AI solutions often suffer from high latency (3-5s), breaking the flow of natural conversation.",
        solution: "I architected a multi-agent system using Groq LPUs for inference, achieving sub-100ms response times. The system uses a dedicated listening agent (VAD), a reasoning agent (Llama 3), and a critique agent to provide real-time, human-like feedback.",
        tech: ["Python", "FastAPI", "Llama 3.3", "Groq LPU", "React", "WebSockets"],
        features: [
            "Real-time voice activity detection (VAD) to handle interruptions.",
            "Dynamic questioning based on candidate responses (RAG).",
            "Post-interview emotional and technical analysis report.",
            "System Architecture: Frontend -> Socket -> VAD -> LLM -> TTS."
        ],
        // No GitHub link as per user request
        color: "blue"
    },
    {
        id: "bloodsync",
        title: "BloodSync AI Bot",
        category: "NLU Engine",
        status: "Prototype",
        tagline: "Lifesaving donor matching on Telegram.",
        challenge: "Finding blood donors in emergencies is chaotic, relying on unorganized WhatsApp groups with no verification or location filtering.",
        solution: "Developed an autonomous Telegram bot that parses natural language requests (e.g., 'Need O+ in Providence'), queries a Firestore database of verified donors, and instantly alerts nearby matches.",
        tech: ["Python", "Flask", "Telegram API", "Google Firestore", "Local LLM"],
        features: [
            "Natural Language Understanding (NLU) for parsing requests.",
            "Geo-fenced alerts to relevant donors only.",
            "Privacy-first donor data handling.",
            "Reduced manual matching effort by 60%."
        ],
        links: {
            live: "https://t.me/bloodsync_bot" // Placeholder or actual if available
        },
        color: "rose"
    },
    {
        id: "doctus-grid",
        title: "Doctus Grid",
        category: "EdTech Platform",
        status: "Live",
        tagline: "Multimodal educational station with adaptive teaching personas.",
        challenge: "Online learning is often one-size-fits-all. Students have different learning styles (visual, textual, Socratic) that static courses cannot address.",
        solution: "Built a platform with a 'Multi-Persona Engine' that switches teaching styles (e.g., 'Strict Professor' vs. 'Visual Explainer'). It integrates Pollinations.ai to generate real-time diagrams for complex concepts.",
        tech: ["React", "Node.js", "Express", "Tailwind CSS", "Pollinations.ai"],
        features: [
            "4 AI Personas: Professor Pulsar, SciBot, GiggleBit, Explorer.",
            "Dynamic Image Generation during lectures.",
            "Persistent chat sessions with memory.",
            "Glassmorphism UI for immersive focus."
        ],
        links: {
            live: "https://doctus-grid.vercel.app/"
        },
        color: "emerald"
    },
    {
        id: "chromoshift",
        title: "ChromoShift AI",
        category: "Vision Lab",
        status: "Research",
        tagline: "Deep learning model for automatic image colorization.",
        challenge: "Restoring historical archives requires expensive manual colorization. Existing auto-colorizers often washout colors or hallucinate incorrect hues.",
        solution: "Trained a Supervised Machine Learning model on grayscale datasets to recognize textures and apply historically accurate color palettes autonomously.",
        tech: ["Python", "TensorFlow", "OpenCV", "NumPy", "Jupyter"],
        features: [
            "Texture-based color inference.",
            "Support for high-resolution archival photos.",
            "Comparative loss function analysis."
        ],
        color: "yellow"
    },
    {
        id: "ros-mobile-bot",
        title: "ROS Mobile Robot",
        category: "Robotics",
        status: "Prototype",
        tagline: "Autonomous navigation unit with sensor fusion.",
        challenge: "Building a low-cost autonomous rover that can navigate dynamic environments without expensive LIDAR systems.",
        solution: "Integrated ROS (Robot Operating System) with OpenCV visual SLAM to allow the robot to map its environment and avoid obstacles using simple camera inputs.",
        tech: ["ROS Noetic", "Python", "C++", "OpenCV", "Raspberry Pi"],
        features: [
            "SLAM (Simultaneous Localization and Mapping).",
            "Obstacle avoidance algorithm.",
            "Remote teleoperation via WebSocket."
        ],
        color: "gray"
    },
    {
        id: "live-scoreboard",
        title: "Live Web Scoreboard",
        category: "Real-time Web",
        status: "Live",
        tagline: "Real-time sports tracking for campus events.",
        challenge: "Campus sports events lacked a centralized way for 500+ students to track scores in real-time.",
        solution: "Deployed a reactive web app using Firebase Realtime Database to push score updates instantly to all connected clients without page reloads.",
        tech: ["React", "Firebase", "CSS Modules"],
        features: [
            "Sub-second latency updates.",
            "Admin panel for game officials.",
            "Responsive design for mobile viewing."
        ],
        color: "cyan"
    },
    {
        id: "uav-drone",
        title: "UAV Drone Firmware",
        category: "Aerial Systems",
        status: "Prototype",
        tagline: "Custom flight controller for stable aerial navigation.",
        challenge: "Understanding the physics and control loops required to stabilize a quadcopter from scratch.",
        solution: "Programmed a PID controller in Python/Firmware to manage motor thrust vectors, achieving stable flight and hover capabilities.",
        tech: ["Python", "Firmware", "Physics Engine"],
        features: [
            "Custom PID stabilization loop.",
            "Telemetry data logging.",
            "Emergency failsafe protocols."
        ],
        color: "purple"
    }
];
