import React from "react";
import { ResumeData, CustomSection, Experience } from "@/data/resume";
import { Layers, Plus, Trash2 } from "lucide-react";

interface Props {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
}

export default function CustomSectionManager({ data, onChange }: Props) {
    const { customSections } = data;

    const handleAddSection = () => {
        onChange({
            ...data,
            customSections: [
                ...(customSections || []),
                {
                    title: "New Section",
                    items: [],
                },
            ],
        });
    };

    const handleRemoveSection = (index: number) => {
        const newSections = [...(customSections || [])];
        newSections.splice(index, 1);
        onChange({ ...data, customSections: newSections });
    };

    const handleSectionTitleChange = (index: number, title: string) => {
        const newSections = [...(customSections || [])];
        newSections[index] = { ...newSections[index], title };
        onChange({ ...data, customSections: newSections });
    };

    const handleAddItem = (sectionIndex: number) => {
        const newSections = [...(customSections || [])];
        const newItems = [...newSections[sectionIndex].items];
        newItems.push({
            title: "Title",
            company: "",
            period: "",
            role: "",
            achievements: [],
        });
        newSections[sectionIndex].items = newItems;
        onChange({ ...data, customSections: newSections });
    };

    const handleRemoveItem = (sectionIndex: number, itemIndex: number) => {
        const newSections = [...(customSections || [])];
        const newItems = [...newSections[sectionIndex].items];
        newItems.splice(itemIndex, 1);
        newSections[sectionIndex].items = newItems;
        onChange({ ...data, customSections: newSections });
    };

    const handleItemChange = (
        sectionIndex: number,
        itemIndex: number,
        field: keyof Experience,
        value: any
    ) => {
        const newSections = [...(customSections || [])];
        const newItems = [...newSections[sectionIndex].items];
        newItems[itemIndex] = { ...newItems[itemIndex], [field]: value };
        newSections[sectionIndex].items = newItems;
        onChange({ ...data, customSections: newSections });
    };

    const handleAchievementChange = (
        sectionIndex: number,
        itemIndex: number,
        achIndex: number,
        value: string
    ) => {
        const newSections = [...(customSections || [])];
        const newItems = [...newSections[sectionIndex].items];
        const newAchievements = [...(newItems[itemIndex].achievements || [])];
        newAchievements[achIndex] = value;
        newItems[itemIndex].achievements = newAchievements;
        newSections[sectionIndex].items = newItems;
        onChange({ ...data, customSections: newSections });
    }

    const handleAddAchievement = (sectionIndex: number, itemIndex: number) => {
        const newSections = [...(customSections || [])];
        const newItems = [...newSections[sectionIndex].items];
        const newAchievements = [...(newItems[itemIndex].achievements || [])];
        newAchievements.push("New detail");
        newItems[itemIndex].achievements = newAchievements;
        newSections[sectionIndex].items = newItems;
        onChange({ ...data, customSections: newSections });
    }
    const handleRemoveAchievement = (sectionIndex: number, itemIndex: number, achIndex: number) => {
        const newSections = [...(customSections || [])];
        const newItems = [...newSections[sectionIndex].items];
        const newAchievements = [...(newItems[itemIndex].achievements || [])];
        newAchievements.splice(achIndex, 1);
        newItems[itemIndex].achievements = newAchievements;
        newSections[sectionIndex].items = newItems;
        onChange({ ...data, customSections: newSections });
    }

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
                <Layers className="w-5 h-5 text-blue-600" />
                Custom Sections
            </h2>

            {customSections?.map((section, sectionIndex) => (
                <div key={sectionIndex} className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center mb-2 gap-3">
                        <input
                            type="text"
                            value={section.title}
                            onChange={(e) => handleSectionTitleChange(sectionIndex, e.target.value)}
                            className="text-lg font-bold border-b-2 border-gray-300 focus:border-blue-500 outline-none px-1 flex-1 text-gray-900"
                            placeholder="Section Title"
                        />
                        <button
                            onClick={() => handleRemoveSection(sectionIndex)}
                            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors shrink-0"
                            title="Remove Section"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-4 pl-2 border-l-2 border-gray-200">
                        {section.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="bg-gray-50 p-4 rounded border border-gray-200 relative group shadow-sm">
                                <button
                                    onClick={() => handleRemoveItem(sectionIndex, itemIndex)}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>

                                <div className="grid gap-3 mb-3 pr-6">
                                    <input
                                        type="text"
                                        value={item.title}
                                        onChange={(e) => handleItemChange(sectionIndex, itemIndex, "title", e.target.value)}
                                        className="font-medium bg-white border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                                        placeholder="Title / Role"
                                    />
                                    <input
                                        type="text"
                                        value={item.period || ""}
                                        onChange={(e) => handleItemChange(sectionIndex, itemIndex, "period", e.target.value)}
                                        className="text-sm bg-white border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                                        placeholder="Period / Date"
                                    />
                                    <input
                                        type="text"
                                        value={item.role || ""}
                                        onChange={(e) => handleItemChange(sectionIndex, itemIndex, "role", e.target.value)}
                                        className="text-sm italic bg-white border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                                        placeholder="Subtitle / Context"
                                    />
                                </div>

                                {/* Achievements */}
                                <div className="space-y-2">
                                    {item.achievements?.map((ach, achIndex) => (
                                        <div key={achIndex} className="flex gap-2 items-start">
                                            <textarea
                                                value={ach}
                                                onChange={(e) => handleAchievementChange(sectionIndex, itemIndex, achIndex, e.target.value)}
                                                className="w-full text-sm border border-gray-300 rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none resize-none bg-white text-gray-900"
                                                rows={2}
                                            />
                                            <button
                                                onClick={() => handleRemoveAchievement(sectionIndex, itemIndex, achIndex)}
                                                className="mt-2 text-gray-400 hover:text-red-500"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <button onClick={() => handleAddAchievement(sectionIndex, itemIndex)} className="text-xs text-blue-600 hover:underline font-medium">+ Add Detail Item</button>
                                </div>
                            </div>
                        ))}
                        <button onClick={() => handleAddItem(sectionIndex)} className="w-full py-2 border border-dashed border-gray-300 rounded text-sm text-gray-600 hover:text-blue-600 hover:border-blue-400 hover:bg-gray-50 transition-colors">
                            + Add Item to {section.title}
                        </button>
                    </div>
                </div>
            ))}

            <button
                onClick={handleAddSection}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md flex justify-center items-center gap-2"
            >
                <Plus className="w-4 h-4" />
                Add New Section
            </button>
        </div>
    );
}
