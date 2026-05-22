import { Link, useLocation } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle.jsx';

const Navbar = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-lg font-semibold text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300 shadow-glow">
            AI
          </span>
          <span>Content Summarizer</span>
        </Link>

        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 sm:flex">
            <Link
              to="/"
              className={`rounded-full px-4 py-2 text-sm transition ${
                location.pathname === '/' ? 'bg-white text-slate-900' : 'text-slate-300 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              to="/summarizer"
              className={`rounded-full px-4 py-2 text-sm transition ${
                location.pathname === '/summarizer' ? 'bg-white text-slate-900' : 'text-slate-300 hover:text-white'
              }`}
            >
              Summarizer
            </Link>
          </nav>
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Navbar;