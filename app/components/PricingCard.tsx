interface PricingCardProps {
  name: string;
  price: number;
  period: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  onSelect?: () => void;
}

export default function PricingCard({
  name, price, period, features, cta, highlighted, onSelect,
}: PricingCardProps) {
  return (
    <div className={`glass relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:scale-[1.02] ${
      highlighted ? "border-blue-500/30 shadow-[0_0_60px_rgba(37,99,235,0.08)]" : ""
    }`}>
      {highlighted && (
        <div className="absolute -right-12 top-6 rotate-45 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-12 py-1 text-xs font-semibold text-white shadow-lg shadow-blue-500/30">
          Popular
        </div>
      )}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white">{name}</h3>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-3xl font-bold text-white">Rs. {price.toLocaleString()}</span>
          <span className="text-sm text-slate-400">/{period}</span>
        </div>
      </div>
      <ul className="mb-6 space-y-3">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
            <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
      <button onClick={onSelect}
        className={`min-h-[44px] w-full rounded-xl py-2.5 text-sm font-medium transition-all duration-300 ${
          highlighted
            ? "btn-luxury text-white"
            : price === 0
              ? "border border-white/10 bg-white/5 text-white hover:bg-white/10"
              : "border border-white/10 bg-transparent text-slate-300 hover:border-white/20 hover:text-white"
        }`}>
        {cta}
      </button>
    </div>
  );
}
