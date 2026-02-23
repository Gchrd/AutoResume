import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const GEMINI_PROMPT = `You are an expert CV/Resume data extractor. I will give you a PDF file of a CV/Resume.

Your task: Extract EVERY piece of information from this CV into a structured JSON format.

Return ONLY a valid JSON array (no markdown, no code fences, no extra text). Each element must have exactly these 3 keys:
- "section": The section name (use the original header from the CV)
- "field": A descriptive label for this data point
- "value": The actual data

CRITICAL RULES:
1. ALWAYS extract dates, periods, and durations for EVERY item that has them — jobs, education, certifications, projects, organizations, etc. Use the field name "Period" or "Date" or "Duration" for these.
2. For sections with multiple entries, number them clearly: "Experience #1", "Experience #2", "Certification #1", "Certification #2", etc.
3. Within each numbered entry, ALWAYS include these fields in order (if they exist in the CV):
   - Title/Name/Position
   - Organization/Company/Institution/Issuer
   - Period/Date (NEVER skip this)
   - Location (if present)
   - Description/Achievements (combine bullet points with " | ")
4. For certifications specifically: extract the certification name, issuing organization, date/period, and credential ID if present.
5. For skills: list all skills as a single comma-separated value per category.
6. For languages: include both the language name and proficiency level.
7. Extract EVERYTHING. Do not skip, summarize, or omit any data whatsoever.
8. Keep the original language of the CV content.

Example format:
[
  {"section": "Personal Information", "field": "Name", "value": "John Doe"},
  {"section": "Personal Information", "field": "Email", "value": "john@example.com"},
  {"section": "Personal Information", "field": "Phone", "value": "+1 234 567 890"},
  {"section": "Personal Information", "field": "Location", "value": "Jakarta, Indonesia"},
  {"section": "Experience #1", "field": "Position", "value": "Senior Developer"},
  {"section": "Experience #1", "field": "Company", "value": "Tech Corp"},
  {"section": "Experience #1", "field": "Period", "value": "Jan 2023 - Present"},
  {"section": "Experience #1", "field": "Achievements", "value": "Led team of 5 | Improved performance by 40%"},
  {"section": "Certification #1", "field": "Name", "value": "AWS Solutions Architect"},
  {"section": "Certification #1", "field": "Issuer", "value": "Amazon Web Services"},
  {"section": "Certification #1", "field": "Date", "value": "March 2023"},
  {"section": "Certification #1", "field": "Credential ID", "value": "ABC123"}
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
