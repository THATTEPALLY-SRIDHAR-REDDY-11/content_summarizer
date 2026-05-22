import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { extractFromPdf, extractFromUrl, extractFromYoutube, summarizeContent } from '../services/api.js';

const summaryTypes = ['Bullet Summary', 'Detailed Summary', 'Short Summary'];
const audiences = ['Student', 'Beginner', 'Professional'];
const sources = ['Text', 'PDF', 'Article URL', 'YouTube URL'];

const Summarizer = () => {
  const navigate = useNavigate();
  const [source, setSource] = useState('Text');
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [summaryType, setSummaryType] = useState('Bullet Summary');
  const [audience, setAudience] = useState('Student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resolveContent = async () => {
    if (source === 'Text') {
      if (!text.trim()) {
        throw new Error('Please paste some text to summarize.');
      }

      return text;
    }

    if (source === 'PDF') {
      if (!file) {
        throw new Error('Please upload a PDF file.');
      }

      return extractFromPdf(file);
    }

    if (source === 'Article URL') {
      if (!url.trim()) {
        throw new Error('Please enter an article URL.');
      }

      return extractFromUrl(url.trim());
    }

    if (!youtubeUrl.trim()) {
      throw new Error('Please enter a YouTube URL.');
    }

    return extractFromYoutube(youtubeUrl.trim());
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError('');

      const content = await resolveContent();
      const summary = await summarizeContent(content, { type: summaryType, audience });
      localStorage.setItem('summaryResult', JSON.stringify(summary));

      navigate('/result', {
        state: {
          summary,
          source,
          summaryType,
          audience
        }
      });
    } catch (exception) {
      setError(exception.response?.data?.message || exception.message || 'Unable to generate summary.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-xl sm:p-8"
      >
        <div className="mb-8 space-y-3">
          <h1 className="text-3xl font-bold text-white">Summarizer</h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-300">
            Choose a content source, set the summary style and audience, then let the backend extract and summarize the content for you.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Content Source</label>
              <select
                value={source}
                onChange={(event) => setSource(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
              >
                {sources.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            {source === 'Text' && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Paste Text</label>
                <textarea
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  rows={10}
                  placeholder="Paste the content you want summarized..."
                  className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
                />
              </div>
            )}

            {source === 'PDF' && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Upload PDF</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(event) => setFile(event.target.files?.[0] || null)}
                  className="block w-full rounded-2xl border border-dashed border-white/15 bg-slate-900/80 px-4 py-4 text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950"
                />
                {file ? <p className="mt-2 text-xs text-slate-400">Selected file: {file.name}</p> : null}
              </div>
            )}

            {source === 'Article URL' && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Article URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="https://example.com/article"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
                />
              </div>
            )}

            {source === 'YouTube URL' && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">YouTube URL</label>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(event) => setYoutubeUrl(event.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
                />
              </div>
            )}
          </div>

          <div className="space-y-5 rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Summary Type</label>
              <select
                value={summaryType}
                onChange={(event) => setSummaryType(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
              >
                {summaryTypes.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Audience</label>
              <select
                value={audience}
                onChange={(event) => setAudience(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
              >
                {audiences.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="flex w-full items-center justify-center rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? <LoadingSpinner label="Generating summary" /> : 'Generate Summary'}
            </button>

            {error ? (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            ) : null}
          </div>
        </div>
      </motion.div>
    </main>
  );
};

export default Summarizer;