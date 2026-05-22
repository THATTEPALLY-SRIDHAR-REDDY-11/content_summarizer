import { Router } from 'express';
import { summarizeContent } from '../controllers/summarizeController.js';

const router = Router();

router.post('/summarize', summarizeContent);

export default router;