import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const features = [
  'Paste text instantly',
  'Upload PDFs with automatic extraction',
  'Summarize article and YouTube links',
  'Choose summary style and audience'
];

const Home = () => {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="space-y-8"
        >
          <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
            Simple AI summarization for everyday content
          </span>
          <div className="space-y-5">
            <h1 className="max-w-xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Turn long content into clear summaries in seconds.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">
              AI Content Summarizer helps you process articles, PDFs, YouTube transcripts, and raw text with a clean workflow and a beginner-friendly interface.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/summarizer"
              className="rounded-full bg-cyan-400 px-6 py-3 font-medium text-slate-950 transition hover:bg-cyan-300"
            >
              Get Started
            </Link>
            <a
              href="#features"
              className="rounded-full border border-white/10 bg-white/5 px-6 py-3 font-medium text-white transition hover:bg-white/10"
            >
              Explore Features
            </a>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-xl"
        >
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-6">
            <div className="mb-4 flex items-center justify-between text-sm text-slate-400">
              <span>Summary preview</span>
              <span>AI generated</span>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-800/80 p-4 text-sm text-slate-200">
                Long content enters here and becomes a concise summary.
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-cyan-400/10 p-4 text-sm text-cyan-100">Key points extracted automatically</div>
                <div className="rounded-2xl bg-emerald-400/10 p-4 text-sm text-emerald-100">Keywords surfaced for quick scanning</div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      <section id="features" className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200"
          >
            {feature}
          </motion.div>
        ))}
      </section>
    </main>
  );
};

export default Home;