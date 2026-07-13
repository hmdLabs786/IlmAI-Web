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
    <div
      className={`glass-card relative rounded-2xl p-6 ${
        highlighted ? "border-blue-400/30 shadow-[0_8px_40px_0_rgba(0,0,0,0.4),0_0_60px_rgba(59,130,246,0.08)]" : ""
      }`}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 px-4 py-1 text-xs font-semibold text-white shadow-lg shadow-blue-500/25">
          Most Popular
        </div>
      )}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white">{name}</h3>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-3xl font-bold text-white">Rs. {price.toLocaleString()}</span>
          <span className="text-sm text-blue-200/40">/{period}</span>
        </div>
      </div>
      <ul className="mb-6 space-y-3">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-blue-200/60">
            <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
      <button
        onClick={onSelect}
        className={`w-full rounded-xl py-2.5 text-sm font-medium transition-all ${
          highlighted
            ? "btn-glow text-white"
            : price === 0
              ? "border border-white/10 bg-white/5 text-white hover:bg-white/10"
              : "border border-white/10 bg-transparent text-blue-200/80 hover:border-blue-400/30 hover:text-white"
        }`}
      >
        {cta}
      </button>
    </div>
  );
}
