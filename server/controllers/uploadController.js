import { extractPdfText } from '../services/pdfService.js';
import { extractArticleText } from '../services/urlService.js';
import { extractYoutubeText } from '../services/youtubeService.js';

const responseWithText = (res, source, content) => {
  res.json({ source, content });
};

const ensureContent = (content, message) => {
  if (!content || !content.trim()) {
    const error = new Error(message);
    error.status = 422;
    throw error;
  }

  return content;
};

export const uploadPdf = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file.' });
    }

    const content = ensureContent(
      await extractPdfText(req.file.buffer),
      'No readable text was found in the uploaded PDF.'
    );
    return responseWithText(res, 'pdf', content);
  } catch (error) {
    next(error);
  }
};

export const uploadUrl = async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'Please provide an article URL.' });
    }

    const content = ensureContent(
      await extractArticleText(url),
      'No readable article content was found at that URL.'
    );
    return responseWithText(res, 'url', content);
  } catch (error) {
    next(error);
  }
};

export const uploadYoutube = async (req, res, next) => {
  try {
    const { youtubeUrl } = req.body;

    if (!youtubeUrl) {
      return res.status(400).json({ message: 'Please provide a YouTube URL.' });
    }

    const content = ensureContent(
      await extractYoutubeText(youtubeUrl),
      'No transcript was available for that YouTube link.'
    );
    return responseWithText(res, 'youtube', content);
  } catch (error) {
    next(error);
  }
};