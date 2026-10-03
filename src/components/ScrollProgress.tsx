import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });
  
  // Animate the glow intensity based on scroll progress
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.8, 1]);
  
  return (
    <>
      <motion.div
        aria-hidden
        className="fixed inset-x-0 top-0 z-[95] h-[3px] origin-left bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500"
        style={{ 
          scaleX,
          boxShadow: "0 0 20px rgba(249, 115, 22, 0.8), 0 0 40px rgba(251, 191, 36, 0.5)",
        }}
      >
        {/* Animated glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-400"
          style={{ opacity: glowOpacity }}
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>
      
      {/* Fire particle effect at the end of progress bar */}
      <motion.div
        aria-hidden
        className="fixed top-0 z-[96] h-2 w-2 rounded-full bg-orange-400"
        style={{
          left: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
          boxShadow: "0 0 15px rgba(249, 115, 22, 1), 0 0 30px rgba(251, 191, 36, 0.8)",
          y: -3,
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-yellow-300"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </>
  );
}