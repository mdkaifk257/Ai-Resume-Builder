import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react';

export interface Education {
    school: string;
    degree: string;
    field: string;
    startYear: string;
    endYear: string;
}

export interface Experience {
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface SkillSet {
    technical: string[];
    soft: string[];
    tools: string[];
}

export interface Project {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    liveUrl: string;
    githubUrl: string;
}

export interface ResumeData {
    name: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    education: Education[];
    experience: Experience[];
    projects: Project[];
    skills: SkillSet;
    github: string;
    linkedin: string;
}

const STORAGE_KEY = 'resumeBuilderData';

const EMPTY_RESUME: ResumeData = {
    name: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    education: [],
    experience: [],
    projects: [],
    skills: { technical: [], soft: [], tools: [] },
    github: '',
    linkedin: '',
};

const SAMPLE_RESUME: ResumeData = {
    name: 'Arjun Mehta',
    email: 'arjun.mehta@email.com',
    phone: '+91 98765 43210',
    location: 'Bangalore, India',
    summary: 'Full-stack developer with 2+ years of experience building scalable web applications using React, Node.js, and TypeScript. Passionate about clean architecture, developer tooling, and creating products that solve real problems.',
    education: [
        {
            school: 'Indian Institute of Technology, Bangalore',
            degree: 'B.Tech',
            field: 'Computer Science & Engineering',
            startYear: '2019',
            endYear: '2023',
        },
    ],
    experience: [
        {
            company: 'Razorpay',
            role: 'Software Engineer',
            startDate: 'Jul 2023',
            endDate: 'Present',
            description: 'Built and shipped payment checkout components used by 10M+ merchants. Led migration of legacy dashboard from Angular to React, reducing bundle size by 40%. Designed REST APIs for recurring payments module.',
        },
        {
            company: 'Flipkart',
            role: 'SDE Intern',
            startDate: 'Jan 2023',
            endDate: 'Jun 2023',
            description: 'Developed product recommendation engine using collaborative filtering. Improved search relevance by 15% through A/B tested ranking algorithm changes.',
        },
    ],
    projects: [
        {
            id: '1',
            title: 'DevBoard',
            description: 'A real-time collaborative code editor with integrated terminal and Git support. Built with WebSocket-based sync engine.',
            techStack: ['React', 'Node.js', 'WebSocket', 'Monaco Editor'],
            liveUrl: 'https://devboard.demo',
            githubUrl: 'https://github.com/arjun/devboard',
        },
        {
            id: '2',
            title: 'FinTrack',
            description: 'Personal finance tracker with automated expense categorization using ML. Supports UPI statement import and budget forecasting.',
            techStack: ['Next.js', 'Python', 'scikit-learn', 'PostgreSQL'],
            liveUrl: 'https://fintrack.demo',
            githubUrl: 'https://github.com/arjun/fintrack',
        },
    ],
    skills: {
        technical: ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS'],
        soft: ['Team Leadership', 'Problem Solving', 'Communication'],
        tools: ['Git', 'JIRA', 'Figma', 'VS Code'],
    },
    github: 'https://github.com/arjunmehta',
    linkedin: 'https://linkedin.com/in/arjunmehta',
};

function loadFromStorage(): ResumeData {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            // Migration check: if skills is string, convert to object
            if (typeof parsed.skills === 'string') {
                parsed.skills = {
                    technical: parsed.skills.split(',').map((s: string) => s.trim()).filter(Boolean),
                    soft: [],
                    tools: []
                };
            }
            // Migration check: if projects have 'name' instead of 'title'
            if (Array.isArray(parsed.projects)) {
                parsed.projects = parsed.projects.map((p: any) => ({
                    id: p.id || Math.random().toString(36).substr(2, 9),
                    title: p.title || p.name || '',
                    description: p.description || '',
                    techStack: Array.isArray(p.techStack) ? p.techStack : (p.tech ? p.tech.split(',').map((s: string) => s.trim()) : []),
                    liveUrl: p.liveUrl || p.link || '',
                    githubUrl: p.githubUrl || '',
                }));
            }
            return parsed as ResumeData;
        }
    } catch { /* ignore parse errors */ }
    return EMPTY_RESUME;
}

interface ResumeContextType {
    resume: ResumeData;
    setResume: React.Dispatch<React.SetStateAction<ResumeData>>;
    loadSample: () => void;
    clearResume: () => void;
}

const ResumeContext = createContext<ResumeContextType | null>(null);

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [resume, setResume] = useState<ResumeData>(loadFromStorage);
    const isInitial = useRef(true);

    // Auto-save to localStorage on every change (skip first render)
    useEffect(() => {
        if (isInitial.current) {
            isInitial.current = false;
            return;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
    }, [resume]);

    const loadSample = () => setResume(SAMPLE_RESUME);
    const clearResume = () => {
        setResume(EMPTY_RESUME);
        localStorage.removeItem(STORAGE_KEY);
    };

    return (
        <ResumeContext.Provider value={{ resume, setResume, loadSample, clearResume }}>
            {children}
        </ResumeContext.Provider>
    );
};

export const useResume = (): ResumeContextType => {
    const ctx = useContext(ResumeContext);
    if (!ctx) throw new Error('useResume must be used within ResumeProvider');
    return ctx;
};
