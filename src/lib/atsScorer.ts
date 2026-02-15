import type { ResumeData } from '../context/ResumeContext';

export interface ATSResult {
    score: number;
    suggestions: string[];
}

const ACTION_VERBS = [
    'built', 'led', 'designed', 'improved', 'developed', 'managed', 'created', 'implemented', 'orchestrated', 'engineered'
];

export function computeATSScore(resume: ResumeData): ATSResult {
    let score = 0;
    const suggestions: string[] = [];

    // +10 if name provided
    if (resume.name.trim()) score += 10;
    else suggestions.push("Add your full name (+10)");

    // +10 if email provided
    if (resume.email.trim()) score += 10;
    else suggestions.push("Add a professional email (+10)");

    // +10 if summary > 50 chars
    if (resume.summary.trim().length > 50) score += 10;
    else suggestions.push("Expand summary to > 50 characters (+10)");

    // +10 if summary contains action verbs
    const summaryLower = resume.summary.toLowerCase();
    const hasVerb = ACTION_VERBS.some(verb => summaryLower.includes(verb));
    if (hasVerb) score += 10;
    else suggestions.push(`Use strong action verbs in summary (e.g., "${ACTION_VERBS.slice(0, 3).join(', ')}") (+10)`);

    // +15 if at least 1 experience entry with bullets (description length > 10)
    const hasExp = resume.experience.some(e => e.description.trim().length > 10);
    if (hasExp) score += 15;
    else suggestions.push("Add at least 1 detailed experience entry (+15)");

    // +10 if at least 1 education entry
    if (resume.education.length > 0) score += 10;
    else suggestions.push("Add education details (+10)");

    // +10 if at least 5 skills added
    const totalSkills = resume.skills.technical.length + resume.skills.soft.length + resume.skills.tools.length;
    if (totalSkills >= 5) score += 10;
    else suggestions.push(`Add more skills (need 5+, have ${totalSkills}) (+10)`);

    // +10 if at least 1 project added
    if (resume.projects.length > 0) score += 10;
    else suggestions.push("List at least 1 project (+10)");

    // +5 if phone provided
    if (resume.phone.trim()) score += 5;
    else suggestions.push("Add a phone number (+5)");

    // +5 if LinkedIn provided
    if (resume.linkedin.trim()) score += 5;
    else suggestions.push("Add LinkedIn profile (+5)");

    // +5 if GitHub provided
    if (resume.github.trim()) score += 5;
    else suggestions.push("Add GitHub profile (+5)");

    return {
        score: Math.min(score, 100),
        suggestions
    };
}
