const SummaryCard = ({ title, children }) => {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur">
      <h2 className="mb-4 text-lg font-semibold text-white">{title}</h2>
      <div className="space-y-3 text-sm leading-7 text-slate-200">{children}</div>
    </section>
  );
};

export default SummaryCard;