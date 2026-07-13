"use client";

export default function ParticleField() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden will-change-transform">
      {/* Large floating frosted orb */}
      <div className="animate-float-drift will-change-transform absolute -left-32 -top-32 h-96 w-96 rounded-full bg-gradient-to-br from-blue-500/5 via-blue-400/5 to-transparent blur-3xl max-md:blur-2xl" />

      {/* Mid-right cobalt sphere */}
      <div className="animate-float-slow will-change-transform absolute right-20 top-1/4 h-64 w-64 rounded-full bg-gradient-to-br from-blue-400/5 via-cyan-400/5 to-transparent blur-3xl max-md:hidden" />

      {/* Bottom-left geometric block */}
      <div className="animate-float-reverse will-change-transform absolute -bottom-20 left-1/4 h-80 w-80 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-gradient-to-br from-blue-600/5 via-blue-500/5 to-transparent blur-3xl max-md:hidden" />

      {/* Small floating accent orbs */}
      <div className="animate-float-slow will-change-transform absolute left-[15%] top-[60%] h-32 w-32 rounded-full bg-gradient-to-br from-cyan-400/5 to-blue-500/5 blur-2xl" style={{ animationDelay: "-2s" }} />
      <div className="animate-float-drift will-change-transform absolute right-[25%] top-[70%] h-40 w-40 rounded-full bg-gradient-to-br from-blue-400/5 to-blue-600/5 blur-2xl max-md:hidden" style={{ animationDelay: "-4s" }} />

      {/* Frosted ring */}
      <div className="animate-orbit-3d will-change-transform absolute left-1/2 top-1/3 h-48 w-48 -translate-x-1/2 rounded-full border border-blue-400/5 blur-sm max-md:hidden" />

      {/* Floating glass panels */}
      <div className="animate-float-drift will-change-transform absolute left-[60%] top-[15%] h-24 w-16 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md max-md:hidden" style={{ animationDelay: "-3s" }} />
      <div className="animate-float-reverse will-change-transform absolute left-[30%] top-[80%] h-20 w-32 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-md max-md:hidden" style={{ animationDelay: "-1s" }} />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}
