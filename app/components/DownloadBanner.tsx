"use client";

import { useEffect, useState } from "react";

export default function DownloadBanner() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );
  }, []);

  if (!isMobile) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      <div className="glass-card-strong mx-4 mb-4 rounded-2xl px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-400 text-lg font-bold text-white shadow-lg shadow-blue-500/25">
              I
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Get the IlmAI App</p>
              <p className="text-xs text-blue-200/50">AI Tutor for Board Exams</p>
            </div>
          </div>
          <a href="#" className="btn-glow rounded-xl px-5 py-2 text-sm font-medium text-white">
            Download APK
          </a>
        </div>
      </div>
    </div>
  );
}
