import type { ResumeData } from '../context/ResumeContext';

export function exportAsPlainText(resume: ResumeData): string {
    const lines: string[] = [];

    // Name
    if (resume.name) {
        lines.push(resume.name.toUpperCase());
        lines.push('');
    }

    // Contact
    const contact = [resume.email, resume.phone, resume.location].filter(Boolean);
    if (contact.length > 0) {
        lines.push(contact.join(' | '));
        lines.push('');
    }

    // Links
    const links = [resume.github, resume.linkedin].filter(Boolean);
    if (links.length > 0) {
        lines.push(links.join(' | '));
        lines.push('');
    }

    // Summary
    if (resume.summary) {
        lines.push('SUMMARY');
        lines.push('-------');
        lines.push(resume.summary);
        lines.push('');
    }

    // Experience
    if (resume.experience.length > 0) {
        lines.push('EXPERIENCE');
        lines.push('----------');
        resume.experience.forEach(exp => {
            lines.push(`${exp.role} — ${exp.company}`);
            if (exp.startDate || exp.endDate) {
                lines.push(`${exp.startDate} to ${exp.endDate}`);
            }
            if (exp.description) {
                lines.push(exp.description);
            }
            lines.push('');
        });
    }

    // Education
    if (resume.education.length > 0) {
        lines.push('EDUCATION');
        lines.push('---------');
        resume.education.forEach(edu => {
            const degree = [edu.degree, edu.field].filter(Boolean).join(' in ');
            lines.push(degree || 'Education Entry');
            lines.push(edu.school);
            if (edu.startYear || edu.endYear) {
                lines.push(`${edu.startYear} - ${edu.endYear}`);
            }
            lines.push('');
        });
    }

    // Projects
    if (resume.projects.length > 0) {
        lines.push('PROJECTS');
        lines.push('--------');
        resume.projects.forEach(proj => {
            lines.push(proj.title);
            if (proj.techStack.length > 0) {
                lines.push(`Tech: ${proj.techStack.join(', ')}`);
            }
            if (proj.description) {
                lines.push(proj.description);
            }
            if (proj.liveUrl) {
                lines.push(`Live: ${proj.liveUrl}`);
            }
            if (proj.githubUrl) {
                lines.push(`GitHub: ${proj.githubUrl}`);
            }
            lines.push('');
        });
    }

    // Skills
    const { technical, soft, tools } = resume.skills;
    if (technical.length || soft.length || tools.length) {
        lines.push('SKILLS');
        lines.push('------');
        if (technical.length) lines.push(`Technical: ${technical.join(', ')}`);
        if (soft.length) lines.push(`Soft Skills: ${soft.join(', ')}`);
        if (tools.length) lines.push(`Tools: ${tools.join(', ')}`);
        lines.push('');
    }

    return lines.join('\n').trim();
}

export function validateResume(resume: ResumeData): { isValid: boolean; warnings: string[] } {
    const warnings: string[] = [];

    if (!resume.name.trim()) {
        warnings.push('Missing name');
    }

    const hasContent = resume.experience.length > 0 || resume.projects.length > 0;
    if (!hasContent) {
        warnings.push('No projects or experience added');
    }

    return {
        isValid: warnings.length === 0,
        warnings,
    };
}
