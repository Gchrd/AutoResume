export interface Experience {
    title: string;
    role?: string;
    period?: string;
    company?: string;
    description?: string;
    achievements?: string[];
}

export interface Education {
    institution: string;
    degree: string;
    period: string;
}

export interface SkillSet {
    hard: string[];
    soft: string[];
}

export interface CustomSection {
    title: string;
    items: Experience[];
}

export interface ResumeData {
    personalInfo: {
        name: string;
        phone: string;
        email: string;
        linkedin: string;
        linkedinUrl: string;
        location: string;
        role: string;
    };
    summary: string;
    experiences: Experience[];
    education: Education[];
    organization: Experience[];
    certifications: string[];
    selfLearning: string[];
    skills: SkillSet;
    languages: { language: string; proficiency: string }[];
    customSections: CustomSection[];
    settings?: {
        accentColor: string;
    }
}

export const initialResumeData: ResumeData = {
    personalInfo: {
        name: "John Doe",
        role: "Software Engineer",
        phone: "+1 234 567 890",
        email: "john.doe@example.com",
        linkedin: "linkedin.com/in/johndoe",
        linkedinUrl: "https://linkedin.com/in/johndoe",
        location: "New York, USA",
    },
    summary:
        "Passionate Software Engineer with 3+ years of experience in building scalable web applications. Skilled in React, Next.js, and TypeScript. Proven track record of improving application performance and user experience. dedicated to writing clean, maintainable code and solving complex problems.",
    experiences: [
        {
            title: "Senior Frontend Developer",
            period: "2023 - Present",
            role: "Tech Corp Inc.",
            achievements: [
                "Led a team of 5 developers to rebuild the core product dashboard using Next.js, resulting in a 40% performance improvement.",
                "Implemented a new design system with Tailwind CSS, reducing development time for new features by 30%.",
                "Mentored junior developers and conducted code reviews to ensure high-quality code standards.",
            ],
        },
        {
            title: "Web Developer",
            period: "2021 - 2023",
            role: "Creative Agency",
            achievements: [
                "Developed responsive websites for 20+ clients using React and modern CSS frameworks.",
                "Optimized website load times, achieving a 95+ score on Google PageSpeed Insights.",
                "Collaborated with designers to translate Figma designs into pixel-perfect frontend code.",
            ],
        },
    ],
    education: [
        {
            institution: "State University",
            period: "2017 - 2021",
            degree: "Bachelor of Science in Computer Science",
        },
    ],
    organization: [
        {
            title: "University Coding Club",
            period: "2019 - 2021",
            role: "President",
            achievements: [
                "Organized 10+ coding workshops and hackathons, increasing member engagement by 50%.",
                "Managed club budget and secured sponsorship from local tech companies.",
            ],
        },
    ],
    skills: {
        hard: [
            "JavaScript (ES6+)",
            "TypeScript",
            "React",
            "Next.js",
            "Node.js",
            "Tailwind CSS",
            "Git",
        ],
        soft: [
            "Problem Solving",
            "Team Leadership",
            "Communication",
            "Time Management",
            "Adaptability",
        ],
    },
    certifications: [
        "AWS Certified Cloud Practitioner | Amazon Web Services, 2023",
        "Meta Frontend Developer Professional Certificate | Coursera, 2022",
    ],
    selfLearning: [
        "Advanced React Patterns | Frontend Masters, 2023",
        "System Design for Developers | Educative.io, 2022",
    ],
    languages: [
        { language: "English", proficiency: "Native" },
        { language: "Spanish", proficiency: "Intermediate" },
    ],
    customSections: [],
    settings: {
        accentColor: "#2563eb", // Default blue
    },
};
