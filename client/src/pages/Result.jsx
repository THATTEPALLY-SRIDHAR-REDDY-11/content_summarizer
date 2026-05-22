import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SummaryCard from '../components/SummaryCard.jsx';
import SearchSimilar from '../components/SearchSimilar.jsx';

const Result = () => {
  const location = useLocation();
  const stored = JSON.parse(localStorage.getItem('summaryResult') || 'null');
  const summary = location.state?.summary || stored;

  if (!summary) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center text-slate-300">
          <p className="mb-4 text-lg text-white">No summary found.</p>
          <Link to="/summarizer" className="rounded-full bg-cyan-400 px-6 py-3 font-medium text-slate-950">
            Go back to summarizer
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Result</h1>
            <p className="mt-2 text-sm text-slate-300">Your generated summary is ready.</p>
          </div>
          <Link to="/summarizer" className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10">
            Summarize Another
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SummaryCard title="Summary">
            <p>{summary.summary}</p>
          </SummaryCard>

          <SummaryCard title="Key Points">
            <ul className="list-disc space-y-2 pl-5">
              {(summary.keyPoints || []).map((point, index) => (
                <li key={`${point}-${index}`}>{point}</li>
              ))}
            </ul>
          </SummaryCard>
        </div>

        <SummaryCard title="Keywords">
          <div className="flex flex-wrap gap-3">
            {(summary.keywords || []).map((keyword, index) => (
              <span
                key={`${keyword}-${index}`}
                className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100"
              >
                {keyword}
              </span>
            ))}
          </div>
        </SummaryCard>

        {/* NEW: Pinecone integration */}
        <SearchSimilar initialQuery={(summary.keywords || []).join(' ') || summary.summary?.slice(0, 120) || ''} />
      </motion.div>
    </main>
  );
};

export default Result;