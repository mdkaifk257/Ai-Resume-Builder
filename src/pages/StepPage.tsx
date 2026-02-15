import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button, Card } from '../components/UI';
import { Upload, CheckCircle, ArrowRight, Lock } from 'lucide-react';

export interface StepConfig {
    number: number;
    slug: string;
    title: string;
    subtitle: string;
    promptText: string;
}

export const STEPS: StepConfig[] = [
    {
        number: 1,
        slug: '01-problem',
        title: 'Problem Statement',
        subtitle: 'Define the core problem this product solves.',
        promptText: 'Create a clear problem statement document for an AI Resume Builder. Define: who the target user is, what problem they face with current resume tools, and what a 10x better solution looks like. Include user pain points, current alternatives, and why AI changes everything.',
    },
    {
        number: 2,
        slug: '02-market',
        title: 'Market Research',
        subtitle: 'Analyze existing solutions and target users.',
        promptText: 'Research the AI resume builder market. Analyze top 5 competitors (e.g., Resumake, Kickresume, Novoresume, Zety, Resume.io). For each: list features, pricing, UI quality, AI capabilities, and gaps. Identify our differentiation strategy and target user persona.',
    },
    {
        number: 3,
        slug: '03-architecture',
        title: 'System Architecture',
        subtitle: 'Design the technical foundation.',
        promptText: 'Design the system architecture for an AI Resume Builder SaaS. Include: frontend framework choice, state management, API layer, AI integration points (OpenAI/Claude), PDF generation pipeline, template engine, and deployment strategy. Create a high-level architecture diagram.',
    },
    {
        number: 4,
        slug: '04-hld',
        title: 'High-Level Design',
        subtitle: 'Map modules, APIs, and data flow.',
        promptText: 'Create a high-level design document. Map out: module breakdown (Auth, Editor, AI Engine, Templates, Export, Analytics), API endpoints with request/response schemas, data flow diagrams, and database schema overview. Include component interaction patterns.',
    },
    {
        number: 5,
        slug: '05-lld',
        title: 'Low-Level Design',
        subtitle: 'Detail component specs and interfaces.',
        promptText: 'Write a low-level design spec. For each component: define props/interfaces, state management approach, rendering logic, API integration points, error handling, and edge cases. Include TypeScript interfaces for the Resume data model, AI prompt templates, and PDF generation pipeline.',
    },
    {
        number: 6,
        slug: '06-build',
        title: 'Build Phase',
        subtitle: 'Implement the core features.',
        promptText: 'Build the core AI Resume Builder UI. Implement: a multi-section resume editor (Personal Info, Experience, Education, Skills, Projects), an AI-powered content suggestion system, real-time preview panel, and 3 professional templates. Use React + TypeScript with clean component architecture.',
    },
    {
        number: 7,
        slug: '07-test',
        title: 'Testing',
        subtitle: 'Verify functionality and edge cases.',
        promptText: 'Create a comprehensive test plan. Include: unit tests for AI prompt generation, integration tests for the editor flow, edge case handling (empty fields, long text, special characters), cross-browser compatibility checks, accessibility audit (WCAG 2.1 AA), and performance benchmarks.',
    },
    {
        number: 8,
        slug: '08-ship',
        title: 'Ship',
        subtitle: 'Deploy and submit final artifacts.',
        promptText: 'Prepare the AI Resume Builder for production deployment. Create: deployment checklist, environment configuration, CI/CD pipeline setup, monitoring and error tracking integration, SEO meta tags, OG images, and a launch announcement draft. Include rollback strategy.',
    },
];

function isStepComplete(stepNumber: number): boolean {
    return !!localStorage.getItem(`rb_step_${stepNumber}_artifact`);
}

function getFirstIncompleteStep(): number {
    for (let i = 1; i <= 8; i++) {
        if (!isStepComplete(i)) return i;
    }
    return 9;
}

export const StepPage: React.FC<{ step: StepConfig }> = ({ step }) => {
    const navigate = useNavigate();
    const [artifactName, setArtifactName] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    // Gating: redirect to first incomplete step if trying to skip
    const firstIncomplete = getFirstIncompleteStep();
    if (step.number > firstIncomplete) {
        return <Navigate to={`/rb/${STEPS[firstIncomplete - 1].slug}`} replace />;
    }

    useEffect(() => {
        const stored = localStorage.getItem(`rb_step_${step.number}_artifact`);
        if (stored) {
            setArtifactName(stored);
            setIsComplete(true);
        } else {
            setArtifactName('');
            setIsComplete(false);
        }
    }, [step.number]);

    const handleMarkComplete = () => {
        if (!artifactName.trim()) return;
        localStorage.setItem(`rb_step_${step.number}_artifact`, artifactName.trim());
        setIsComplete(true);
        window.dispatchEvent(new Event('storage'));
    };

    const handleNext = () => {
        if (step.number < 8) {
            navigate(`/rb/${STEPS[step.number].slug}`);
        } else {
            navigate('/rb/proof');
        }
    };

    return (
        <div className="step-page">
            <Card title={`Step ${step.number} — ${step.title}`}>
                <p className="text-muted font-sm mb-3">{step.subtitle}</p>

                <div className="artifact-section">
                    <h4 className="font-sm font-bold mb-2" style={{ fontFamily: 'var(--font-body)' }}>
                        Artifact Upload
                    </h4>

                    {isComplete ? (
                        <div className="flex items-center gap-2 mb-3" style={{
                            padding: '12px 16px',
                            background: '#E6F4EA',
                            border: '1px solid rgba(74, 103, 65, 0.3)',
                            borderRadius: 'var(--radius)',
                        }}>
                            <CheckCircle size={18} style={{ color: 'var(--color-success)' }} />
                            <span className="font-sm" style={{ color: 'var(--color-success)', fontWeight: 600 }}>
                                {artifactName}
                            </span>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2 mb-3">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Enter artifact name (e.g., problem_statement_v1.pdf)"
                                    value={artifactName}
                                    onChange={(e) => setArtifactName(e.target.value)}
                                    style={{ fontSize: 'var(--font-size-sm)' }}
                                />
                            </div>
                            <Button
                                variant="primary"
                                onClick={handleMarkComplete}
                                disabled={!artifactName.trim()}
                            >
                                <Upload size={16} />
                                Mark Complete
                            </Button>
                        </div>
                    )}
                </div>
            </Card>

            <div className="flex justify-between items-center mt-3">
                {step.number > 1 ? (
                    <Button
                        variant="secondary"
                        onClick={() => navigate(`/rb/${STEPS[step.number - 2].slug}`)}
                    >
                        ← Previous
                    </Button>
                ) : (
                    <div />
                )}

                <Button
                    variant="primary"
                    onClick={handleNext}
                    disabled={!isComplete}
                >
                    {!isComplete && <Lock size={16} />}
                    {isComplete && <ArrowRight size={16} />}
                    {step.number < 8 ? 'Next Step' : 'View Proof'}
                </Button>
            </div>

            <style>{`
                .step-page { max-width: 100%; }
            `}</style>
        </div>
    );
};
