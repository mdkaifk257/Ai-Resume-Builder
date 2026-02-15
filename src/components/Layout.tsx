import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

export const TopBar: React.FC = () => {
    const location = useLocation();

    const links = [
        { to: '/builder', label: 'Builder' },
        { to: '/preview', label: 'Preview' },
        { to: '/proof', label: 'Proof' },
    ];

    return (
        <header className="top-bar">
            <div className="top-bar-content">
                <Link to="/" className="top-bar-left">AI Resume Builder</Link>
                <nav className="top-bar-nav">
                    {links.map(l => (
                        <Link
                            key={l.to}
                            to={l.to}
                            className={`nav-link ${location.pathname === l.to ? 'active' : ''}`}
                        >
                            {l.label}
                        </Link>
                    ))}
                </nav>
                <div className="top-bar-right">
                    <span className="top-bar-badge">Project 3</span>
                </div>
            </div>
        </header>
    );
};
