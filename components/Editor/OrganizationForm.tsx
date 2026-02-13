import React from "react";
import { ResumeData, Experience } from "@/data/resume";
import { Users, Plus, Trash2 } from "lucide-react";

interface Props {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
}

export default function OrganizationForm({ data, onChange }: Props) {
    const { organization } = data;

    const handleAdd = () => {
        onChange({
            ...data,
            organization: [
                ...organization,
                {
                    title: "New Organization",
                    company: "",
                    period: "Present",
                    role: "Member",
                    achievements: ["Achievement 1"],
                },
            ],
        });
    };

    const handleRemove = (index: number) => {
        const newOrg = [...organization];
        newOrg.splice(index, 1);
        onChange({ ...data, organization: newOrg });
    };

    const handleChange = (index: number, field: keyof Experience, value: any) => {
        const newOrg = [...organization];
        newOrg[index] = { ...newOrg[index], [field]: value };
        onChange({ ...data, organization: newOrg });
    };

    const handleAchievementChange = (
        orgIndex: number,
        achIndex: number,
        value: string
    ) => {
        const newOrg = [...organization];
        const newAchievements = [...(newOrg[orgIndex].achievements || [])];
        newAchievements[achIndex] = value;
        newOrg[orgIndex].achievements = newAchievements;
        onChange({ ...data, organization: newOrg });
    };

    const handleAddAchievement = (orgIndex: number) => {
        const newOrg = [...organization];
        const newAchievements = [...(newOrg[orgIndex].achievements || [])];
        newAchievements.push("New responsibility");
        newOrg[orgIndex].achievements = newAchievements;
        onChange({ ...data, organization: newOrg });
    };

    const handleRemoveAchievement = (orgIndex: number, achIndex: number) => {
        const newOrg = [...organization];
        const newAchievements = [...(newOrg[orgIndex].achievements || [])];
        newAchievements.splice(achIndex, 1);
        newOrg[orgIndex].achievements = newAchievements;
        onChange({ ...data, organization: newOrg });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
                <Users className="w-5 h-5 text-blue-600" />
                Organizational Experience
            </h2>

            {organization.map((org, index) => (
                <div key={index} className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-4 relative group">
                    <button
                        onClick={() => handleRemove(index)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove Experience"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Organization Name</label>
                            <input
                                type="text"
                                value={org.title}
                                onChange={(e) => handleChange(index, "title", e.target.value)}
                                className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none font-medium bg-white text-gray-900"
                                placeholder="Organization Name"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Year / Period</label>
                            <input
                                type="text"
                                value={org.period || ""}
                                onChange={(e) => handleChange(index, "period", e.target.value)}
                                className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
                                placeholder="2023 - Present"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Role / Position</label>
                        <input
                            type="text"
                            value={org.role || ""}
                            onChange={(e) => handleChange(index, "role", e.target.value)}
                            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none italic bg-white text-gray-900"
                            placeholder="Head of Division"
                        />
                    </div>

                    <div className="pt-2">
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Responsibilities / Achievements</label>
                        <div className="space-y-2">
                            {org.achievements?.map((ach, achIndex) => (
                                <div key={achIndex} className="flex gap-2">
                                    <textarea
                                        value={ach}
                                        onChange={(e) => handleAchievementChange(index, achIndex, e.target.value)}
                                        rows={2}
                                        className="w-full text-sm border border-gray-300 rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none resize-none bg-white text-gray-900"
                                    />
                                    <button
                                        onClick={() => handleRemoveAchievement(index, achIndex)}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => handleAddAchievement(index)}
                                className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1"
                            >
                                <Plus className="w-3 h-3" /> Add Responsibility
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            <button
                onClick={handleAdd}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md flex justify-center items-center gap-2"
            >
                <Plus className="w-4 h-4" />
                Add Organization
            </button>
        </div>
    );
}
