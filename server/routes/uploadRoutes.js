import { Router } from 'express';
import upload from '../config/multer.js';
import { uploadPdf, uploadUrl, uploadYoutube } from '../controllers/uploadController.js';

const router = Router();

router.post('/pdf', upload.single('file'), uploadPdf);
router.post('/url', uploadUrl);
router.post('/youtube', uploadYoutube);

export default router;