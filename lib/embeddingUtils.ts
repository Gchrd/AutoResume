import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Compute cosine similarity between two vectors.
 * Returns a value between -1 and 1 (1 = identical, 0 = unrelated, -1 = opposite).
 */
export function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
        throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    if (denominator === 0) return 0;

    return dotProduct / denominator;
}

/**
 * Get embedding vector from Gemini Embedding API for a given text.
 */
export async function getEmbedding(apiKey: string, text: string): Promise<number[]> {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });

    const result = await model.embedContent(text);
    return result.embedding.values;
}

/**
 * Build a flat text summary from parsed CV data for embedding.
 * Creates a clean, structured text from JSON rows.
 */
export function cvDataToText(cvData: { section: string; field: string; value: string }[]): string {
    const sections: Record<string, string[]> = {};

    for (const row of cvData) {
        if (!sections[row.section]) sections[row.section] = [];
        sections[row.section].push(`${row.field}: ${row.value}`);
    }

    return Object.entries(sections)
        .map(([section, items]) => `${section}\n${items.join('\n')}`)
        .join('\n\n');
}
