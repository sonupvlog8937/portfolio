import { motion, useScroll, useTransform } from "framer-motion";
import { ReactNode } from "react";

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  yOffset?: number;
}

export default function ParallaxSection({ children, className = "", yOffset = 50 }: ParallaxSectionProps) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, yOffset]);

  return (
    <motion.div style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
