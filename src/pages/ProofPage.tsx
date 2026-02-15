import { useState, useEffect } from 'react';
import { Card, Button } from '../components/UI';
import { CheckCircle, Circle, Link as LinkIcon, ExternalLink, Copy, Check, Lock, Trophy } from 'lucide-react';
import { STEPS } from './StepPage';

const CHECKLIST_ITEMS = [
    "All form sections save to localStorage",
    "Live preview updates in real-time",
    "Template switching preserves data",
    "Color theme persists after refresh",
    "ATS score calculates correctly",
    "Score updates live on edit",
    "Export buttons work (copy/download)",
    "Empty states handled gracefully",
    "Mobile responsive layout works",
    "No console errors on any page"
];

export const ProofPage: React.FC = () => {
    const [checklist, setChecklist] = useState<string[]>([]);
    const [artifacts, setArtifacts] = useState({
        lovableUrl: '',
        githubUrl: '',
        deployedUrl: ''
    });
    const [stepStatus, setStepStatus] = useState<boolean[]>(new Array(8).fill(false));
    const [copied, setCopied] = useState(false);

    // Initialize state from local storage
    useEffect(() => {
        // Load checklist
        const savedChecklist = localStorage.getItem('rb_proof_checklist');
        if (savedChecklist) setChecklist(JSON.parse(savedChecklist));

        // Load artifacts
        const savedArtifacts = localStorage.getItem('rb_final_submission');
        if (savedArtifacts) setArtifacts(JSON.parse(savedArtifacts));

        // Load step status
        const status = STEPS.map(step => !!localStorage.getItem(`rb_step_${step.number}_artifact`));
        setStepStatus(status);
    }, []);

    // Save changes
    const toggleChecklist = (item: string) => {
        const newChecklist = checklist.includes(item)
            ? checklist.filter(i => i !== item)
            : [...checklist, item];
        setChecklist(newChecklist);
        localStorage.setItem('rb_proof_checklist', JSON.stringify(newChecklist));
    };

    const updateArtifact = (field: keyof typeof artifacts, value: string) => {
        const newArtifacts = { ...artifacts, [field]: value };
        setArtifacts(newArtifacts);
        localStorage.setItem('rb_final_submission', JSON.stringify(newArtifacts));
    };

    // Outcome Logic
    const allStepsComplete = stepStatus.every(s => s);
    const allChecklistPassed = checklist.length === CHECKLIST_ITEMS.length;
    const allArtifactsProvided = Object.values(artifacts).every(v => v.trim().length > 0 && (v.startsWith('http') || v.startsWith('https')));

    const isShipped = allStepsComplete && allChecklistPassed && allArtifactsProvided;

    const handleCopySubmission = () => {
        const text = `
------------------------------------------
AI Resume Builder — Final Submission

Lovable Project: ${artifacts.lovableUrl}
GitHub Repository: ${artifacts.githubUrl}
Live Deployment: ${artifacts.deployedUrl}

Core Capabilities:
- Structured resume builder
- Deterministic ATS scoring
- Template switching
- PDF export with clean formatting
- Persistence + validation checklist
------------------------------------------
`.trim();
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="proof-page-wrapper">
            <div className="proof-toolbar">
                <div className="container">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 style={{ fontSize: 'var(--font-size-lg)' }}>Proof of Work</h2>
                            <p className="text-muted font-sm" style={{ marginTop: '4px' }}>
                                Artifact collection and submission tracking.
                            </p>
                        </div>
                        <div className={`status-badge ${isShipped ? 'shipped' : 'progress'}`}>
                            {isShipped ? <Trophy size={14} /> : <div className="spinner-dot" />}
                            {isShipped ? 'Shipped Successfully' : 'In Progress'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container proof-content">
                {isShipped && (
                    <div className="success-banner">
                        <Trophy size={20} />
                        <span>Project 3 Shipped Successfully.</span>
                    </div>
                )}

                {/* 1. Step Overview */}
                <Card title="Step Completion">
                    <div className="steps-grid">
                        {STEPS.map((step, i) => (
                            <div key={step.number} className={`step-item ${stepStatus[i] ? 'complete' : ''}`}>
                                <div className="step-icon">
                                    {stepStatus[i] ? <CheckCircle size={14} /> : <Circle size={14} />}
                                </div>
                                <div className="step-info">
                                    <div className="step-num">Step {step.number}</div>
                                    <div className="step-title">{step.title}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* 2. Checklist */}
                <Card title="Pre-Flight Checklist">
                    <div className="checklist-grid">
                        {CHECKLIST_ITEMS.map((item, i) => (
                            <div
                                key={i}
                                className={`checklist-item ${checklist.includes(item) ? 'checked' : ''}`}
                                onClick={() => toggleChecklist(item)}
                            >
                                <div className="check-box">
                                    {checklist.includes(item) && <Check size={12} strokeWidth={3} />}
                                </div>
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                    <div className="checklist-progress">
                        {checklist.length}/{CHECKLIST_ITEMS.length} passed
                    </div>
                </Card>

                {/* 3. Artifacts */}
                <Card title="Submission Artifacts">
                    <div className="flex flex-col gap-4">
                        <div className="form-field">
                            <label className="text-sm font-bold mb-1 block text-muted">Lovable Project Link</label>
                            <div className="input-group">
                                <LinkIcon size={16} />
                                <input
                                    className="input"
                                    placeholder="https://lovable.dev/..."
                                    value={artifacts.lovableUrl}
                                    onChange={e => updateArtifact('lovableUrl', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-field">
                            <label className="text-sm font-bold mb-1 block text-muted">GitHub Repository</label>
                            <div className="input-group">
                                <ExternalLink size={16} />
                                <input
                                    className="input"
                                    placeholder="https://github.com/..."
                                    value={artifacts.githubUrl}
                                    onChange={e => updateArtifact('githubUrl', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-field">
                            <label className="text-sm font-bold mb-1 block text-muted">Deployed URL</label>
                            <div className="input-group">
                                <ExternalLink size={16} />
                                <input
                                    className="input"
                                    placeholder="https://..."
                                    value={artifacts.deployedUrl}
                                    onChange={e => updateArtifact('deployedUrl', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* 4. Final Submission */}
                <Card title="Final Export">
                    <p className="text-muted font-sm mb-4">
                        Copy your final submission details once all steps are complete and verified.
                    </p>
                    <Button
                        variant={isShipped ? 'primary' : 'secondary'}
                        onClick={handleCopySubmission}
                        disabled={!isShipped}
                        className="w-full justify-center"
                        style={{ height: '44px' }}
                    >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                        {copied ? 'Copied to Clipboard' : 'Copy Final Submission'}
                    </Button>
                    {!isShipped && (
                        <div className="locked-hint">
                            <Lock size={12} />
                            <span>Complete all steps, checklist items, and links to unlock.</span>
                        </div>
                    )}
                </Card>
            </div>

            <style>{`
                .proof-page-wrapper { padding-bottom: 100px; }
                .proof-toolbar {
                    padding: var(--space-3) 0;
                    background: var(--color-white);
                    border-bottom: 1px solid var(--color-border);
                    margin-bottom: var(--space-4);
                }
                .proof-content {
                    max-width: 600px;
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }
                
                .status-badge {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 12px;
                    border-radius: 99px;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .status-badge.progress { background: #F3F4F6; color: #6B7280; }
                .status-badge.shipped { background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0; }
                
                .spinner-dot {
                    width: 8px; height: 8px; background: #9CA3AF; border-radius: 50%;
                }

                .success-banner {
                    background: #ECFDF5;
                    border: 1px solid #10B981;
                    color: #065F46;
                    padding: 16px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-weight: 600;
                    margin-bottom: 8px;
                }

                .steps-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                }
                .step-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px;
                    border-radius: 6px;
                    background: #F9FAFB;
                    border: 1px solid transparent;
                    opacity: 0.6;
                }
                .step-item.complete {
                    opacity: 1;
                    background: #fff;
                    border-color: #E5E7EB;
                }
                .step-icon { color: #D1D5DB; }
                .step-item.complete .step-icon { color: #10B981; }
                .step-num { font-size: 10px; font-weight: 700; text-transform: uppercase; color: #9CA3AF; }
                .step-title { font-size: 12px; font-weight: 600; color: #374151; }

                .checklist-grid { display: flex; flex-direction: column; gap: 2px; }
                .checklist-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 10px;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: background 0.2s;
                    font-size: 13px;
                    color: #4B5563;
                }
                .checklist-item:hover { background: #F3F4F6; }
                .checklist-item.checked { color: #111; font-weight: 500; }
                .check-box {
                    width: 18px; height: 18px;
                    border: 2px solid #D1D5DB;
                    border-radius: 4px;
                    display: flex; align-items: center; justify-content: center;
                    transition: all 0.2s;
                }
                .checklist-item.checked .check-box {
                    background: #111;
                    border-color: #111;
                    color: #fff;
                }
                .checklist-progress {
                    margin-top: 12px;
                    text-align: right;
                    font-size: 11px;
                    color: #6B7280;
                    font-weight: 500;
                }

                .input-group { position: relative; }
                .input-group svg {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #9CA3AF;
                }
                .input-group input { padding-left: 38px; }

                .locked-hint {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    font-size: 11px;
                    color: #9CA3AF;
                    margin-top: 12px;
                }
            `}</style>
        </div>
    );
};
