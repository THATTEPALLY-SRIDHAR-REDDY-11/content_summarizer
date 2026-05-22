import { generateSummary } from '../services/summarizerService.js';
import { storeVector } from '../services/vectorService.js';

export const summarizeContent = async (req, res, next) => {
  try {
    const { content, type, audience } = req.body;

    if (!content || !content.trim() || !type || !audience) {
      return res.status(400).json({ message: 'Content, summary type, and audience are required.' });
    }

    const summary = await generateSummary(content, { type, audience });

    // NEW: Pinecone integration
    try {
      await storeVector(summary, type);
    } catch (storageError) {
      console.error('Pinecone storage skipped:', storageError.message);
    }

    res.json(summary);
  } catch (error) {
    next(error);
  }
};