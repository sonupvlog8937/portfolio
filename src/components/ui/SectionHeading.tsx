import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp, staggerContainer, viewportOnce } from "@/animations/variants";

interface SectionHeadingProps {
  overline: string;
  title: string;
  description?: string;
}

export default function SectionHeading({ overline, title, description }: SectionHeadingProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="mb-14 text-center"
    >
      <motion.p
        variants={fadeUp}
        className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.35em] bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent"
      >
        {overline}
      </motion.p>
      <motion.h2
        variants={fadeUp}
        className="font-heading text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-orange-200 to-yellow-200 bg-clip-text text-transparent sm:text-4xl lg:text-5xl"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          variants={fadeUp}
          className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base"
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}