export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.04]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-base font-bold text-white shadow-lg shadow-blue-500/30">I</div>
              <span className="text-lg font-bold tracking-tight text-white">Ilm<span className="text-blue-400">AI</span></span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              AI-powered board exam preparation for Pakistani students. Master your exams with intelligent tutoring.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wide text-white">Quick Links</h4>
            <ul className="space-y-2.5">
              {[{ href: "/", label: "Home" }, { href: "/#features", label: "Features" }, { href: "/#pricing", label: "Pricing" }, { href: "/pay", label: "Subscribe" }].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-slate-400 transition-colors duration-300 hover:text-blue-400">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wide text-white">Contact</h4>
            <ul className="space-y-2.5">
              <li className="text-sm text-slate-400">Support: support@ilmai.app</li>
              <li className="text-sm text-slate-400">Pakistan</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-white/[0.04] pt-6 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} IlmAI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
