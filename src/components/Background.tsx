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

// Floating fire embers
const FireEmbers = () => {
  const [embers, setEmbers] = useState<Array<{ id: number; x: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    const emberArray = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 10,
    }));
    setEmbers(emberArray);
  }, []);

  return (
    <>
      {embers.map((ember) => (
        <motion.div
          key={ember.id}
          className="absolute w-1 h-1 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(255,107,0,0.8)]"
          style={{
            left: `${ember.x}%`,
            bottom: "-10px",
          }}
          animate={{
            y: [0, -1000],
            opacity: [0, 1, 1, 0],
            scale: [0, 1.5, 1, 0],
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
      
      {/* Fire embers rising effect */}
      <FireEmbers />
      
      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" />
      
      {/* Noise texture */}
      <div className="noise absolute inset-0 opacity-[0.04]" />
      
      {/* Bottom gradient fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
      
      {/* Animated scan line effect */}
      <motion.div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent"
        animate={{
          y: [0, "100vh"],
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