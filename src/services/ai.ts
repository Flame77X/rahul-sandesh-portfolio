

export const askAI = async (query: string): Promise<string> => {
    // Simulate "thinking" time for realism
    await new Promise(resolve => setTimeout(resolve, 600));

    const lowerQuery = query.toLowerCase();

    // Local Pattern Matching Engine "Neural Node"
    // 1. Identity / About
    if (lowerQuery.includes('who') || lowerQuery.includes('about') || lowerQuery.includes('name') || lowerQuery.includes('rahul')) {
        return "Rahul Sandesh is an AI Architect & ML Engineer specialized in LLM Agents, RAG, and Robotics. Tagline: 'Architecting Intelligence'.";
    }

    // 2. Skills / Tech Stack
    if (lowerQuery.includes('skill') || lowerQuery.includes('stack') || lowerQuery.includes('tech') || lowerQuery.includes('program')) {
        return "Core Skills: Python, TypeScript, React, C++.\nAI/ML: Llama 3, RAG, LangChain, TensorFlow, DeepFace.\nRobotics: ROS, Sensor Fusion, Autonomous Navigation.\nBackend: FastAPI, Node.js.";
    }

    // 3. Projects
    if (lowerQuery.includes('project') || lowerQuery.includes('work') || lowerQuery.includes('made') || lowerQuery.includes('build')) {
        return "Key Projects:\n1. Multi-Modal AI Interviewer (Groq LPU)\n2. BloodSync AI Bot\n3. Doctus Grid: Advanced AI Chatbot Station. Features 4 distinct personas (Professor Pulsar, SciBot, GiggleBit, Explorer), image generation, and persistent memory. [Live: doctus-grid.vercel.app]\n4. Nexus Assistant\n5. ChromoShift AI (Colorization)\n6. ROS Mobile Robot";
    }

    // Specific: Doctus Grid details
    if (lowerQuery.includes('doctus') || lowerQuery.includes('grid') || lowerQuery.includes('pulsar') || lowerQuery.includes('scibot')) {
        return "Doctus Grid is an Advanced AI Chatbot Station.\n- 4 Personas: Professor Pulsar (Teacher), SciBot (Precise), GiggleBit (Funny), Explorer (Philosopher).\n- Features: Image Generation ('Draw...'), Persistent Memory, and Aurora UI.\n- Link: https://doctus-grid.vercel.app/";
    }

    // 4. Experience
    if (lowerQuery.includes('experience') || lowerQuery.includes('job') || lowerQuery.includes('intern') || lowerQuery.includes('company')) {
        return "Experience:\n- Product Development Intern @ Drizzla Digital Solutions (Leading R&D)\n- AI Engineering Intern @ Pramana AyurTech (Built RAG systems)\n- Founder @ Printing Enterprise";
    }

    // 5. Contact
    if (lowerQuery.includes('contact') || lowerQuery.includes('email') || lowerQuery.includes('reach') || lowerQuery.includes('hire')) {
        return "Contact Signal:\nEmail: rahulsandeshx3000@gmail.com\nLinkedIn: linkedin.com/in/rahul-sandesh-8a1786246";
    }

    // Default Fallback
    return "I am Neural Node v2.1. My logical cores are focused on Rahul's [skills], [projects], [experience], and [contact] info. What would you like to access?";
};
