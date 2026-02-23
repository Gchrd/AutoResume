'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, Download, Loader2, ArrowLeft, Table, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { ParsedCVRow, convertToCSV, downloadCSV } from '@/lib/csvUtils';

export default function ScannerPage() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<ParsedCVRow[] | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (selectedFile: File) => {
        if (selectedFile.type !== 'application/pdf') {
            setError('Only PDF files are supported.');
            return;
        }
        setFile(selectedFile);
        setError(null);
        setResults(null);
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
            // Send PDF file to API route for server-side parsing
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
        if (fileInputRef.current) fileInputRef.current.value = '';
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

                {/* Results Table */}
                {results && groupedResults && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">Extracted Data</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {results.length} fields found across {Object.keys(groupedResults).length} sections
                                </p>
                            </div>
                            <button
                                onClick={handleReset}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                            >
                                Scan another CV
                            </button>
                        </div>

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
                    </div>
                )}
            </div>
        </main>
    );
}
