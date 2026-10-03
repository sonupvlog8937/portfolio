import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const blobs = [
  {
    className: "-left-48 -top-48 h-[36rem] w-[36rem] bg-gradient-to-br from-orange-500/30 via-yellow-500/25 to-orange-400/30",
    anim: { x: [0, 80, -30, 0], y: [0, 50, -20, 0], scale: [1, 1.1, 0.95, 1] },
    duration: 30,
  },
  {
    className: "-right-56 top-1/4 h-[40rem] w-[40rem] bg-gradient-to-bl from-purple-500/30 via-pink-500/25 to-orange-500/30",
    anim: { x: [0, -70, 30, 0], y: [0, -60, 20, 0], scale: [1, 0.9, 1.05, 1] },
    duration: 34,
  },
  {
    className: "-left-40 bottom-0 h-[34rem] w-[34rem] bg-gradient-to-tr from-cyan-500/30 via-blue-500/25 to-orange-500/30",
    anim: { x: [0, 50, -40, 0], y: [0, -40, 30, 0], scale: [1, 1.05, 0.9, 1] },
    duration: 38,
  },
  {
    className: "right-1/4 bottom-1/4 h-[32rem] w-[32rem] bg-gradient-to-br from-green-500/25 via-yellow-500/25 to-red-500/25",
    anim: { x: [0, -40, 60, 0], y: [0, 30, -50, 0], scale: [1, 0.95, 1.1, 1] },
    duration: 42,
  },
  {
    className: "left-1/3 top-1/3 h-[28rem] w-[28rem] bg-gradient-to-tl from-orange-600/25 via-yellow-500/25 to-orange-500/25",
    anim: { x: [0, 30, -50, 0], y: [0, -30, 40, 0], scale: [1, 1.1, 0.95, 1] },
    duration: 36,
  },
  {
    className: "right-1/3 top-1/2 h-[30rem] w-[30rem] bg-gradient-to-br from-indigo-500/25 via-purple-500/25 to-pink-500/25",
    anim: { x: [0, -50, 40, 0], y: [0, -20, 30, 0], scale: [1, 0.95, 1.1, 1] },
    duration: 40,
  },
];

// Enhanced floating fire embers - ZYADA INTENSE
const FireEmbers = () => {
  const [embers, setEmbers] = useState<Array<{ 
    id: number; 
    x: number; 
    delay: number; 
    duration: number;
    size: number;
    color: string;
    intensity: number;
  }>>([]);

  useEffect(() => {
    // 40 embers instead of 15
    const emberArray = Array.from({ length: 40 }, (_, i) => {
      const colors = ["#ff2800", "#ff4500", "#ff6b00", "#ff8500", "#ffa500", "#ffb700", "#ffd700"];
      return {
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 10 + Math.random() * 12,
        size: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        intensity: Math.random() * 0.5 + 0.5,
      };
    });
    setEmbers(emberArray);
  }, []);

  return (
    <>
      {embers.map((ember) => (
        <motion.div
          key={ember.id}
          className="absolute rounded-full"
          style={{
            left: `${ember.x}%`,
            bottom: "-20px",
            width: `${ember.size}px`,
            height: `${ember.size}px`,
            backgroundColor: ember.color,
            boxShadow: `0 0 ${ember.size * 4}px ${ember.color}, 0 0 ${ember.size * 8}px ${ember.color}88`,
            filter: `blur(${ember.size * 0.3}px)`,
          }}
          animate={{
            y: [0, -1200],
            x: [0, (Math.random() - 0.5) * 100],
            opacity: [0, ember.intensity, ember.intensity * 0.8, 0],
            scale: [0, 1.5, 1.2, 0.5, 0],
          }}
          transition={{
            duration: ember.duration,
            delay: ember.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
};

// Floating fire particles in random positions
const FloatingFireParticles = () => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    duration: number;
  }>>([]);

  useEffect(() => {
    const particleArray = Array.from({ length: 30 }, (_, i) => {
      const colors = ["#ff4500", "#ff6b00", "#ffa500", "#ffb700", "#ff8500"];
      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: 3 + Math.random() * 4,
      };
    });
    setParticles(particleArray);
  }, []);

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 5}px ${particle.color}`,
            filter: `blur(${particle.size * 0.4}px)`,
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
            y: [0, -30, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
};

export default function Background() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-950 to-black">
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      
      {/* Animated gradient blobs */}
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-[130px] ${blob.className}`}
          animate={blob.anim}
          transition={{ duration: blob.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      
      {/* Fire embers rising effect - INTENSE */}
      <FireEmbers />
      
      {/* Floating fire particles */}
      <FloatingFireParticles />
      
      {/* Multiple fire glow layers */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 20% 80%, rgba(255, 69, 0, 0.15) 0%, transparent 50%)",
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 80% 20%, rgba(255, 140, 0, 0.15) 0%, transparent 50%)",
        }}
        animate={{
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(255, 165, 0, 0.1) 0%, transparent 60%)",
        }}
        animate={{
          opacity: [0.2, 0.5, 0.2],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      
      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" />
      
      {/* Noise texture */}
      <div className="noise absolute inset-0 opacity-[0.04]" />
      
      {/* Bottom gradient fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
      
      {/* Animated scan lines - Multiple */}
      <motion.div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent"
        animate={{
          y: [0, "100vh"],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      <motion.div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent"
        animate={{
          y: ["50vh", "150vh"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}