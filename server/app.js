import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import uploadRoutes from './routes/uploadRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import summarizeRoutes from './routes/summarizeRoutes.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/upload', uploadRoutes);
app.use('/api', searchRoutes);
app.use('/api', summarizeRoutes);

app.use((error, _, res, __) => {
  console.error(error);
  res.status(error.status || 500).json({
    message: error.message || 'Something went wrong on the server.'
  });
});

export default app;