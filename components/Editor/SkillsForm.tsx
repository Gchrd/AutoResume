import React from "react";
import { ResumeData } from "@/data/resume";
import { Code, Languages, Award, Star } from "lucide-react";

interface Props {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
}

export default function SkillsForm({ data, onChange }: Props) {
    const { skills, languages, certifications, selfLearning } = data;

    const handleArrayChange = (
        field: "certifications" | "selfLearning",
        value: string
    ) => {
        // Split by new line to allow bulk paste/edit
        const items = value.split("\n").filter((item) => item.trim() !== "");
        onChange({ ...data, [field]: items });
    };

    const handleSkillsChange = (type: "hard" | "soft", value: string) => {
        const items = value.split(",").map(item => item.trim()).filter(item => item !== "");
        onChange({
            ...data,
            skills: {
                ...skills,
                [type]: items
            }
        });
    }

    const handleLanguageChange = (index: number, field: "language" | "proficiency", value: string) => {
        const newLanguages = [...languages];
        newLanguages[index] = { ...newLanguages[index], [field]: value };
        onChange({ ...data, languages: newLanguages });
    }

    const handleAddLanguage = () => {
        onChange({
            ...data,
            languages: [
                ...languages,
                { language: "New Language", proficiency: "Basic" },
            ],
        });
    };

    const handleRemoveLanguage = (index: number) => {
        const newLanguages = [...languages];
        newLanguages.splice(index, 1);
        onChange({ ...data, languages: newLanguages });
    }


    return (
        <div className="space-y-8">
            {/* Skills */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
                    <Code className="w-5 h-5 text-blue-600" />
                    Skills
                </h2>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hard Skills (comma separated)</label>
                    <textarea
                        value={skills.hard.join(", ")}
                        onChange={(e) => handleSkillsChange("hard", e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                        rows={3}
                        placeholder="Python, Java, React..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Soft Skills (comma separated)</label>
                    <textarea
                        value={skills.soft.join(", ")}
                        onChange={(e) => handleSkillsChange("soft", e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                        rows={3}
                        placeholder="Communication, Leadership..."
                    />
                </div>
            </div>

            {/* Languages */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
                    <Languages className="w-5 h-5 text-blue-600" />
                    Languages
                </h2>
                {languages.map((lang, index) => (
                    <div key={index} className="flex gap-2 items-center">
                        <input
                            type="text"
                            value={lang.language}
                            onChange={(e) => handleLanguageChange(index, "language", e.target.value)}
                            className="border border-gray-300 rounded p-2 flex-1 focus:ring-1 focus:ring-blue-500 outline-none bg-white text-gray-900"
                            placeholder="Language"
                        />
                        <input
                            type="text"
                            value={lang.proficiency}
                            onChange={(e) => handleLanguageChange(index, "proficiency", e.target.value)}
                            className="border border-gray-300 rounded p-2 flex-1 focus:ring-1 focus:ring-blue-500 outline-none bg-white text-gray-900"
                            placeholder="Proficiency"
                        />
                        <button onClick={() => handleRemoveLanguage(index)} className="text-red-500 hover:text-red-700 font-bold px-2">×</button>
                    </div>
                ))}
                <button onClick={handleAddLanguage} className="text-blue-600 text-sm font-medium hover:underline">+ Add Language</button>
            </div>

            {/* Certifications */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    Certifications (One per line)
                </h2>
                <textarea
                    value={certifications.join("\n")}
                    onChange={(e) => handleArrayChange("certifications", e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                    rows={5}
                    placeholder="Certification Name | Provider, Date"
                />
            </div>

            {/* Self Learning */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
                    <Star className="w-5 h-5 text-blue-600" />
                    Self Learning (One per line)
                </h2>
                <textarea
                    value={selfLearning.join("\n")}
                    onChange={(e) => handleArrayChange("selfLearning", e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                    rows={3}
                    placeholder="Course Name | Provider, Date"
                />
            </div>

        </div>
    );
}
