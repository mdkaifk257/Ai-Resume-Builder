import { useState } from 'react';
import { Button, Card, TextArea } from './UI';
import { Copy, Check, ExternalLink, CheckCircle, AlertTriangle, Camera } from 'lucide-react';

interface BuildPanelProps {
    stepNumber: number;
    promptText: string;
}

export const BuildPanel: React.FC<BuildPanelProps> = ({ stepNumber, promptText }) => {
    const [copied, setCopied] = useState(false);
    const [buildStatus, setBuildStatus] = useState<'idle' | 'worked' | 'error'>('idle');
    const [errorText, setErrorText] = useState('');

    const handleCopy = () => {
        navigator.clipboard.writeText(promptText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-3">
            <h3 className="serif">Build Panel</h3>
            <p className="font-sm text-muted">Step {stepNumber} — Copy and build in Lovable.</p>

            <Card title="Copy This Into Lovable">
                <TextArea
                    readOnly
                    value={promptText}
                    style={{ minHeight: '140px', fontSize: 'var(--font-size-sm)' }}
                />
                <div className="flex gap-1 mt-2">
                    <Button
                        variant="secondary"
                        className="flex-1"
                        onClick={handleCopy}
                    >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? 'Copied!' : 'Copy'}
                    </Button>
                </div>
            </Card>

            <a
                href="https://lovable.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-full"
                style={{ textDecoration: 'none', display: 'flex', gap: '8px', justifyContent: 'center' }}
            >
                <ExternalLink size={16} />
                Build in Lovable
            </a>

            <div className="flex flex-col gap-1">
                <p className="font-xs font-bold mb-1">Build Result</p>
                <div className="flex gap-1">
                    <Button
                        variant={buildStatus === 'worked' ? 'success' : 'secondary'}
                        className="flex-1"
                        onClick={() => setBuildStatus('worked')}
                        style={{ fontSize: 'var(--font-size-xs)', padding: '8px 12px', height: '36px' }}
                    >
                        <CheckCircle size={14} />
                        It Worked
                    </Button>
                    <Button
                        variant={buildStatus === 'error' ? 'warning' : 'secondary'}
                        className="flex-1"
                        onClick={() => setBuildStatus('error')}
                        style={{ fontSize: 'var(--font-size-xs)', padding: '8px 12px', height: '36px' }}
                    >
                        <AlertTriangle size={14} />
                        Error
                    </Button>
                    <Button
                        variant="secondary"
                        className="flex-1"
                        onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.click();
                        }}
                        style={{ fontSize: 'var(--font-size-xs)', padding: '8px 12px', height: '36px' }}
                    >
                        <Camera size={14} />
                        Screenshot
                    </Button>
                </div>
            </div>

            {buildStatus === 'error' && (
                <Card title="Paste Error Details">
                    <TextArea
                        placeholder="Paste the error message here..."
                        value={errorText}
                        onChange={(e) => setErrorText(e.target.value)}
                        style={{ minHeight: '100px', fontSize: 'var(--font-size-sm)' }}
                    />
                </Card>
            )}
        </div>
    );
};
