import { ResumeData } from "@/data/resume";
import React from 'react';

interface CVPreviewProps {
    data: ResumeData;
}

export default function CVPreview({ data }: CVPreviewProps) {
    const {
        personalInfo,
        summary,
        experiences,
        education,
        organization,
        certifications,
        selfLearning,
        skills,
        languages,
        customSections,
        settings
    } = data;

    const accentColor = settings?.accentColor || "#000000";

    return (
        <div className="bg-white text-black font-sans p-8 md:p-12 max-w-4xl mx-auto shadow-sm print:shadow-none print:max-w-none print:p-[20mm]">
            {/* Header */}
            <header className="text-center mb-8">
                <h1 className="text-3xl font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>
                    {personalInfo.name}
                </h1>
                {personalInfo.role && (
                    <p className="text-lg font-medium mb-2">{personalInfo.role}</p>
                )}
                <div className="text-sm space-y-1">
                    <p>
                        {personalInfo.phone} |{" "}
                        <a
                            href={`mailto:${personalInfo.email}`}
                            className="hover:underline"
                        >
                            {personalInfo.email}
                        </a>{" "}
                        |{" "}
                        <a
                            href={personalInfo.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                        >
                            {personalInfo.linkedin}
                        </a>
                    </p>
                    <p>{personalInfo.location}</p>
                </div>
            </header>

            {/* Summary */}
            <section className="mb-6 break-inside-avoid">
                <p className="text-justify leading-relaxed">{summary}</p>
            </section>

            {/* Experience */}
            <section className="mb-6">
                <h2 className="text-lg font-bold uppercase border-b-2 pb-1 mb-4 text-left" style={{ borderColor: accentColor, color: accentColor }}>
                    Experiences
                </h2>
                <div className="space-y-4">
                    {experiences.map((exp, index) => (
                        <div key={index} className="break-inside-avoid">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="font-bold text-md">{exp.title}</h3>
                                {exp.period && (
                                    <span className="text-sm font-semibold">{exp.period}</span>
                                )}
                            </div>
                            {exp.role && (
                                <p className="italic text-sm mb-2">{exp.role}</p>
                            )}
                            {exp.achievements && (
                                <ul className="list-disc list-outside ml-5 space-y-1 text-sm">
                                    {exp.achievements.map((achievement, i) => (
                                        <li key={i} className="text-justify">
                                            {achievement}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Education */}
            <section className="mb-6 break-inside-avoid">
                <h2 className="text-lg font-bold uppercase border-b-2 pb-1 mb-4 text-left" style={{ borderColor: accentColor, color: accentColor }}>
                    Education Level
                </h2>
                <div className="space-y-4">
                    {education.map((edu, index) => (
                        <div key={index}>
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="font-bold text-md">{edu.institution}</h3>
                                <span className="text-sm font-semibold">{edu.period}</span>
                            </div>
                            <p className="italic text-sm">{edu.degree}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Organization */}
            <section className="mb-6 break-inside-avoid">
                <h2 className="text-lg font-bold uppercase border-b-2 pb-1 mb-4 text-left" style={{ borderColor: accentColor, color: accentColor }}>
                    Organisational Experience
                </h2>
                <div className="space-y-4">
                    {organization.map((org, index) => (
                        <div key={index}>
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="font-bold text-md">{org.title}</h3>
                                <span className="text-sm font-semibold">{org.period}</span>
                            </div>
                            {org.role && (
                                <p className="italic text-sm mb-2">{org.role}</p>
                            )}
                            {org.achievements && (
                                <ul className="list-disc list-outside ml-5 space-y-1 text-sm">
                                    {org.achievements.map((achievement, i) => (
                                        <li key={i} className="text-justify">
                                            {achievement}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Certifications & Self Learning */}
            <section className="mb-6 break-inside-avoid">
                <h2 className="text-lg font-bold uppercase border-b-2 pb-1 mb-4 text-left" style={{ borderColor: accentColor, color: accentColor }}>
                    Certifications
                </h2>
                <div className="mb-4">
                    <h3 className="font-bold text-md mb-1 uppercase text-sm">AI & Machine Learning</h3>
                    <ul className="list-disc list-outside ml-5 space-y-1 text-sm">
                        {certifications.map((cert, index) => (
                            <li key={index}>{cert}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-md mb-1 uppercase text-sm">Self Learning</h3>
                    <ul className="list-disc list-outside ml-5 space-y-1 text-sm">
                        {selfLearning.map((learning, index) => (
                            <li key={index}>{learning}</li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Skills */}
            <section className="mb-6 break-inside-avoid">
                <h2 className="text-lg font-bold uppercase border-b-2 pb-1 mb-4 text-left" style={{ borderColor: accentColor, color: accentColor }}>
                    Skills
                </h2>
                <div className="text-sm space-y-1">
                    <p>
                        <span className="font-bold">Hard Skills:</span>{" "}
                        {skills.hard.join(", ")}
                    </p>
                    <p>
                        <span className="font-bold">Soft Skills:</span>{" "}
                        {skills.soft.join(", ")}
                    </p>
                </div>
            </section>

            {/* Languages */}
            <section className="mb-6 break-inside-avoid">
                <h2 className="text-lg font-bold uppercase border-b-2 pb-1 mb-4 text-left" style={{ borderColor: accentColor, color: accentColor }}>
                    Language
                </h2>
                <ul className="list-disc list-outside ml-5 space-y-1 text-sm">
                    {languages.map((lang, index) => (
                        <li key={index}>
                            {lang.language} - {lang.proficiency}
                        </li>
                    ))}
                </ul>
            </section>

            {/* Custom Sections */}
            {customSections?.map((section, index) => (
                <section key={index} className="mb-6 break-inside-avoid">
                    <h2 className="text-lg font-bold uppercase border-b-2 pb-1 mb-4 text-left" style={{ borderColor: accentColor, color: accentColor }}>
                        {section.title}
                    </h2>
                    <div className="space-y-4">
                        {section.items.map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-md">{item.title}</h3>
                                    <span className="text-sm font-semibold">{item.period}</span>
                                </div>
                                {item.role && (
                                    <p className="italic text-sm mb-2">{item.role}</p>
                                )}
                                {item.achievements && (
                                    <ul className="list-disc list-outside ml-5 space-y-1 text-sm">
                                        {item.achievements.map((achievement, j) => (
                                            <li key={j} className="text-justify">
                                                {achievement}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            ))}

        </div>
    );
}
