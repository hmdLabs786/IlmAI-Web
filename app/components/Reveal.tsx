"use client";

import { useRef, useEffect, useState, ReactNode } from "react";

type RevealType = "up" | "left" | "right" | "scale";

interface RevealProps {
  children: ReactNode;
  type?: RevealType;
  delay?: number;
  className?: string;
}

export default function Reveal({
  children,
  type = "up",
  delay = 0,
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const base = `reveal${type !== "up" ? `-${type}` : ""}`;

  return (
    <div ref={ref} className={`${base} ${visible ? "visible" : ""} ${className}`}>
      {children}
    </div>
  );
}
