import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[95] h-[3px] origin-left bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.5)]"
      style={{ scaleX }}
    />
  );
}