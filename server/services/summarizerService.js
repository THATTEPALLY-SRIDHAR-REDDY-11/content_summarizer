import groq from '../config/groq.js';

const normalizeContent = (content) => content.replace(/\s+/g, ' ').trim().slice(0, 12000);

const extractJson = (content) => {
  const fencedMatch = content.match(/```json\s*([\s\S]*?)\s*```/i);
  const candidate = fencedMatch?.[1] || content;
  const firstBrace = candidate.indexOf('{');
  const lastBrace = candidate.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error('The model did not return valid JSON.');
  }

  return JSON.parse(candidate.slice(firstBrace, lastBrace + 1));
};

export const generateSummary = async (content, options) => {
  const prompt = `
Summarize the content.

Audience: ${options.audience}
Summary Type: ${options.type}

Return ONLY valid JSON with this shape:
{
  "summary": "",
  "keyPoints": [],
  "keywords": []
}

Content:
${normalizeContent(content)}
`;

  const response = await groq.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ],
    model: 'llama-3.3-70b-versatile'
  });

  const rawContent = response.choices?.[0]?.message?.content || '{}';
  return extractJson(rawContent);
};