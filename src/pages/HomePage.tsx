import { useResume } from '../context/ResumeContext';
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { loadSample } = useResume();

    return (
        <div className="home-page">
            <section className="hero">
                <div className="hero-content">
                    <p className="hero-eyebrow">KodNest Premium · Project 3</p>
                    <h1 className="hero-title">Build a Resume<br />That Gets Read.</h1>
                    <p className="hero-subtitle">
                        A structured, intentional approach to crafting your professional story.
                        Clean typography. Calm design. Zero noise.
                    </p>
                    <div className="hero-actions">
                        <button
                            className="btn btn-primary hero-cta"
                            onClick={() => navigate('/builder')}
                        >
                            Start Building →
                        </button>
                        <button
                            className="btn btn-secondary hero-cta"
                            onClick={() => { loadSample(); navigate('/builder'); }}
                        >
                            Load Sample & Build
                        </button>
                    </div>
                </div>
            </section>

            <section className="features-strip">
                <div className="container">
                    <div className="features-grid">
                        <div className="feature-item">
                            <div className="feature-number">01</div>
                            <h3>Structured Sections</h3>
                            <p>Personal info, education, experience, projects, skills — all in clean, guided form fields.</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-number">02</div>
                            <h3>Live Preview</h3>
                            <p>Watch your resume take shape in real time as you fill each section. No surprises.</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-number">03</div>
                            <h3>Premium Layout</h3>
                            <p>Minimal black & white typography-first design. The kind recruiters actually read.</p>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
                .home-page {
                    min-height: calc(100vh - 56px - 80px);
                }
                .hero {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 70vh;
                    padding: var(--space-5) var(--space-3);
                    background: var(--color-white);
                    border-bottom: 1px solid var(--color-border);
                }
                .hero-content {
                    max-width: 640px;
                    text-align: center;
                }
                .hero-eyebrow {
                    font-size: var(--font-size-xs);
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    font-weight: 600;
                    color: var(--color-accent);
                    margin-bottom: var(--space-3);
                }
                .hero-title {
                    font-size: 56px;
                    letter-spacing: -0.03em;
                    line-height: 1.1;
                    margin-bottom: var(--space-3);
                }
                .hero-subtitle {
                    font-size: var(--font-size-lg);
                    color: rgba(17, 17, 17, 0.6);
                    line-height: var(--line-height-relaxed);
                    margin-bottom: var(--space-4);
                }
                .hero-actions {
                    display: flex;
                    gap: var(--space-2);
                    justify-content: center;
                }
                .hero-cta {
                    padding: 14px 32px;
                    font-size: var(--font-size-base);
                    height: auto;
                }
                .features-strip {
                    padding: var(--space-5) 0;
                    background: var(--color-bg);
                }
                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: var(--space-4);
                }
                .feature-item {
                    padding: var(--space-3);
                }
                .feature-number {
                    font-family: var(--font-heading);
                    font-size: var(--font-size-xl);
                    color: var(--color-accent);
                    opacity: 0.3;
                    margin-bottom: var(--space-1);
                }
                .feature-item h3 {
                    font-family: var(--font-body);
                    font-size: var(--font-size-base);
                    font-weight: 600;
                    margin-bottom: var(--space-1);
                }
                .feature-item p {
                    font-size: var(--font-size-sm);
                    color: rgba(17, 17, 17, 0.6);
                    line-height: var(--line-height-relaxed);
                }
                @media (max-width: 768px) {
                    .hero-title { font-size: 36px; }
                    .features-grid { grid-template-columns: 1fr; }
                    .hero-actions { flex-direction: column; }
                }
            `}</style>
        </div>
    );
};
