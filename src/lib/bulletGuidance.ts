const ACTION_VERBS = new Set([
    'built', 'developed', 'designed', 'implemented', 'led', 'improved',
    'created', 'optimized', 'automated', 'managed', 'launched', 'delivered',
    'engineered', 'deployed', 'integrated', 'refactored', 'architected',
    'maintained', 'established', 'reduced', 'increased', 'streamlined',
    'migrated', 'configured', 'resolved', 'collaborated', 'contributed',
    'analyzed', 'tested', 'wrote', 'shipped', 'spearheaded', 'mentored',
]);

const HAS_NUMBER = /\d+[%kKxX+]?|\b\d{2,}\b/;

export interface BulletGuidance {
    needsVerb: boolean;
    needsNumber: boolean;
}

export function analyzeBullet(text: string): BulletGuidance {
    const trimmed = text.trim();
    if (!trimmed) return { needsVerb: false, needsNumber: false };

    const firstWord = trimmed.split(/\s+/)[0].toLowerCase().replace(/[.,;:]+$/, '');
    const needsVerb = !ACTION_VERBS.has(firstWord);
    const needsNumber = !HAS_NUMBER.test(trimmed);

    return { needsVerb, needsNumber };
}
