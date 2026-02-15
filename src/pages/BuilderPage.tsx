import { useState, useMemo } from 'react';
import { useResume, type Education, type Experience, type Project, type SkillSet } from '../context/ResumeContext';
import { useTemplate, type TemplateName } from '../context/TemplateContext';
import { computeATSScore } from '../lib/atsScorer';
import { analyzeBullet } from '../lib/bulletGuidance';
import { Button, Card } from '../components/UI';
import { TagInput } from '../components/TagInput';
import { Plus, Trash2, FileText, AlertCircle, Lightbulb, ChevronDown, ChevronUp, Link as LinkIcon, Github, Wand2 } from 'lucide-react';

const TEMPLATES: { id: TemplateName; label: string }[] = [
    { id: 'classic', label: 'Classic' },
    { id: 'modern', label: 'Modern' },
    { id: 'minimal', label: 'Minimal' },
];

/* Inline guidance hint */
const BulletHints: React.FC<{ text: string }> = ({ text }) => {
    const g = analyzeBullet(text);
    if (!text.trim() || (!g.needsVerb && !g.needsNumber)) return null;
    return (
        <div className="bullet-hints">
            {g.needsVerb && <span className="bullet-hint">Start with a strong action verb.</span>}
            {g.needsNumber && <span className="bullet-hint">Add measurable impact (numbers).</span>}
        </div>
    );
};

export const BuilderPage: React.FC = () => {
    const { resume, setResume, loadSample } = useResume();
    const { template, setTemplate } = useTemplate();
    const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
    const [isSuggesting, setIsSuggesting] = useState(false);

    const ats = useMemo(() => computeATSScore(resume), [resume]);

    /* Compute improvement suggestions (up to 3) */
    const improvements = useMemo(() => {
        const tips: string[] = [];
        if (resume.projects.length < 2) tips.push('Add at least 2 projects to showcase your work.');
        const allBullets = [...resume.experience.map(e => e.description), ...resume.projects.map(p => p.description)];
        const hasNumbers = allBullets.some(b => /\d+[%kKxX+]?|\b\d{2,}\b/.test(b));
        if (!hasNumbers) tips.push('Add measurable impact (numbers, %, etc.) in your descriptions.');
        const wordCount = resume.summary.trim().split(/\s+/).filter(Boolean).length;
        if (wordCount < 40) tips.push('Expand your professional summary to 40–120 words.');
        const skillCount = Object.values(resume.skills).flat().length;
        if (skillCount < 8) tips.push('List at least 8 skills for broader keyword coverage.');
        if (resume.experience.length === 0) tips.push('Add internship or project work experience.');
        return tips.slice(0, 3);
    }, [resume]);

    const update = (field: string, value: string) => {
        setResume(prev => ({ ...prev, [field]: value }));
    };

    const addEducation = () => {
        setResume(prev => ({
            ...prev,
            education: [...prev.education, { school: '', degree: '', field: '', startYear: '', endYear: '' }],
        }));
    };

    const updateEducation = (i: number, field: keyof Education, value: string) => {
        setResume(prev => {
            const edu = [...prev.education];
            edu[i] = { ...edu[i], [field]: value };
            return { ...prev, education: edu };
        });
    };

    const removeEducation = (i: number) => {
        setResume(prev => ({ ...prev, education: prev.education.filter((_, idx) => idx !== i) }));
    };

    const addExperience = () => {
        setResume(prev => ({
            ...prev,
            experience: [...prev.experience, { company: '', role: '', startDate: '', endDate: '', description: '' }],
        }));
    };

    const updateExperience = (i: number, field: keyof Experience, value: string) => {
        setResume(prev => {
            const exp = [...prev.experience];
            exp[i] = { ...exp[i], [field]: value };
            return { ...prev, experience: exp };
        });
    };

    const removeExperience = (i: number) => {
        setResume(prev => ({ ...prev, experience: prev.experience.filter((_, idx) => idx !== i) }));
    };

    // --- SKILLS LOGIC ---
    const addSkill = (category: keyof SkillSet, skill: string) => {
        setResume(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                [category]: [...prev.skills[category], skill]
            }
        }));
    };

    const removeSkill = (category: keyof SkillSet, skill: string) => {
        setResume(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                [category]: prev.skills[category].filter(s => s !== skill)
            }
        }));
    };

    const handleSuggestSkills = () => {
        setIsSuggesting(true);
        setTimeout(() => {
            setResume(prev => {
                const newSkills = { ...prev.skills };
                const suggestions = {
                    technical: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'GraphQL'],
                    soft: ['Team Leadership', 'Problem Solving'],
                    tools: ['Git', 'Docker', 'AWS']
                };
                (Object.keys(suggestions) as Array<keyof SkillSet>).forEach(cat => {
                    suggestions[cat].forEach(s => {
                        if (!newSkills[cat].includes(s)) newSkills[cat] = [...newSkills[cat], s];
                    });
                });
                return { ...prev, skills: newSkills };
            });
            setIsSuggesting(false);
        }, 1000);
    };

    // --- PROJECTS LOGIC ---
    const toggleProject = (id: string) => {
        setExpandedProjects(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const addProject = () => {
        const newProject: Project = {
            id: Date.now().toString(),
            title: '',
            description: '',
            techStack: [],
            liveUrl: '',
            githubUrl: ''
        };
        setResume(prev => ({
            ...prev,
            projects: [...prev.projects, newProject]
        }));
        setExpandedProjects(prev => new Set(prev).add(newProject.id));
    };

    const updateProject = (id: string, field: keyof Project, value: any) => {
        setResume(prev => ({
            ...prev,
            projects: prev.projects.map(p => p.id === id ? { ...p, [field]: value } : p)
        }));
    };

    const removeProject = (id: string) => {
        setResume(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
    };

    return (
        <div className="builder-page">
            <div className="builder-toolbar">
                <div className="container flex justify-between items-center">
                    <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
                        <h2 style={{ fontSize: 'var(--font-size-lg)' }}>Resume Builder</h2>
                        <div className="template-tabs">
                            {TEMPLATES.map(t => (
                                <button
                                    key={t.id}
                                    className={`template-tab ${template === t.id ? 'active' : ''}`}
                                    onClick={() => setTemplate(t.id)}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <Button variant="secondary" onClick={loadSample}>
                        <FileText size={16} />
                        Load Sample Data
                    </Button>
                </div>
            </div>

            <div className="builder-layout container">
                {/* LEFT: Form */}
                <div className="builder-form">
                    {/* Personal Info */}
                    <Card title="Personal Information">
                        <div className="form-grid">
                            <div className="form-field">
                                <label>Full Name</label>
                                <input className="input" placeholder="John Doe" value={resume.name} onChange={e => update('name', e.target.value)} />
                            </div>
                            <div className="form-field">
                                <label>Email</label>
                                <input className="input" placeholder="john@example.com" value={resume.email} onChange={e => update('email', e.target.value)} />
                            </div>
                            <div className="form-field">
                                <label>Phone</label>
                                <input className="input" placeholder="+91 98765 43210" value={resume.phone} onChange={e => update('phone', e.target.value)} />
                            </div>
                            <div className="form-field">
                                <label>Location</label>
                                <input className="input" placeholder="Bangalore, India" value={resume.location} onChange={e => update('location', e.target.value)} />
                            </div>
                        </div>
                    </Card>

                    {/* Summary */}
                    <Card title="Professional Summary">
                        <div className="form-field">
                            <textarea
                                className="input textarea"
                                placeholder="Write a 2-3 sentence summary of your professional background..."
                                value={resume.summary}
                                onChange={e => update('summary', e.target.value)}
                                style={{ minHeight: '100px' }}
                            />
                        </div>
                    </Card>

                    {/* Education */}
                    <Card title="Education">
                        {resume.education.map((edu, i) => (
                            <div key={i} className="entry-block">
                                <div className="entry-header">
                                    <span className="entry-num">#{i + 1}</span>
                                    <button className="icon-btn" onClick={() => removeEducation(i)}><Trash2 size={14} /></button>
                                </div>
                                <div className="form-grid">
                                    <div className="form-field">
                                        <label>School/University</label>
                                        <input className="input" placeholder="IIT Bangalore" value={edu.school} onChange={e => updateEducation(i, 'school', e.target.value)} />
                                    </div>
                                    <div className="form-field">
                                        <label>Degree</label>
                                        <input className="input" placeholder="B.Tech" value={edu.degree} onChange={e => updateEducation(i, 'degree', e.target.value)} />
                                    </div>
                                    <div className="form-field">
                                        <label>Field of Study</label>
                                        <input className="input" placeholder="Computer Science" value={edu.field} onChange={e => updateEducation(i, 'field', e.target.value)} />
                                    </div>
                                    <div className="form-field half">
                                        <label>Start Year</label>
                                        <input className="input" placeholder="2019" value={edu.startYear} onChange={e => updateEducation(i, 'startYear', e.target.value)} />
                                    </div>
                                    <div className="form-field half">
                                        <label>End Year</label>
                                        <input className="input" placeholder="2023" value={edu.endYear} onChange={e => updateEducation(i, 'endYear', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <Button variant="secondary" onClick={addEducation} className="w-full">
                            <Plus size={16} /> Add Education
                        </Button>
                    </Card>

                    {/* Experience */}
                    <Card title="Work Experience">
                        {resume.experience.map((exp, i) => (
                            <div key={i} className="entry-block">
                                <div className="entry-header">
                                    <span className="entry-num">#{i + 1}</span>
                                    <button className="icon-btn" onClick={() => removeExperience(i)}><Trash2 size={14} /></button>
                                </div>
                                <div className="form-grid">
                                    <div className="form-field">
                                        <label>Company</label>
                                        <input className="input" placeholder="Razorpay" value={exp.company} onChange={e => updateExperience(i, 'company', e.target.value)} />
                                    </div>
                                    <div className="form-field">
                                        <label>Role</label>
                                        <input className="input" placeholder="Software Engineer" value={exp.role} onChange={e => updateExperience(i, 'role', e.target.value)} />
                                    </div>
                                    <div className="form-field half">
                                        <label>Start Date</label>
                                        <input className="input" placeholder="Jul 2023" value={exp.startDate} onChange={e => updateExperience(i, 'startDate', e.target.value)} />
                                    </div>
                                    <div className="form-field half">
                                        <label>End Date</label>
                                        <input className="input" placeholder="Present" value={exp.endDate} onChange={e => updateExperience(i, 'endDate', e.target.value)} />
                                    </div>
                                    <div className="form-field full">
                                        <label>Description</label>
                                        <textarea className="input textarea" placeholder="Key achievements and responsibilities..." value={exp.description} onChange={e => updateExperience(i, 'description', e.target.value)} style={{ minHeight: '80px' }} />
                                        <BulletHints text={exp.description} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <Button variant="secondary" onClick={addExperience} className="w-full">
                            <Plus size={16} /> Add Experience
                        </Button>
                    </Card>

                    {/* Projects */}
                    <Card title="Projects">
                        {resume.projects.map((proj) => (
                            <div key={proj.id} className="entry-block">
                                <div className="entry-header" onClick={() => toggleProject(proj.id)} style={{ cursor: 'pointer' }}>
                                    <div className="flex items-center gap-2">
                                        {expandedProjects.has(proj.id) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        <span className="font-bold text-sm">{proj.title || '(Untitled Project)'}</span>
                                    </div>
                                    <button className="icon-btn" onClick={(e) => { e.stopPropagation(); removeProject(proj.id); }}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>

                                {expandedProjects.has(proj.id) && (
                                    <div className="form-grid mt-2">
                                        <div className="form-field">
                                            <label>Project Title</label>
                                            <input className="input" placeholder="DevBoard" value={proj.title} onChange={e => updateProject(proj.id, 'title', e.target.value)} />
                                        </div>
                                        <div className="form-field">
                                            <label>Tech Stack</label>
                                            <TagInput
                                                tags={proj.techStack}
                                                onAdd={(tag) => updateProject(proj.id, 'techStack', [...proj.techStack, tag])}
                                                onRemove={(tag) => updateProject(proj.id, 'techStack', proj.techStack.filter(t => t !== tag))}
                                                placeholder="React, AWS..."
                                            />
                                        </div>
                                        <div className="form-field full">
                                            <div className="flex justify-between">
                                                <label>Description</label>
                                                <span className="text-xs text-muted" style={{ fontSize: '10px' }}>
                                                    {proj.description.length}/200
                                                </span>
                                            </div>
                                            <textarea
                                                className="input textarea"
                                                placeholder="What does this project do?"
                                                value={proj.description}
                                                maxLength={200}
                                                onChange={e => updateProject(proj.id, 'description', e.target.value)}
                                                style={{ minHeight: '70px' }}
                                            />
                                            <BulletHints text={proj.description} />
                                        </div>
                                        <div className="form-field">
                                            <label>Live URL</label>
                                            <div className="input-icon-wrap">
                                                <LinkIcon size={14} className="input-icon" />
                                                <input className="input pl-8" placeholder="https://..." value={proj.liveUrl} onChange={e => updateProject(proj.id, 'liveUrl', e.target.value)} style={{ paddingLeft: '32px' }} />
                                            </div>
                                        </div>
                                        <div className="form-field">
                                            <label>GitHub URL</label>
                                            <div className="input-icon-wrap">
                                                <Github size={14} className="input-icon" />
                                                <input className="input pl-8" placeholder="https://..." value={proj.githubUrl} onChange={e => updateProject(proj.id, 'githubUrl', e.target.value)} style={{ paddingLeft: '32px' }} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        <Button variant="secondary" onClick={addProject} className="w-full">
                            <Plus size={16} /> Add Project
                        </Button>
                    </Card>

                    {/* Skills */}
                    <Card title="Skills">
                        <div className="flex justify-end mb-2">
                            <Button variant="secondary" onClick={handleSuggestSkills} disabled={isSuggesting} className="skills-suggest-btn">
                                <Wand2 size={14} className={isSuggesting ? 'animate-spin' : ''} />
                                {isSuggesting ? 'Adding...' : 'Suggest Skills'}
                            </Button>
                        </div>
                        <div className="skills-grid">
                            <div className="form-field full">
                                <label>Technical Skills ({resume.skills.technical.length})</label>
                                <TagInput
                                    tags={resume.skills.technical}
                                    onAdd={(tag) => addSkill('technical', tag)}
                                    onRemove={(tag) => removeSkill('technical', tag)}
                                    placeholder="React, Python, AWS..."
                                />
                            </div>
                            <div className="form-field full">
                                <label>Soft Skills ({resume.skills.soft.length})</label>
                                <TagInput
                                    tags={resume.skills.soft}
                                    onAdd={(tag) => addSkill('soft', tag)}
                                    onRemove={(tag) => removeSkill('soft', tag)}
                                    placeholder="Leadership, Communication..."
                                />
                            </div>
                            <div className="form-field full">
                                <label>Tools & Technologies ({resume.skills.tools.length})</label>
                                <TagInput
                                    tags={resume.skills.tools}
                                    onAdd={(tag) => addSkill('tools', tag)}
                                    onRemove={(tag) => removeSkill('tools', tag)}
                                    placeholder="Git, Jira, Docker..."
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Links */}
                    <Card title="Links">
                        <div className="form-grid">
                            <div className="form-field">
                                <label>GitHub</label>
                                <input className="input" placeholder="https://github.com/..." value={resume.github} onChange={e => update('github', e.target.value)} />
                            </div>
                            <div className="form-field">
                                <label>LinkedIn</label>
                                <input className="input" placeholder="https://linkedin.com/in/..." value={resume.linkedin} onChange={e => update('linkedin', e.target.value)} />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* RIGHT: ATS Score + Improvements + Live Preview */}
                <div className="builder-preview-col">
                    <div className="preview-sticky">
                        {/* ATS Score Meter */}
                        <div className="ats-panel">
                            <div className="ats-header">
                                <span className="ats-label">ATS Readiness Score</span>
                            </div>
                            <div className="ats-meter-wrap">
                                <svg viewBox="0 0 120 70" className="ats-arc">
                                    <path
                                        d="M 10 65 A 50 50 0 0 1 110 65"
                                        fill="none"
                                        stroke="#E5E7EB"
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d="M 10 65 A 50 50 0 0 1 110 65"
                                        fill="none"
                                        stroke={ats.score >= 70 ? '#1E8E3E' : ats.score >= 40 ? '#E8A317' : '#D93025'}
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                        strokeDasharray={`${(ats.score / 100) * 157} 157`}
                                    />
                                </svg>
                                <div className="ats-score-value">{ats.score}</div>
                                <div className="ats-score-max">/ 100</div>
                            </div>
                            {ats.suggestions.length > 0 && (
                                <div className="ats-suggestions">
                                    {ats.suggestions.slice(0, 3).map((s, i) => (
                                        <div key={i} className="ats-suggestion">
                                            <AlertCircle size={12} />
                                            <span>{s}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Top 3 Improvements */}
                        {improvements.length > 0 && (
                            <div className="improvements-panel">
                                <div className="improvements-header">
                                    <Lightbulb size={14} />
                                    <span>Top {improvements.length} Improvement{improvements.length > 1 ? 's' : ''}</span>
                                </div>
                                <div className="improvements-list">
                                    {improvements.map((tip, i) => (
                                        <div key={i} className="improvement-item">
                                            <span className="improvement-num">{i + 1}</span>
                                            <span>{tip}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="preview-label" style={{ marginTop: 'var(--space-3)' }}>Live Preview · {TEMPLATES.find(t => t.id === template)?.label}</div>
                        <div className={`preview-paper template-${template}`}>
                            <ResumePreviewMini resume={resume} />
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .builder-toolbar {
                    padding: var(--space-3) 0;
                    background: var(--color-white);
                    border-bottom: 1px solid var(--color-border);
                    margin-bottom: var(--space-4);
                }
                .template-tabs {
                    display: flex;
                    gap: 2px;
                    background: #F1F3F4;
                    padding: 2px;
                    border-radius: 6px;
                }
                .template-tab {
                    padding: 5px 14px;
                    font-size: 12px;
                    font-weight: 500;
                    color: rgba(17,17,17,0.5);
                    border-radius: 4px;
                    transition: var(--transition);
                }
                .template-tab:hover {
                    color: var(--color-text-primary);
                }
                .template-tab.active {
                    background: var(--color-white);
                    color: var(--color-accent);
                    font-weight: 600;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.06);
                }
                .builder-layout {
                    display: grid;
                    grid-template-columns: 1fr 380px;
                    gap: var(--space-4);
                    padding-bottom: 100px;
                }
                @media (max-width: 1024px) {
                    .builder-layout { grid-template-columns: 1fr; }
                }
                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-2);
                }
                .form-field {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .form-field.full { grid-column: 1 / -1; }
                .form-field label {
                    font-size: var(--font-size-xs);
                    font-weight: 600;
                    color: rgba(17,17,17,0.6);
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                }
                .entry-block {
                    padding: var(--space-2) 0;
                    border-bottom: 1px solid var(--color-border);
                    margin-bottom: var(--space-2);
                }
                .entry-block:last-of-type { margin-bottom: var(--space-3); }
                .entry-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--space-2);
                }
                .entry-num {
                    font-size: var(--font-size-xs);
                    font-weight: 700;
                    color: var(--color-accent);
                }
                .icon-btn {
                    padding: 6px;
                    color: rgba(17,17,17,0.4);
                    border-radius: var(--radius);
                }
                .icon-btn:hover {
                    background: rgba(139,0,0,0.05);
                    color: var(--color-accent);
                }

                /* Bullet guidance hints */
                .bullet-hints {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                    margin-top: 4px;
                }
                .bullet-hint {
                    font-size: 10px;
                    color: #E8A317;
                    background: rgba(232,163,23,0.08);
                    padding: 2px 8px;
                    border-radius: 3px;
                    font-weight: 500;
                }

                /* Preview column */
                .builder-preview-col { position: relative; }
                .preview-sticky { position: sticky; top: 80px; }
                .preview-label {
                    font-size: var(--font-size-xs);
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: rgba(17,17,17,0.4);
                    margin-bottom: var(--space-2);
                }
                .preview-paper {
                    background: white;
                    border: 1px solid var(--color-border);
                    padding: 24px;
                    min-height: 500px;
                    font-size: 10px;
                    line-height: 1.5;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
                }

                /* Template: Classic */
                .template-classic .rp-name { font-family: var(--font-heading); color: var(--theme-color); }
                .template-classic .rp-section-title { border-bottom: 1px solid var(--theme-color); color: var(--theme-color); }

                /* Template: Modern */
                .template-modern { padding: 20px 24px; }
                .template-modern .rp-name { font-family: var(--font-body); letter-spacing: 0.08em; text-transform: uppercase; font-size: 15px; color: var(--theme-color); }
                .template-modern .rp-section-title { border-bottom: none; border-left: 3px solid var(--theme-color); padding-left: 8px; padding-bottom: 0; margin-bottom: 8px; color: var(--theme-color); }

                /* Template: Minimal */
                .template-minimal { padding: 20px; border: none; box-shadow: none; background: #FAFAFA; }
                .template-minimal .rp-name { font-size: 14px; font-family: var(--font-body); font-weight: 600; color: #111; }
                .template-minimal .rp-section-title { font-size: 8px; letter-spacing: 0.15em; border-bottom: none; color: #999; margin-bottom: 4px; }
                .template-minimal .rp-contact { font-size: 8px; }

                /* Mini preview typography */
                .rp-name { font-size: 16px; font-weight: 700; font-family: var(--font-heading); margin-bottom: 2px; }
                .rp-contact { font-size: 9px; color: #555; margin-bottom: 8px; }
                .rp-section { margin-bottom: 10px; }
                .rp-section-title {
                    font-size: 9px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    border-bottom: 1px solid var(--theme-color);
                    padding-bottom: 2px;
                    margin-bottom: 6px;
                    color: var(--theme-color);
                }
                .rp-item-title { font-weight: 600; font-size: 10px; }
                .rp-item-meta { font-size: 9px; color: #666; }
                .rp-item-desc { font-size: 9px; color: #333; margin-top: 2px; }
                .rp-skills { font-size: 9px; }
                .rp-placeholder {
                    color: rgba(17,17,17,0.15);
                    font-style: italic;
                    text-align: center;
                    padding: 40px 0;
                    font-size: 11px;
                }

                /* ATS Panel */
                .ats-panel {
                    background: var(--color-white);
                    border: 1px solid var(--color-border);
                    padding: 20px;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
                }
                .ats-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                }
                .ats-label {
                    font-size: 10px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: rgba(17,17,17,0.45);
                }
                .ats-meter-wrap {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 8px 0 0;
                }
                .ats-arc { width: 140px; height: 80px; }
                .ats-score-value {
                    font-family: var(--font-heading);
                    font-size: 32px;
                    font-weight: 700;
                    margin-top: -20px;
                    color: var(--color-text-primary);
                }
                .ats-score-max { font-size: 11px; color: rgba(17,17,17,0.3); margin-top: -2px; }
                .ats-suggestions {
                    margin-top: 16px;
                    border-top: 1px solid var(--color-border);
                    padding-top: 12px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .ats-suggestion {
                    display: flex;
                    align-items: flex-start;
                    gap: 6px;
                    font-size: 11px;
                    color: rgba(17,17,17,0.6);
                    line-height: 1.4;
                }
                .ats-suggestion svg { flex-shrink: 0; margin-top: 1px; color: #E8A317; }

                /* Improvements Panel */
                .improvements-panel {
                    background: var(--color-white);
                    border: 1px solid var(--color-border);
                    border-top: none;
                    padding: 16px 20px;
                }
                .improvements-header {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 10px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: rgba(17,17,17,0.45);
                    margin-bottom: 10px;
                }
                .improvements-header svg { color: var(--color-accent); }
                .improvements-list {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .improvement-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 8px;
                    font-size: 11px;
                    color: rgba(17,17,17,0.6);
                    line-height: 1.4;
                }
                .improvement-num {
                    width: 18px;
                    height: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    font-size: 10px;
                    font-weight: 700;
                    border-radius: 50%;
                    background: rgba(139,0,0,0.06);
                    color: var(--color-accent);
                }

                .input-icon-wrap { position: relative; width: 100%; }
                .input-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #9ca3af; }

                .skills-suggest-btn {
                    font-size: 11px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: var(--color-accent);
                }
                .rp-skill-row { font-size: 9px; margin-bottom: 2px; }
                .rp-skill-label { font-weight: 700; color: #555; margin-right: 4px; }
            `}</style>
        </div>
    );
};

/* Mini resume preview rendered in the right column */
const ResumePreviewMini: React.FC<{ resume: ReturnType<typeof useResume>['resume'] }> = ({ resume }) => {
    const { themeColor } = useTemplate();
    const isEmpty = !resume.name && !resume.email && !resume.summary && resume.education.length === 0 && resume.experience.length === 0;
    const { technical, soft, tools } = resume.skills;
    const hasSkills = technical.length > 0 || soft.length > 0 || tools.length > 0;

    if (isEmpty) {
        return <div className="rp-placeholder">Start filling the form to see<br />your resume take shape here.</div>;
    }

    return (
        <div style={{ '--theme-color': themeColor } as React.CSSProperties}>
            {resume.name && <div className="rp-name">{resume.name}</div>}
            {(resume.email || resume.phone || resume.location) && (
                <div className="rp-contact">
                    {[resume.email, resume.phone, resume.location].filter(Boolean).join(' · ')}
                </div>
            )}

            {resume.summary && (
                <div className="rp-section">
                    <div className="rp-section-title">Summary</div>
                    <div className="rp-item-desc">{resume.summary}</div>
                </div>
            )}

            {resume.education.length > 0 && (
                <div className="rp-section">
                    <div className="rp-section-title">Education</div>
                    {resume.education.map((edu, i) => (
                        <div key={i} style={{ marginBottom: '4px' }}>
                            <div className="rp-item-title">{edu.degree} {edu.field && `in ${edu.field}`}</div>
                            <div className="rp-item-meta">{edu.school} {edu.startYear && `· ${edu.startYear}–${edu.endYear}`}</div>
                        </div>
                    ))}
                </div>
            )}

            {resume.experience.length > 0 && (
                <div className="rp-section">
                    <div className="rp-section-title">Experience</div>
                    {resume.experience.map((exp, i) => (
                        <div key={i} style={{ marginBottom: '6px' }}>
                            <div className="rp-item-title">{exp.role}</div>
                            <div className="rp-item-meta">{exp.company} {exp.startDate && `· ${exp.startDate}–${exp.endDate}`}</div>
                            {exp.description && <div className="rp-item-desc">{exp.description}</div>}
                        </div>
                    ))}
                </div>
            )}

            {resume.projects.length > 0 && (
                <div className="rp-section">
                    <div className="rp-section-title">Projects</div>
                    {resume.projects.map((proj) => (
                        <div key={proj.id} style={{ marginBottom: '8px', border: '1px solid #eee', padding: '8px', borderRadius: '4px' }}>
                            <div className="flex justify-between items-start">
                                <div className="rp-item-title">{proj.title}</div>
                                <div className="flex gap-1">
                                    {proj.liveUrl && <LinkIcon size={8} color="#666" />}
                                    {proj.githubUrl && <Github size={8} color="#666" />}
                                </div>
                            </div>
                            {proj.techStack.length > 0 && (
                                <div className="rp-item-meta" style={{ marginTop: '2px' }}>
                                    {proj.techStack.join(' · ')}
                                </div>
                            )}
                            {proj.description && <div className="rp-item-desc">{proj.description}</div>}
                        </div>
                    ))}
                </div>
            )}

            {hasSkills && (
                <div className="rp-section">
                    <div className="rp-section-title">Skills</div>
                    <div className="rp-skills-group">
                        {technical.length > 0 && (
                            <div className="rp-skill-row">
                                <span className="rp-skill-label">Tech:</span> {technical.join(', ')}
                            </div>
                        )}
                        {tools.length > 0 && (
                            <div className="rp-skill-row">
                                <span className="rp-skill-label">Tools:</span> {tools.join(', ')}
                            </div>
                        )}
                        {soft.length > 0 && (
                            <div className="rp-skill-row">
                                <span className="rp-skill-label">Soft:</span> {soft.join(', ')}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {(resume.github || resume.linkedin) && (
                <div className="rp-section">
                    <div className="rp-section-title">Links</div>
                    <div className="rp-skills">
                        {resume.github && <div>GitHub: {resume.github}</div>}
                        {resume.linkedin && <div>LinkedIn: {resume.linkedin}</div>}
                    </div>
                </div>
            )}
        </div>
    );
};
