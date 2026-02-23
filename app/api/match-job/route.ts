import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { cosineSimilarity, getEmbedding, cvDataToText } from '@/lib/embeddingUtils';

const ANALYSIS_PROMPT = `You are an expert HR recruiter. I will give you:
1. A candidate's CV data
2. A job title and description
3. A similarity score (0-100%) calculated via vector embedding cosine similarity

Your task: Provide qualitative analysis of the match. The similarity score is already computed mathematically — do NOT recalculate it. Instead, focus on explaining WHY the score is what it is.

Return ONLY a valid JSON object (no markdown, no code fences) with these keys:
- "summary": 1-2 sentence overall assessment referencing the score
- "strengths": Array of strings (max 5) — specific CV strengths matching the job
- "weaknesses": Array of strings (max 5) — specific gaps or missing qualifications
- "suggestions": Array of strings (max 3) — actionable advice to improve the match

Be specific. Reference actual skills, experiences, and job requirements.
Match the language of the job description (if Indonesian, respond in Indonesian).`;

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

        // ===== STEP 1: Mathematical Similarity via Vector Embeddings =====
        // Convert CV data to flat text for embedding
        const cvText = cvDataToText(cvData);
        const jobText = `${jobTitle}\n\n${jobDescription}`;

        // Get embedding vectors from Gemini Embedding API
        const [cvEmbedding, jobEmbedding] = await Promise.all([
            getEmbedding(apiKey, cvText),
            getEmbedding(apiKey, jobText),
        ]);

        // Calculate cosine similarity (returns -1 to 1, we convert to 0-100%)
        const rawSimilarity = cosineSimilarity(cvEmbedding, jobEmbedding);
        // Scale from cosine range [0, 1] to percentage [0, 100]
        // Typical text cosine similarities range 0.3-0.9, so we normalize
        const matchPercentage = Math.round(Math.min(100, Math.max(0, rawSimilarity * 100)));

        // ===== STEP 2: Qualitative Analysis via Generative AI =====
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const userMessage = `
CV DATA:
${JSON.stringify(cvData, null, 2)}

JOB TITLE: ${jobTitle}

JOB DESCRIPTION:
${jobDescription}

COMPUTED SIMILARITY SCORE: ${matchPercentage}%
(This score was calculated using cosine similarity between the CV embedding vector and the job description embedding vector. Do not change this number.)
`;

        const result = await model.generateContent([
            { text: ANALYSIS_PROMPT },
            { text: userMessage },
        ]);

        const response = result.response;
        const responseText = response.text();

        let analysis;
        try {
            const cleaned = responseText
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();
            analysis = JSON.parse(cleaned);
        } catch {
            return NextResponse.json(
                { error: 'Failed to parse AI analysis', raw: responseText },
                { status: 500 }
            );
        }

        // Combine mathematical score with AI analysis
        return NextResponse.json({
            data: {
                matchPercentage,
                cosineSimilarity: rawSimilarity,
                summary: analysis.summary,
                strengths: analysis.strengths || [],
                weaknesses: analysis.weaknesses || [],
                suggestions: analysis.suggestions || [],
                method: 'hybrid',
                methodDescription: 'Score calculated via cosine similarity of Gemini gemini-embedding-001 vectors. Analysis provided by Gemini 2.5 Flash.',
            },
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Job Match Error:', message);
        return NextResponse.json(
            { error: `Failed to analyze job match: ${message}` },
            { status: 500 }
        );
    }
}
