import { createContext, useContext, useState, type ReactNode } from 'react';

export type TemplateName = 'classic' | 'modern' | 'minimal';
export type ThemeColor = string; // Hex code

const TEMPLATE_KEY = 'resumeTemplate';
const COLOR_KEY = 'resumeThemeColor';

export const THEME_COLORS = {
    teal: '#0d9488', // hsl(168, 60%, 40%) - roughly
    navy: '#234a97', // hsl(220, 60%, 35%)
    burgundy: '#8f1e40', // hsl(345, 60%, 35%)
    forest: '#1b7340', // hsl(150, 50%, 30%)
    charcoal: '#404040', // hsl(0, 0%, 25%)
};

interface TemplateContextType {
    template: TemplateName;
    setTemplate: (t: TemplateName) => void;
    themeColor: ThemeColor;
    setThemeColor: (c: ThemeColor) => void;
}

const TemplateContext = createContext<TemplateContextType | null>(null);

function loadTemplate(): TemplateName {
    try {
        const stored = localStorage.getItem(TEMPLATE_KEY);
        if (stored === 'classic' || stored === 'modern' || stored === 'minimal') return stored;
    } catch { /* ignore */ }
    return 'classic';
}

function loadThemeColor(): ThemeColor {
    return localStorage.getItem(COLOR_KEY) || THEME_COLORS.teal;
}

export const TemplateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [template, setTemplateState] = useState<TemplateName>(loadTemplate);
    const [themeColor, setThemeColorState] = useState<ThemeColor>(loadThemeColor);

    const setTemplate = (t: TemplateName) => {
        setTemplateState(t);
        localStorage.setItem(TEMPLATE_KEY, t);
    };

    const setThemeColor = (c: ThemeColor) => {
        setThemeColorState(c);
        localStorage.setItem(COLOR_KEY, c);
    };

    return (
        <TemplateContext.Provider value={{ template, setTemplate, themeColor, setThemeColor }}>
            {children}
        </TemplateContext.Provider>
    );
};

export const useTemplate = (): TemplateContextType => {
    const ctx = useContext(TemplateContext);
    if (!ctx) throw new Error('useTemplate must be used within TemplateProvider');
    return ctx;
};
