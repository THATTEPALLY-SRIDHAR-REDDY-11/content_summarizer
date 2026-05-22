import { Router } from 'express';
import { searchSimilarContent } from '../services/vectorService.js';

const router = Router();

router.post('/searchSimilar', async (req, res, next) => {
  try {
    const { query } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({ message: 'Query is required.' });
    }

    const results = await searchSimilarContent(query.trim());
    return res.json({ results });
  } catch (error) {
    next(error);
  }
});

export default router;