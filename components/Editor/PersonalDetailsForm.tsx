import React from "react";
import { ResumeData } from "@/data/resume";
import { User, AlignLeft, Phone, Mail, Linkedin, MapPin } from "lucide-react";

interface Props {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
}

export default function PersonalDetailsForm({ data, onChange }: Props) {
    const { personalInfo, summary } = data;

    const handleChange = (field: keyof typeof personalInfo, value: string) => {
        onChange({
            ...data,
            personalInfo: {
                ...data.personalInfo,
                [field]: value,
            },
        });
    };

    const handleSummaryChange = (value: string) => {
        onChange({
            ...data,
            summary: value,
        });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
                <User className="w-5 h-5 text-blue-600" />
                Personal Details
            </h2>

            <div className="grid gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        value={personalInfo.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                        placeholder="e.g. Richard Giansanto"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role / Title</label>
                    <input
                        type="text"
                        value={personalInfo.role}
                        onChange={(e) => handleChange("role", e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                        placeholder="e.g. Informatics Student"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <Phone className="w-3 h-3" /> Phone
                        </label>
                        <input
                            type="text"
                            value={personalInfo.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> Email
                        </label>
                        <input
                            type="text"
                            value={personalInfo.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <Linkedin className="w-3 h-3" /> LinkedIn Profile
                        </label>
                        <input
                            type="text"
                            value={personalInfo.linkedin}
                            onChange={(e) => {
                                const val = e.target.value;
                                // Logic: Display text is what represents the link (usually sans protocol)
                                // URL is the functional link
                                let display = val;
                                let url = val;

                                // If user pastes a full URL, strip protocol for display
                                if (val.startsWith('http')) {
                                    display = val.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
                                }

                                // If user types "linkedin.com/...", ensure URL has protocol
                                if (!val.startsWith('http')) {
                                    url = `https://${val}`;
                                }

                                // Special case: if it's just a username "johndoe", maybe we shouldn't assume. 
                                // But usually people put "linkedin.com/in/..." 
                                // Let's keep it simple: input updates 'linkedin' (display) directly if it's not a URL,
                                // but if it IS a URL, we clean it for display.

                                // Actually, safer approach for "no change" issue:
                                // precise control.

                                onChange({
                                    ...data,
                                    personalInfo: {
                                        ...data.personalInfo,
                                        linkedin: display, // This is what is shown in the box and on CV
                                        linkedinUrl: url   // This is the href
                                    },
                                });
                            }}
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                            placeholder="linkedin.com/in/username"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Paste your full URL or type <code>linkedin.com/in/...</code>. We'll format it for you.
                        </p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Location
                    </label>
                    <input
                        type="text"
                        value={personalInfo.location}
                        onChange={(e) => handleChange("location", e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                    />
                </div>
            </div>

            <div className="pt-4 border-t">
                <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2 mb-4">
                    <AlignLeft className="w-5 h-5 text-blue-600" />
                    Professional Summary
                </h3>
                <textarea
                    value={summary}
                    onChange={(e) => handleSummaryChange(e.target.value)}
                    rows={5}
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                    placeholder="Write a brief professional summary..."
                />
            </div>
        </div>
    );
}
