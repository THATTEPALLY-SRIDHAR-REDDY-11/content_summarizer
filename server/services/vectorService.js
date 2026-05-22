// NEW: Pinecone integration
import { randomUUID } from 'node:crypto';
import { getPineconeIndex } from '../config/pinecone.js';

const normalizeText = (value) => value.replace(/\s+/g, ' ').trim();
const EMBEDDING_DIMENSION = 1024;

const hashToken = (token, slot) => {
  let hash = slot + 1;

  for (let index = 0; index < token.length; index += 1) {
    hash = (hash * 31 + token.charCodeAt(index)) >>> 0;
  }

  return hash % EMBEDDING_DIMENSION;
};

export const createEmbedding = async (text) => {
  if (!text || !text.trim()) {
    throw new Error('Text is required to create an embedding.');
  }

  const tokens = normalizeText(text).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const embedding = new Array(EMBEDDING_DIMENSION).fill(0);

  if (tokens.length === 0) {
    return embedding;
  }

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    const slot = hashToken(token, index);
    embedding[slot] += 1;
  }

  const magnitude = Math.sqrt(embedding.reduce((sum, value) => sum + value * value, 0)) || 1;

  return embedding.map((value) => Number((value / magnitude).toFixed(6)));
};

export const storeVector = async (summaryData, summaryType) => {
  const index = await getPineconeIndex();
  const summaryText = normalizeText([
    summaryData?.summary || '',
    ...(Array.isArray(summaryData?.keywords) ? summaryData.keywords : [])
  ].join(' '));

  if (!summaryText) {
    throw new Error('Summary text is required for Pinecone storage.');
  }

  const embedding = await createEmbedding(summaryText);

  await index.upsert([
    {
      id: `summary-${randomUUID()}`,
      values: embedding,
      metadata: {
        summary: summaryData?.summary || '',
        keywords: Array.isArray(summaryData?.keywords) ? summaryData.keywords : [],
        createdAt: new Date().toISOString(),
        summaryType
      }
    }
  ]);

  return true;
};

export const searchSimilarContent = async (query) => {
  const index = await getPineconeIndex();
  const embedding = await createEmbedding(query);

  const response = await index.query({
    vector: embedding,
    topK: 5,
    includeMetadata: true
  });

  return (response.matches || []).map((match) => ({
    id: match.id,
    score: match.score ?? 0,
    summary: match.metadata?.summary || '',
    keywords: Array.isArray(match.metadata?.keywords) ? match.metadata.keywords : [],
    createdAt: match.metadata?.createdAt || '',
    summaryType: match.metadata?.summaryType || ''
  }));
};