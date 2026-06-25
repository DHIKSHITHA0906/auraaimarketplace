import { motion } from "framer-motion";

export function Petals({ count = 18, opacity = 0.5 }: { count?: number; opacity?: number }) {
  const items = Array.from({ length: count });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((_, i) => {
        const left = (i * 53) % 100;
        const size = 6 + ((i * 11) % 10);
        const delay = (i % 8) * 1.2;
        const duration = 14 + (i % 9);
        const drift = (i % 2 === 0 ? 1 : -1) * (30 + (i % 5) * 20);
        return (
          <motion.span
            key={i}
            initial={{ y: -40, x: 0, opacity: 0, rotate: 0 }}
            animate={{
              y: ["-5%", "110%"],
              x: [0, drift, -drift / 2, drift],
              rotate: [0, 180, 360],
              opacity: [0, opacity, opacity, 0],
            }}
            transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
            className="absolute rounded-full"
            style={{
              left: `${left}%`,
              width: size,
              height: size,
              background:
                "radial-gradient(circle at 30% 30%, oklch(0.92 0.06 25 / 0.95), oklch(0.78 0.09 35 / 0.6) 60%, transparent 75%)",
              filter: "blur(0.3px)",
            }}
          />
        );
      })}
    </div>
  );
}

export function LightRays() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute -top-1/3 left-1/2 h-[140%] w-[80%] -translate-x-1/2 opacity-60"
        style={{
          background:
            "conic-gradient(from 200deg at 50% 0%, transparent 0deg, oklch(0.92 0.06 25 / 0.35) 20deg, transparent 60deg, oklch(0.85 0.07 60 / 0.3) 120deg, transparent 180deg, oklch(0.92 0.06 25 / 0.25) 240deg, transparent 360deg)",
          filter: "blur(60px)",
        }}
      />
    </div>
  );
}
