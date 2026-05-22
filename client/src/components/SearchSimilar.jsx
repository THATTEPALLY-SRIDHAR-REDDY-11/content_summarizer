// NEW: Pinecone integration
import { useState } from 'react';
import { motion } from 'framer-motion';
import SummaryCard from './SummaryCard.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';
import { searchSimilarContent } from '../services/api.js';

const SearchSimilar = ({ initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError('');
      const matches = await searchSimilarContent(query);
      setResults(matches);
    } catch (searchError) {
      setError(searchError.response?.data?.message || searchError.message || 'Unable to search similar summaries.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-xl">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Search Similar Summaries</h2>
        <p className="text-sm text-slate-300">Search your saved summaries in Pinecone using a natural language query.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Type a topic like AI notes"
          className="flex-1 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={loading}
          className="rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? <LoadingSpinner label="Searching" /> : 'Search'}
        </button>
      </div>

      {error ? <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}

      {results.length > 0 ? (
        <div className="grid gap-4">
          {results.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <SummaryCard title={`Similarity: ${(item.score * 100).toFixed(1)}%`}>
                <p>{item.summary}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {(item.keywords || []).map((keyword) => (
                    <span key={keyword} className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">
                      {keyword}
                    </span>
                  ))}
                </div>
              </SummaryCard>
            </motion.div>
          ))}
        </div>
      ) : (
        !loading && <p className="text-sm text-slate-400">No similar summaries yet.</p>
      )}
    </section>
  );
};

export default SearchSimilar;