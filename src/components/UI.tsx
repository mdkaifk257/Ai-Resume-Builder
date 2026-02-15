import './UI.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'warning';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', ...props }) => (
    <button className={`btn btn-${variant} ${className}`} {...props} />
);

export const Card: React.FC<{ children: React.ReactNode; title?: string; className?: string }> = ({ children, title, className = '' }) => (
    <div className={`card ${className}`}>
        {title && <h3 className="card-title">{title}</h3>}
        <div className="card-content">
            {children}
        </div>
    </div>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input className="input" {...props} />
);

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea className="input textarea" {...props} />
);

export const Badge: React.FC<{ children: React.ReactNode; status?: 'not-started' | 'in-progress' | 'shipped' }> = ({ children, status }) => (
    <span className={`badge ${status ? `badge-${status}` : ''}`}>{children}</span>
);
