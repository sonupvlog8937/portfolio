import type { RefObject } from "react";
import { useScroll, useSpring } from "framer-motion";

export function useScrollProgress(ref: RefObject<HTMLElement>) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.5"],
  });
  return useSpring(scrollYProgress, { stiffness: 120, damping: 26 });
}