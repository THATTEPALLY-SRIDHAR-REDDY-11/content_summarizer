import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api'
});

export const extractFromPdf = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/upload/pdf', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data.content;
};

export const extractFromUrl = async (url) => {
  const response = await api.post('/upload/url', { url });
  return response.data.content;
};

export const extractFromYoutube = async (youtubeUrl) => {
  const response = await api.post('/upload/youtube', { youtubeUrl });
  return response.data.content;
};

export const summarizeContent = async (content, options) => {
  const response = await api.post('/summarize', {
    content,
    type: options.type,
    audience: options.audience
  });

  return response.data;
};

// NEW: Pinecone integration
export const searchSimilarContent = async (query) => {
  const response = await api.post('/searchSimilar', { query });
  return response.data.results || [];
};

export default api;