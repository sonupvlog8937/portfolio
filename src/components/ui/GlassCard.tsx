import { useRef, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
  maxTilt?: number;
}

export default function GlassCard({
  children,
  className,
  tilt = false,
  maxTilt = 8,
}: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const springX = useSpring(rotateX, { stiffness: 220, damping: 22 });
  const springY = useSpring(rotateY, { stiffness: 220, damping: 22 });
  const springGlowX = useSpring(glowX, { stiffness: 150, damping: 20 });
  const springGlowY = useSpring(glowY, { stiffness: 150, damping: 20 });

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    
    glowX.set(px * 100);
    glowY.set(py * 100);
    
    if (tilt) {
      const centerX = px - 0.5;
      const centerY = py - 0.5;
      rotateY.set(centerX * maxTilt);
      rotateX.set(-centerY * maxTilt);
    }
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
    glowX.set(50);
    glowY.set(50);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={reset}
      style={tilt ? { rotateX: springX, rotateY: springY, transformPerspective: 900 } : undefined}
      className={cn(
        "glass group relative rounded-2xl bg-gradient-to-br from-black/30 via-black/20 to-transparent backdrop-blur-xl overflow-hidden",
        className
      )}
      data-cursor
    >
      {/* Animated glow effect that follows mouse */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${springGlowX}% ${springGlowY}%, rgba(255, 107, 0, 0.15), transparent 40%)`,
        }}
      />
      
      {/* Animated border gradient */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(800px circle at ${springGlowX}% ${springGlowY}%, rgba(255, 165, 0, 0.2), transparent 40%)`,
          maskImage: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          padding: "1px",
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}