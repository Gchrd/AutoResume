"use client";

import React, { useState, useEffect } from "react";
import CVPreview from "@/components/Preview/CVPreview";
import Link from "next/link";
import { initialResumeData as initialData, ResumeData } from "@/data/resume";
import {
    Download,
    LayoutTemplate,
    Menu,
    User,
    Briefcase,
    GraduationCap,
    Users,
    Code,
    Layers,
    Palette,
    Eye,
    Edit3,
    ArrowLeft,
    X
} from "lucide-react";

import PersonalDetailsForm from "@/components/Editor/PersonalDetailsForm";
import ExperienceForm from "@/components/Editor/ExperienceForm";
import EducationForm from "@/components/Editor/EducationForm";
import OrganizationForm from "@/components/Editor/OrganizationForm";
import SkillsForm from "@/components/Editor/SkillsForm";
import CustomSectionManager from "@/components/Editor/CustomSectionManager";

export default function BuilderPage() {
    const [data, setData] = useState<ResumeData>(initialData);
    const [activeTab, setActiveTab] = useState("personal");
    const [viewMode, setViewMode] = useState<"editor" | "preview">("editor"); // Mobile view mode

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem("cv-data");
        if (saved) {
            try {
                setData(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load saved data", e);
            }
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem("cv-data", JSON.stringify(data));
    }, [data]);

    const handlePrint = () => {
        window.print();
    };

    const menuItems = [
        { id: "personal", label: "Personal Info", icon: User },
        { id: "experience", label: "Experience", icon: Briefcase },
        { id: "education", label: "Education", icon: GraduationCap },
        { id: "organization", label: "Organization", icon: Users },
        { id: "skills", label: "Skills & Certs", icon: Code },
        { id: "custom", label: "Custom Sections", icon: Layers },
        { id: "settings", label: "Customize", icon: Palette },
    ];

    const renderActiveForm = () => {
        switch (activeTab) {
            case "personal":
                return <PersonalDetailsForm data={data} onChange={setData} />;
            case "experience":
                return <ExperienceForm data={data} onChange={setData} />;
            case "education":
                return <EducationForm data={data} onChange={setData} />;
            case "organization":
                return <OrganizationForm data={data} onChange={setData} />;
            case "skills":
                return <SkillsForm data={data} onChange={setData} />;
            case "custom":
                return <CustomSectionManager data={data} onChange={setData} />;
            case "settings":
                return (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
                            <Palette className="w-5 h-5 text-blue-600" />
                            Customization
                        </h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="color"
                                    value={data.settings?.accentColor || "#000000"}
                                    onChange={(e) => setData({ ...data, settings: { ...data.settings, accentColor: e.target.value } })}
                                    className="h-10 w-20 rounded cursor-pointer border-0 p-0 shadow-sm"
                                />
                                <span className="text-gray-500 text-sm font-mono">{data.settings?.accentColor || "#000000"}</span>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col h-screen overflow-hidden print:h-auto print:overflow-visible">
            {/* Top Bar */}
            <header className="bg-white border-b px-4 md:px-6 py-3 flex justify-between items-center shadow-sm z-10 print:hidden relative">
                <div className="flex items-center gap-3">
                    <Link
                        href="/"
                        className="text-gray-500 hover:text-gray-800 transition-colors p-1"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="font-bold text-lg md:text-xl flex items-center gap-2 text-gray-800">
                        <LayoutTemplate className="w-5 h-5 md:w-6 h-6 text-blue-600" />
                        <span className="hidden xs:inline">CV Builder</span>
                    </h1>
                </div>

                {/* Mobile View Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1 md:hidden">
                    <button
                        onClick={() => setViewMode("editor")}
                        className={`p-2 rounded-md ${viewMode === "editor" ? "bg-white shadow text-blue-600" : "text-gray-500"}`}
                    >
                        <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode("preview")}
                        className={`p-2 rounded-md ${viewMode === "preview" ? "bg-white shadow text-blue-600" : "text-gray-500"}`}
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                </div>

                <button
                    onClick={handlePrint}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium shadow-sm transition-colors text-sm md:text-base"
                >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download PDF</span>
                    <span className="sm:hidden">PDF</span>
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col md:flex-row overflow-hidden print:h-auto print:overflow-visible print:block mt-0">

                {/* Navigation: Horizontal Tabs on Mobile, Sidebar on Desktop */}
                <nav className={`bg-white border-b md:border-b-0 md:border-r flex-shrink-0 z-10 ${viewMode === 'preview' ? 'hidden md:block' : 'block'} print:hidden`}>
                    <div className="flex md:flex-col overflow-x-auto md:overflow-y-auto no-scrollbar md:w-64 p-2 md:p-4 gap-1">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${activeTab === item.id
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                <item.icon className={`w-4 h-4 md:w-5 h-5 ${activeTab === item.id ? "text-blue-600" : "text-gray-400"}`} />
                                {item.label}
                            </button>
                        ))}
                    </div>
                </nav>

                {/* Editor Area */}
                <div className={`flex-1 bg-white overflow-y-auto p-4 md:p-8 ${viewMode === 'preview' ? 'hidden md:block' : 'block'} print:hidden scrollbar-thin`}>
                    <div className="max-w-2xl mx-auto">
                        {renderActiveForm()}
                    </div>
                </div>

                {/* Mobile Preview Overlay Toggle Button */}
                {viewMode === 'editor' && (
                    <button
                        onClick={() => setViewMode("preview")}
                        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-2xl z-30 md:hidden flex items-center gap-2 font-bold"
                    >
                        <Eye className="w-6 h-6" />
                        Preview
                    </button>
                )}

                {/* Live Preview Area */}
                <div className={`
                    fixed inset-0 z-40 bg-gray-900 md:static md:z-0 md:bg-gray-500 md:flex-1 lg:flex-[1.5] md:flex md:items-start md:pt-8 md:justify-center
                    overflow-y-auto
                    ${viewMode === 'preview' ? 'flex flex-col items-center pt-16 md:pt-8' : 'hidden md:flex'}
                    print:static print:w-full print:h-auto print:bg-white print:p-0 print:block print:overflow-visible
                `}>
                    {/* Close preview button for mobile */}
                    {viewMode === 'preview' && (
                        <button
                            onClick={() => setViewMode("editor")}
                            className="fixed top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-2 text-white shadow-xl md:hidden z-50 transition-all"
                        >
                            <X className="w-8 h-8" />
                        </button>
                    )}

                    <div className="bg-white shadow-2xl w-[210mm] min-h-[297mm] transition-transform origin-top scale-[0.35] xs:scale-[0.45] sm:scale-[0.6] md:scale-75 lg:scale-90 xl:scale-100 print:scale-100 print:shadow-none mb-20 md:mb-10">
                        <CVPreview data={data} />
                    </div>
                </div>

            </main>
        </div>
    );
}
