interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="glass group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:scale-[1.02]">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-500/5 blur-2xl transition-all duration-700 group-hover:scale-150 group-hover:bg-blue-500/10" />
      <div className="relative">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/5 text-blue-400 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/10">
          {icon}
        </div>
        <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm leading-relaxed text-slate-400">{description}</p>
      </div>
    </div>
  );
}
