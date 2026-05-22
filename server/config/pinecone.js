// NEW: Pinecone integration
import { Pinecone } from '@pinecone-database/pinecone';

const apiKey = process.env.PINECONE_API_KEY;
const indexName = process.env.PINECONE_INDEX_NAME;
const cloud = process.env.PINECONE_CLOUD || 'aws';
const region = process.env.PINECONE_REGION || 'us-east-1';
const dimension = Number(process.env.PINECONE_DIMENSION || 1024);

const pinecone = apiKey ? new Pinecone({ apiKey }) : null;
let indexReadyPromise = null;

export const getPineconeIndex = async () => {
  if (!pinecone) {
    throw new Error('PINECONE_API_KEY is missing. Pinecone is not configured.');
  }

  if (!indexName) {
    throw new Error('PINECONE_INDEX_NAME is missing.');
  }

  // NEW: Pinecone integration
  if (!indexReadyPromise) {
    indexReadyPromise = pinecone.createIndex({
      name: indexName,
      dimension,
      spec: {
        serverless: {
          cloud,
          region
        }
      },
      suppressConflicts: true,
      waitUntilReady: true
    });
  }

  await indexReadyPromise;

  return pinecone.index({ name: indexName });
};

export default pinecone;