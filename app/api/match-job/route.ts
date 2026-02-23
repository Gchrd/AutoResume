import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const MATCH_PROMPT = `You are an expert HR recruiter and career advisor. I will give you:
1. A person's CV data (structured as JSON)
2. A job title and job description

Your task: Analyze how well the candidate's CV matches the job requirements.

Return ONLY a valid JSON object (no markdown, no code fences, no extra text) with exactly these keys:
- "matchPercentage": A number from 0 to 100 representing the overall match
- "summary": A brief 1-2 sentence overall assessment
- "strengths": An array of strings listing the candidate's strengths that match the job (max 5 items)
- "weaknesses": An array of strings listing gaps or missing qualifications (max 5 items)
- "suggestions": An array of strings with actionable advice to improve the match (max 3 items)

Scoring guidelines:
- 90-100%: Near-perfect match, candidate exceeds most requirements
- 70-89%: Strong match, meets most key requirements
- 50-69%: Moderate match, has relevant experience but missing some requirements
- 30-49%: Weak match, some transferable skills but significant gaps
- 0-29%: Poor match, very few relevant qualifications

Be honest and specific. Reference actual skills, experiences, and requirements in your analysis.
Keep the response language matching the job description language (if Indonesian, respond in Indonesian).

Example output:
{
  "matchPercentage": 72,
  "summary": "Strong match for the role. The candidate has solid technical skills in React and Node.js but lacks experience with AWS infrastructure.",
  "strengths": [
    "3+ years of React experience matches the requirement",
    "Has leadership experience managing a team of 5",
    "Strong communication skills evident from organizational roles"
  ],
  "weaknesses": [
    "No cloud/AWS experience mentioned (required in job description)",
    "No experience with CI/CD pipelines"
  ],
  "suggestions": [
    "Consider obtaining an AWS Cloud Practitioner certification",
    "Highlight any DevOps or deployment experience in the CV"
  ]
}`;

export async function POST(request: NextRequest) {
    try {
        const { cvData, jobTitle, jobDescription } = await request.json();

        if (!cvData || !jobTitle || !jobDescription) {
            return NextResponse.json(
                { error: 'Missing required fields: cvData, jobTitle, jobDescription' },
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

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const userMessage = `
CV DATA:
${JSON.stringify(cvData, null, 2)}

JOB TITLE: ${jobTitle}

JOB DESCRIPTION:
${jobDescription}
`;

        const result = await model.generateContent([
            { text: MATCH_PROMPT },
            { text: userMessage },
        ]);

        const response = result.response;
        const responseText = response.text();

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
        console.error('Job Match Error:', message);
        return NextResponse.json(
            { error: `Failed to analyze job match: ${message}` },
            { status: 500 }
        );
    }
}
