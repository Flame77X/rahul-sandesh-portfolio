// Single source of truth for every piece of content on the page.
// Edit here — no JSX changes needed.
// Kept in sync with public/resume.pdf (Rahul_Sandesh_Resume_2).

export type ThumbMotif = 'knot' | 'nodes' | 'grid' | 'waves' | 'wireframe' | 'rings' | 'float';

export interface Project {
  kind: string;
  title: string;
  desc: string;
  motif: ThumbMotif;
  /** Optional screenshot in /public — e.g. "/shots/voca.png". Overrides the motif. */
  image?: string;
  tags?: string[];
  /** Shown as a small label on the card, e.g. "2024 — Present". */
  period?: string;
  /** Flagship spans two columns in the grid. */
  featured?: boolean;
}

export interface Experience {
  period: string;
  title: string;
  company: string;
  location?: string;
  points: string[];
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export const profile = {
  name: 'Rahul Sandesh',
  initials: 'RAHUL.S',
  headline: ['ARCHITECTING', 'INTELLIGENCE'],
  tagline: 'AI/ML Engineer · LLMs · RAG Pipelines · Python · React',
  summary:
    'AI/ML Engineer with hands-on experience designing and deploying LLM inference systems, RAG pipelines, and NLP-driven data extraction modules in production. Proficient in Python, React, and TypeScript, with a strong foundation in deep learning, computer vision, and ROS-based robotics.',
  blurb: 'AI/ML Engineer building LLM inference systems, RAG pipelines, and production data workflows.',
  philosophy:
    'AI systems should be observable, modular, and designed for high-impact human augmentation.',
  location: 'Kumbanad, Kerala, India',
  portrait: '/rahul.jpg',
  email: 'rahulsandeshx3000@gmail.com',
  github: 'https://github.com/Flame77X',
  linkedin: 'https://www.linkedin.com/in/rahul-sandesh-8a1786246/',
  calendar: 'https://cal.com/rahul-sandesh-tt7vft/30min',
  /** Drop a new PDF at public/resume.pdf to update — the filename stays the same. */
  resumeUrl: '/resume.pdf',
  web3formsKey: '62c4a56c-ff2a-4076-9613-f952d47bf17b',
};

export const experience: Experience[] = [
  {
    period: 'May 2026 — Present',
    title: 'Associate Software Engineer',
    company: 'Drizzla',
    location: 'Remote',
    points: [
      'Shipping production features for an AI-driven SaaS platform in Python, React, TypeScript and REST APIs across 3 active product modules.',
      'Designing data transformation pipelines (Pandas, NumPy) processing 15K+ records for ML training and inference workflows.',
      'Delivering every assigned feature on schedule through the first 4 sprint cycles with cross-functional teams.',
    ],
  },
  {
    period: 'Jan 2026 — Mar 2026',
    title: 'Product Development Specialist',
    company: 'Drizzla',
    location: 'Remote',
    points: [
      'Built end-to-end dataset preparation pipelines and structured data workflows, cutting data cleaning time by 35%.',
      'Implemented and tested 5+ features across the product stack against professional code review standards.',
      'Authored technical documentation for 4 core modules, reducing onboarding time for new team members.',
    ],
  },
  {
    period: 'Jun 2025 — Nov 2025',
    title: 'AI Intern',
    company: 'Pramana AyurTech Solutions',
    location: 'Remote',
    points: [
      'Architected and integrated LLM inference and RAG pipelines (Python, Llama-based models) into the ePramana Clinical Decision Support System, reducing manual workflow effort by 35%.',
      'Engineered custom NLP extraction modules parsing unstructured Ayurvedic clinical notes into structured database records.',
      'Refined prompt engineering strategies across 200+ domain-specific medical queries, lifting response relevance accuracy above 90%.',
    ],
  },
  {
    period: '2023 — 2025',
    title: 'Treasurer',
    company: 'AI Council, Providence College of Engineering',
    location: 'Chengannur',
    points: [
      'Managed the annual budget for AI workshops and events serving 200+ students with zero budget overruns across 2 academic years.',
      'Coordinated vendor procurement and logistics for 5+ technical events, all delivered on budget and on schedule.',
    ],
  },
  {
    period: '2021 — Present',
    title: 'Founder & Operator',
    company: 'Printing Business',
    points: [
      'Built and independently operated a printing services business, fulfilling 300+ client orders with a strong repeat-client rate.',
      'Managed pricing, vendor negotiations, logistics and customer relationships end to end.',
    ],
  },
];

/** The three tenets behind profile.philosophy, as About-section cards. */
export const principles = [
  {
    index: '01',
    tag: 'Observable',
    title: 'Systems should explain themselves',
    body: 'Inference paths, retrieval sources, and failure modes are surfaced rather than hidden. A model you cannot inspect is a model you cannot trust in production.',
  },
  {
    index: '02',
    tag: 'Modular',
    title: 'Composable over monolithic',
    body: 'Retrieval, reasoning, and presentation stay separable. Swapping a model or a vector store should not mean rewriting the product around it.',
  },
  {
    index: '03',
    tag: 'Applied',
    title: 'Built for human augmentation',
    body: 'The goal is measurable leverage for the person doing the work — a clinician, a planner, an engineer — not autonomy for its own sake.',
  },
];

export const education = {
  degree: 'B.Tech, Computer Science & Engineering (AI)',
  school: 'Providence College of Engineering',
  location: 'Chengannur, Kerala',
  period: '2022 — 2026',
  coursework: [
    'Deep Learning',
    'Natural Language Processing',
    'Data Structures & Algorithms',
    'Computer Vision',
  ],
};

export const certifications = [
  { name: 'Introduction to Claude Cowork', issuer: 'Anthropic' },
  { name: 'Introduction to Model Context Protocol (MCP)', issuer: 'Anthropic' },
  { name: 'Claude Code 101', issuer: 'Anthropic' },
  { name: 'Project Management with ClickUp', issuer: 'ClickUp' },
];

export const projects: Project[] = [
  {
    kind: 'Flagship Case Study',
    title: 'Voca AI',
    desc: 'AI-powered mock interview platform giving real-time feedback on answer clarity, relevance and communication quality through LLM inference and retrieval-augmented generation. RAG pipelines feed a React frontend and structured feedback engine with context-aware question generation across multiple interview domains.',
    motif: 'knot',
    period: '2024 — Present',
    tags: ['Python', 'React', 'Llama Models', 'RAG', 'LangChain'],
    featured: true,
  },
  {
    kind: 'EdTech Platform',
    title: 'Doctus Grid',
    desc: 'Multimodal AI learning platform with a multi-persona engine that adapts LLM behaviour to different learning styles via persona-based system prompts. Glassmorphism UI with persistent chat sessions and keyword-triggered image generation.',
    motif: 'grid',
    period: '2025',
    tags: ['React', 'Node.js', 'Express', 'Tailwind CSS', 'LLMs', 'REST APIs'],
  },
  {
    kind: 'Conversational AI',
    title: 'BloodSync',
    desc: 'Donor–recipient matching chatbot running fully offline LLM inference, reducing manual matching effort by 60%.',
    motif: 'nodes',
    period: '2024',
    tags: ['Python', 'Flask', 'Local LLM'],
  },
  {
    kind: 'Robotics',
    title: 'Mobile Robot Development',
    desc: 'Autonomous navigation and object detection modules with multi-sensor fusion for a mobile robot platform.',
    motif: 'wireframe',
    period: '2024',
    tags: ['ROS', 'Python', 'OpenCV'],
  },
  // --- Not on the current resume. Delete these three if you want the site to
  // --- mirror the resume exactly.
  {
    kind: 'Vision Lab',
    title: 'ChromoShift AI',
    desc: 'Deep learning system that colorizes grayscale image datasets through learned pattern recognition.',
    motif: 'waves',
    tags: ['PyTorch', 'OpenCV'],
  },
  {
    kind: 'Real-time Web',
    title: 'Live Scoreboard',
    desc: 'React platform delivering match scores to 200+ students over Firebase real-time subscriptions.',
    motif: 'rings',
    tags: ['React', 'Firebase'],
  },
  {
    kind: 'Aerial Systems',
    title: 'UAV Drone',
    desc: 'Semi-autonomous flight prototype with custom firmware for stable aerial navigation.',
    motif: 'float',
    tags: ['C++', 'Embedded'],
  },
];

export const skills: SkillGroup[] = [
  {
    label: 'Programming',
    items: ['Python', 'C++', 'Java', 'JavaScript', 'TypeScript', 'SQL'],
  },
  {
    label: 'AI / ML',
    items: [
      'Machine Learning',
      'Deep Learning',
      'Neural Networks',
      'Model Optimization',
      'Data Preprocessing',
      'scikit-learn',
    ],
  },
  {
    label: 'NLP & LLMs',
    items: [
      'LLMs',
      'RAG Pipelines',
      'LangChain',
      'Prompt Engineering',
      'Chatbot Development',
      'NLP Pipelines',
    ],
  },
  {
    label: 'Frameworks & Tools',
    items: ['React', 'Node.js', 'REST APIs', 'ROS', 'OpenCV', 'Firebase', 'Git', 'Docker', 'Pandas', 'NumPy'],
  },
  {
    label: 'Design',
    items: ['Figma', 'Canva', 'UI/UX'],
  },
];

export const navItems = [
  { label: 'Home', id: 'hero' },
  { label: 'About', id: 'about' },
  { label: 'Experience', id: 'experience' },
  { label: 'Work', id: 'work' },
  { label: 'Contact', id: 'contact' },
];
