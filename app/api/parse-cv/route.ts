import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const GEMINI_PROMPT = `You are an expert CV/Resume parser. I will give you a PDF file of a CV/Resume.

Your task:
1. Read the PDF carefully and identify ALL sections/headers in the CV (e.g., "Personal Information", "Experience", "Education", "Skills", "Certifications", etc.)
2. The section names may vary — they could be in any language (English, Indonesian, etc.) and use different naming conventions. Adapt accordingly.
3. Extract ALL data from each section into structured rows.

Return ONLY a valid JSON array (no markdown, no code fences, no explanation). Each element must have exactly these keys:
- "section": The section/header name as it appears in the CV
- "field": The specific data label (e.g., "Name", "Company", "Role", "Period", "Degree", etc.)
- "value": The actual data value

Rules:
- For sections with multiple entries (e.g., multiple jobs), number them: "Experience #1", "Experience #2", etc.
- For skills/languages that are just lists, use "field": "Item 1", "Item 2", etc. or keep it as a single comma-separated value
- Extract EVERYTHING. Do not skip or summarize any data.
- If a field has bullet points or achievements, combine them into one value separated by " | "
- Keep the original language of the CV content

Example output format:
[
  {"section": "Personal Information", "field": "Name", "value": "John Doe"},
  {"section": "Personal Information", "field": "Email", "value": "john@example.com"},
  {"section": "Experience #1", "field": "Company", "value": "Tech Corp"},
  {"section": "Experience #1", "field": "Role", "value": "Senior Developer"},
  {"section": "Experience #1", "field": "Period", "value": "2023 - Present"},
  {"section": "Experience #1", "field": "Achievements", "value": "Led team of 5 | Improved performance by 40%"}
]`;

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Limit file size to 5MB to avoid timeouts
        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 5MB.' },
                { status: 400 }
            );
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'Gemini API key not configured. Add GEMINI_API_KEY to .env.local' },
                { status: 500 }
            );
        }

        // Convert PDF file to base64 for Gemini inline data
        const arrayBuffer = await file.arrayBuffer();
        const base64Data = Buffer.from(arrayBuffer).toString('base64');

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        // Send PDF directly to Gemini as inline data (no pdf-parse needed!)
        const result = await model.generateContent([
            {
                inlineData: {
                    mimeType: 'application/pdf',
                    data: base64Data,
                },
            },
            { text: GEMINI_PROMPT },
        ]);

        const response = result.response;
        const responseText = response.text();

        // Parse JSON from the response
        let parsed;
        try {
            const cleaned = responseText
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();
            parsed = JSON.parse(cleaned);
        } catch {
            return NextResponse.json(
                { error: 'Failed to parse AI response', raw: responseText },
                { status: 500 }
            );
        }

        return NextResponse.json({ data: parsed });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('CV Parse Error:', message);
        return NextResponse.json(
            { error: `Failed to parse CV: ${message}` },
            { status: 500 }
        );
    }
}
