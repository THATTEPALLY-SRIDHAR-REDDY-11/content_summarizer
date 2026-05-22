import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Summarizer from './pages/Summarizer.jsx';
import Result from './pages/Result.jsx';
import Navbar from './components/Navbar.jsx';

const App = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/summarizer" element={<Summarizer />} />
        <Route path="/result" element={<Result />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;