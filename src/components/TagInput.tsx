import React, { type KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
    tags: string[];
    onAdd: (tag: string) => void;
    onRemove: (tag: string) => void;
    placeholder?: string;
    className?: string;
}

export const TagInput: React.FC<TagInputProps> = ({ tags = [], onAdd, onRemove, placeholder, className }) => {
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const val = e.currentTarget.value.trim();
            if (val && !tags.includes(val)) {
                onAdd(val);
                e.currentTarget.value = '';
            }
        }
    };

    return (
        <div className={`tag-input-wrapper ${className || ''}`}>
            <div className="tags-list">
                {tags.map((tag, i) => (
                    <span key={i} className="tag-pill">
                        {tag}
                        <button onClick={() => onRemove(tag)} className="tag-remove">
                            <X size={12} />
                        </button>
                    </span>
                ))}
            </div>
            <input
                className="input tag-input-field"
                placeholder={placeholder || "Type and press Enter..."}
                onKeyDown={handleKeyDown}
                style={{ marginTop: tags.length > 0 ? '8px' : '0' }}
            />
            <style>{`
                .tag-input-wrapper {
                    display: flex;
                    flex-direction: column;
                }
                .tags-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                }
                .tag-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    background: #f3f4f6;
                    border: 1px solid #e5e7eb;
                    padding: 4px 8px;
                    border-radius: 99px;
                    font-size: 11px;
                    font-weight: 500;
                    color: #374151;
                }
                .tag-remove {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: none;
                    border: none;
                    padding: 2px;
                    cursor: pointer;
                    color: #9ca3af;
                    border-radius: 50%;
                }
                .tag-remove:hover {
                    background: #e5e7eb;
                    color: #ef4444;
                }
                .tag-input-field {
                    width: 100%;
                }
            `}</style>
        </div>
    );
};
