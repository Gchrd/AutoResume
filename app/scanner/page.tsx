'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, Download, Loader2, ArrowLeft, Table, AlertCircle, Briefcase, CheckCircle, XCircle, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { ParsedCVRow, convertToCSV, downloadCSV } from '@/lib/csvUtils';

interface JobMatchResult {
    matchPercentage: number;
    cosineSimilarity: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    method: string;
    methodDescription: string;
}

export default function ScannerPage() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<ParsedCVRow[] | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Job Match state
    const [showJobMatch, setShowJobMatch] = useState(false);
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [matchLoading, setMatchLoading] = useState(false);
    const [matchError, setMatchError] = useState<string | null>(null);
    const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null);
    const [showExtractedData, setShowExtractedData] = useState(true);

    const handleFileSelect = (selectedFile: File) => {
        if (selectedFile.type !== 'application/pdf') {
            setError('Only PDF files are supported.');
            return;
        }
        setFile(selectedFile);
        setError(null);
        setResults(null);
        setMatchResult(null);
        setShowJobMatch(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) handleFileSelect(droppedFile);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleScan = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);
        setResults(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/parse-cv', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to parse CV');
            }

            setResults(data.data);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Something went wrong';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleJobMatch = async () => {
        if (!results || !jobTitle.trim() || !jobDescription.trim()) return;

        setMatchLoading(true);
        setMatchError(null);
        setMatchResult(null);

        try {
            const response = await fetch('/api/match-job', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cvData: results,
                    jobTitle: jobTitle.trim(),
                    jobDescription: jobDescription.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to analyze job match');
            }

            setMatchResult(data.data);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Something went wrong';
            setMatchError(message);
        } finally {
            setMatchLoading(false);
        }
    };

    const handleDownloadCSV = () => {
        if (!results) return;
        const csv = convertToCSV(results);
        const filename = file ? file.name.replace('.pdf', '_data.csv') : 'cv_data.csv';
        downloadCSV(csv, filename);
    };

    const handleReset = () => {
        setFile(null);
        setResults(null);
        setError(null);
        setMatchResult(null);
        setShowJobMatch(false);
        setJobTitle('');
        setJobDescription('');
        setMatchError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const getMatchColor = (pct: number) => {
        if (pct >= 70) return 'text-green-600';
        if (pct >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getMatchBg = (pct: number) => {
        if (pct >= 70) return 'bg-green-500';
        if (pct >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getMatchRingColor = (pct: number) => {
        if (pct >= 70) return 'border-green-500';
        if (pct >= 50) return 'border-yellow-500';
        return 'border-red-500';
    };

    // Group results by section for display
    const groupedResults = results?.reduce((acc, row) => {
        if (!acc[row.section]) acc[row.section] = [];
        acc[row.section].push(row);
        return acc;
    }, {} as Record<string, ParsedCVRow[]>);

    return (
        <main className="min-h-screen bg-gray-50 text-gray-900">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="text-gray-500 hover:text-gray-800 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <Table className="w-5 h-5 text-blue-600" />
                            CV Scanner
                        </h1>
                    </div>
                    {results && (
                        <button
                            onClick={handleDownloadCSV}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium cursor-pointer"
                        >
                            <Download className="w-4 h-4" />
                            Download CSV
                        </button>
                    )}
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-6 py-8">
                {/* Upload Area */}
                {!results && (
                    <div className="mb-8">
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${file
                                ? 'border-blue-400 bg-blue-50'
                                : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'
                                }`}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) handleFileSelect(f);
                                }}
                            />

                            {file ? (
                                <div className="flex flex-col items-center gap-3">
                                    <FileText className="w-12 h-12 text-blue-600" />
                                    <p className="text-lg font-medium text-gray-800">{file.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {(file.size / 1024).toFixed(1)} KB — Click or drag to replace
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <Upload className="w-12 h-12 text-gray-400" />
                                    <p className="text-lg font-medium text-gray-600">
                                        Drop your PDF CV here, or click to browse
                                    </p>
                                    <p className="text-sm text-gray-400">Only PDF files are supported</p>
                                </div>
                            )}
                        </div>

                        {/* Scan Button */}
                        {file && (
                            <div className="mt-6 flex justify-center gap-3">
                                <button
                                    onClick={handleScan}
                                    disabled={loading}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg transition-colors font-medium cursor-pointer disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Scanning with AI...
                                        </>
                                    ) : (
                                        <>
                                            <Table className="w-5 h-5" />
                                            Scan CV
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handleReset}
                                    disabled={loading}
                                    className="px-6 py-3 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors font-medium cursor-pointer disabled:cursor-not-allowed"
                                >
                                    Reset
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                        <div>
                            <p className="font-medium text-red-800">Error</p>
                            <p className="text-sm text-red-600 mt-1">{error}</p>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-16">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-700">Analyzing your CV...</p>
                        <p className="text-sm text-gray-500 mt-1">This usually takes 5-10 seconds</p>
                    </div>
                )}

                {/* Results Section */}
                {results && groupedResults && (
                    <div>
                        {/* Top Action Bar */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">Extracted Data</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {results.length} fields found across {Object.keys(groupedResults).length} sections
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                {!showJobMatch && (
                                    <button
                                        onClick={() => setShowJobMatch(true)}
                                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium cursor-pointer"
                                    >
                                        <Briefcase className="w-4 h-4" />
                                        Check Job Match
                                    </button>
                                )}
                                <button
                                    onClick={handleReset}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                                >
                                    Scan another CV
                                </button>
                            </div>
                        </div>

                        {/* Job Match Section */}
                        {showJobMatch && (
                            <div className="mb-8 bg-white rounded-xl border border-purple-200 overflow-hidden">
                                <div className="bg-purple-50 px-6 py-4 border-b border-purple-200">
                                    <h3 className="font-bold text-purple-800 flex items-center gap-2">
                                        <Briefcase className="w-5 h-5" />
                                        Job Match Analysis
                                    </h3>
                                    <p className="text-sm text-purple-600 mt-1">
                                        Enter a job title and description to see how well this CV matches
                                    </p>
                                </div>

                                <div className="p-6">
                                    {/* Job Input Form */}
                                    {!matchResult && (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Job Title
                                                </label>
                                                <input
                                                    type="text"
                                                    value={jobTitle}
                                                    onChange={(e) => setJobTitle(e.target.value)}
                                                    placeholder="e.g. Backend Developer, Data Analyst, UI/UX Designer..."
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm"
                                                    disabled={matchLoading}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Job Description
                                                </label>
                                                <textarea
                                                    value={jobDescription}
                                                    onChange={(e) => setJobDescription(e.target.value)}
                                                    placeholder="Paste the full job description here, including requirements, qualifications, responsibilities..."
                                                    rows={6}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm resize-vertical"
                                                    disabled={matchLoading}
                                                />
                                            </div>

                                            {matchError && (
                                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                                                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                                                    <p className="text-sm text-red-600">{matchError}</p>
                                                </div>
                                            )}

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={handleJobMatch}
                                                    disabled={matchLoading || !jobTitle.trim() || !jobDescription.trim()}
                                                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-5 py-2.5 rounded-lg transition-colors font-medium cursor-pointer disabled:cursor-not-allowed text-sm"
                                                >
                                                    {matchLoading ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            Analyzing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Briefcase className="w-4 h-4" />
                                                            Analyze Match
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setShowJobMatch(false);
                                                        setJobTitle('');
                                                        setJobDescription('');
                                                        setMatchError(null);
                                                    }}
                                                    disabled={matchLoading}
                                                    className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors font-medium cursor-pointer disabled:cursor-not-allowed text-sm"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Match Results */}
                                    {matchResult && (
                                        <div className="space-y-6">
                                            {/* Score Circle */}
                                            <div className="text-center">
                                                <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full border-8 ${getMatchRingColor(matchResult.matchPercentage)}`}>
                                                    <span className={`text-4xl font-bold ${getMatchColor(matchResult.matchPercentage)}`}>
                                                        {matchResult.matchPercentage}%
                                                    </span>
                                                </div>
                                                <p className="mt-3 text-gray-700 font-medium">
                                                    Match Score for <span className="text-purple-700">{jobTitle}</span>
                                                </p>
                                                <p className="mt-2 text-sm text-gray-600 max-w-lg mx-auto">
                                                    {matchResult.summary}
                                                </p>

                                                {/* Progress Bar */}
                                                <div className="mt-4 max-w-md mx-auto">
                                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                                        <div
                                                            className={`h-3 rounded-full transition-all duration-500 ${getMatchBg(matchResult.matchPercentage)}`}
                                                            style={{ width: `${matchResult.matchPercentage}%` }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Method Info */}
                                                <div className="mt-4 inline-flex items-center gap-2 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full text-xs">
                                                    <span>Cosine Similarity: {matchResult.cosineSimilarity?.toFixed(4)}</span>
                                                    <span className="text-gray-300">|</span>
                                                    <span>Vector Embedding + AI Analysis</span>
                                                </div>
                                            </div>

                                            {/* Strengths & Weaknesses Grid */}
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {/* Strengths */}
                                                <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                                                    <h4 className="font-semibold text-green-800 flex items-center gap-2 mb-3">
                                                        <CheckCircle className="w-5 h-5" />
                                                        Strengths
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {matchResult.strengths.map((s, i) => (
                                                            <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                                                                <span className="text-green-500 mt-1 shrink-0">+</span>
                                                                {s}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Weaknesses */}
                                                <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                                                    <h4 className="font-semibold text-red-800 flex items-center gap-2 mb-3">
                                                        <XCircle className="w-5 h-5" />
                                                        Gaps
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {matchResult.weaknesses.map((w, i) => (
                                                            <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                                                                <span className="text-red-500 mt-1 shrink-0">-</span>
                                                                {w}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            {/* Suggestions */}
                                            {matchResult.suggestions.length > 0 && (
                                                <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                                                    <h4 className="font-semibold text-amber-800 flex items-center gap-2 mb-3">
                                                        <Lightbulb className="w-5 h-5" />
                                                        Suggestions to Improve
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {matchResult.suggestions.map((s, i) => (
                                                            <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                                                                <span className="text-amber-500 mt-1 shrink-0">{i + 1}.</span>
                                                                {s}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Try Another Job Button */}
                                            <div className="text-center">
                                                <button
                                                    onClick={() => {
                                                        setMatchResult(null);
                                                        setJobTitle('');
                                                        setJobDescription('');
                                                    }}
                                                    className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium text-sm cursor-pointer"
                                                >
                                                    <Briefcase className="w-4 h-4" />
                                                    Try another job
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Collapsible Extracted Data */}
                        <div className="mb-4">
                            <button
                                onClick={() => setShowExtractedData(!showExtractedData)}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium text-sm cursor-pointer"
                            >
                                {showExtractedData ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                {showExtractedData ? 'Hide' : 'Show'} Extracted Data ({results.length} fields)
                            </button>
                        </div>

                        {showExtractedData && (
                            <>
                                <div className="space-y-6">
                                    {Object.entries(groupedResults).map(([section, rows]) => (
                                        <div key={section} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                            <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                                                <h3 className="font-semibold text-gray-700">{section}</h3>
                                            </div>
                                            <table className="w-full">
                                                <tbody>
                                                    {rows.map((row, i) => (
                                                        <tr key={i} className="border-b border-gray-100 last:border-0">
                                                            <td className="px-5 py-3 text-sm font-medium text-gray-500 w-1/4 align-top">
                                                                {row.field}
                                                            </td>
                                                            <td className="px-5 py-3 text-sm text-gray-800 whitespace-pre-wrap">
                                                                {row.value}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ))}
                                </div>

                                {/* Bottom Download */}
                                <div className="mt-8 text-center">
                                    <button
                                        onClick={handleDownloadCSV}
                                        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-medium cursor-pointer"
                                    >
                                        <Download className="w-5 h-5" />
                                        Download as CSV
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
