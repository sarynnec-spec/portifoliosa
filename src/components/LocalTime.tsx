"use client";

import { useEffect, useState } from "react";
import { profile } from "@/content/profile";

/** Relógio local de Aveiro. Renderiza vazio no servidor para evitar hydration mismatch. */
export default function LocalTime({ className }: { className?: string }) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("pt-PT", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: profile.timeZone,
      }).format(new Date());

    setTime(format());
    const id = window.setInterval(() => setTime(format()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className={className} suppressHydrationWarning>
      {time || "--:--"}
    </span>
  );
}
