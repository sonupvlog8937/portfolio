import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface FireParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  velocity: { x: number; y: number };
  life: number;
  color: string;
}

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [particles, setParticles] = useState<FireParticle[]>([]);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 140, damping: 18, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 140, damping: 18, mass: 0.4 });
  const particleIdRef = useRef(0);
  const lastPosRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("custom-cursor");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);

      // Create fire particles on mouse move
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 2) {
        // Create multiple particles for denser trail
        const particleCount = Math.min(Math.floor(distance / 5), 3);
        const newParticles: FireParticle[] = [];

        for (let i = 0; i < particleCount; i++) {
          const colors = ["#ff4500", "#ff6b00", "#ff8c00", "#ffa500", "#ffd700"];
          newParticles.push({
            id: particleIdRef.current++,
            x: e.clientX + (Math.random() - 0.5) * 10,
            y: e.clientY + (Math.random() - 0.5) * 10,
            size: Math.random() * 6 + 3,
            opacity: 1,
            velocity: {
              x: (Math.random() - 0.5) * 2,
              y: -Math.random() * 2 - 1,
            },
            life: 1,
            color: colors[Math.floor(Math.random() * colors.length)],
          });
        }

        setParticles((prev) => [...prev, ...newParticles]);
      }

      lastPosRef.current = { x: e.clientX, y: e.clientY };
    };

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      setHovering(!!target?.closest("a, button, [data-cursor]"));
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);

    // Animate particles
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.velocity.x,
            y: p.y + p.velocity.y,
            opacity: p.opacity * 0.92,
            life: p.life - 0.02,
            size: p.size * 0.97,
          }))
          .filter((p) => p.life > 0 && p.opacity > 0.01)
      );
    }, 16);

    return () => {
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      clearInterval(interval);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* Fire Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-[98] rounded-full"
          style={{
            x: particle.x - particle.size / 2,
            y: particle.y - particle.size / 2,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            filter: "blur(1px)",
          }}
        />
      ))}

      {/* Main cursor dot with glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-3 w-3 rounded-full"
        style={{
          x,
          y,
          marginLeft: -6,
          marginTop: -6,
          background: "radial-gradient(circle, #ff6b00 0%, #ff4500 50%, transparent 100%)",
          boxShadow: "0 0 20px #ff4500, 0 0 40px #ff6b00",
        }}
        animate={{
          scale: hovering ? 1.5 : 1,
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Outer ring with fire gradient */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[99] h-10 w-10 rounded-full"
        style={{
          x: ringX,
          y: ringY,
          marginLeft: -20,
          marginTop: -20,
          background: hovering
            ? "radial-gradient(circle, transparent 60%, rgba(255, 107, 0, 0.3) 70%, transparent 100%)"
            : "transparent",
          border: "2px solid transparent",
          borderImage: "linear-gradient(45deg, #ff4500, #ff6b00, #ffa500, #ff6b00, #ff4500) 1",
          borderRadius: "50%",
        }}
        animate={{
          scale: hovering ? 1.8 : 1,
          opacity: hovering ? 1 : 0.6,
          rotate: 360,
        }}
        transition={{
          scale: { duration: 0.25 },
          opacity: { duration: 0.25 },
          rotate: { duration: 3, repeat: Infinity, ease: "linear" },
        }}
      />

      {/* Additional glow effect on hover */}
      {hovering && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-[97] h-24 w-24 rounded-full"
          style={{
            x: ringX,
            y: ringY,
            marginLeft: -48,
            marginTop: -48,
            background: "radial-gradient(circle, rgba(255, 69, 0, 0.15) 0%, transparent 70%)",
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
        />
      )}
    </>
  );
}