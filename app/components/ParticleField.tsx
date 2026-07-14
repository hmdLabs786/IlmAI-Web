"use client";

export default function ParticleField() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="animate-float-drift will-change-transform absolute -left-32 -top-32 h-96 w-96 rounded-full bg-gradient-to-br from-blue-600/8 via-blue-500/5 to-transparent blur-3xl" />
      <div className="animate-float-slow will-change-transform absolute right-10 top-1/4 h-72 w-72 rounded-full bg-gradient-to-br from-blue-500/6 via-blue-400/4 to-transparent blur-3xl max-md:hidden" />
      <div className="animate-float-reverse will-change-transform absolute -bottom-20 left-1/4 h-80 w-80 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-gradient-to-br from-blue-700/5 via-blue-500/4 to-transparent blur-3xl max-md:hidden" />
      <div className="animate-float-slow will-change-transform absolute left-[15%] top-[60%] h-36 w-36 rounded-full bg-gradient-to-br from-blue-400/4 to-blue-600/3 blur-2xl" style={{ animationDelay: "-2s" }} />
      <div className="animate-float-drift will-change-transform absolute right-[25%] top-[70%] h-40 w-40 rounded-full bg-gradient-to-br from-blue-500/3 to-blue-700/3 blur-2xl max-md:hidden" style={{ animationDelay: "-4s" }} />
      <div className="animate-orbit-3d will-change-transform absolute left-1/2 top-1/3 h-48 w-48 -translate-x-1/2 rounded-full border border-blue-500/[0.04] blur-sm max-md:hidden" />
      <div className="animate-float-drift will-change-transform absolute left-[60%] top-[15%] h-24 w-16 rounded-2xl border border-white/[0.03] bg-white/[0.01] backdrop-blur-md max-md:hidden" style={{ animationDelay: "-3s" }} />
      <div className="animate-float-reverse will-change-transform absolute left-[30%] top-[80%] h-20 w-32 rounded-xl border border-white/[0.03] bg-white/[0.01] backdrop-blur-md max-md:hidden" style={{ animationDelay: "-1s" }} />
      <div className="absolute inset-0 opacity-[0.012]" style={{ backgroundImage: "linear-gradient(rgba(37, 99, 235, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(37, 99, 235, 0.4) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
    </div>
  );
}
