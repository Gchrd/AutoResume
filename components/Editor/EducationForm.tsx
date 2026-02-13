import React from "react";
import { ResumeData, Education } from "@/data/resume";
import { GraduationCap, Plus, Trash2 } from "lucide-react";

interface Props {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
}

export default function EducationForm({ data, onChange }: Props) {
    const { education } = data;

    const handleAdd = () => {
        onChange({
            ...data,
            education: [
                ...education,
                {
                    institution: "New Institution",
                    degree: "Degree / Diploma",
                    period: "2023 - 2027",
                },
            ],
        });
    };

    const handleRemove = (index: number) => {
        const newEducation = [...education];
        newEducation.splice(index, 1);
        onChange({ ...data, education: newEducation });
    };

    const handleChange = (index: number, field: keyof Education, value: string) => {
        const newEducation = [...education];
        newEducation[index] = { ...newEducation[index], [field]: value };
        onChange({ ...data, education: newEducation });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                Education
            </h2>

            {education.map((edu, index) => (
                <div key={index} className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-4 relative group">
                    <button
                        onClick={() => handleRemove(index)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors"
                        title="Remove Education"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Institution</label>
                            <input
                                type="text"
                                value={edu.institution}
                                onChange={(e) => handleChange(index, "institution", e.target.value)}
                                className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none font-medium bg-white text-gray-900"
                                placeholder="University Name"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Year / Period</label>
                            <input
                                type="text"
                                value={edu.period}
                                onChange={(e) => handleChange(index, "period", e.target.value)}
                                className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
                                placeholder="2020 - 2024"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Degree / Qualification</label>
                        <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => handleChange(index, "degree", e.target.value)}
                            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none italic bg-white text-gray-900"
                            placeholder="Bachelor of Computer Science"
                        />
                    </div>
                </div>
            ))}

            <button
                onClick={handleAdd}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md flex justify-center items-center gap-2"
            >
                <Plus className="w-4 h-4" />
                Add Education
            </button>
        </div>
    );
}
