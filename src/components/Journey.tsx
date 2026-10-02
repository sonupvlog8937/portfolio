import { useRef } from "react";
import { motion } from "framer-motion";
import SectionHeading from "./ui/SectionHeading";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { journey } from "@/data/resume";
import { fadeUp, viewportOnce } from "@/animations/variants";
import { cn } from "@/lib/utils";

export default function Journey() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  return (
    <section id="experience" ref={ref} className="relative mx-auto max-w-5xl px-6 py-28 sm:px-8">
      <SectionHeading
        overline="Experience"
        title="Development Journey"
        description="A progression built on real projects — from programming fundamentals to complete production platforms."
      />
      <div className="relative">
        <div aria-hidden className="absolute left-5 top-0 h-full w-px bg-orange-500/20 md:left-1/2" />
        <motion.div
          aria-hidden
          style={{ scaleY: progress }}
          className="absolute left-5 top-0 h-full w-px origin-top bg-gradient-to-b from-orange-500 via-yellow-500 to-orange-500 md:left-1/2"
        />
        <div className="space-y-12">
          {journey.map((item, i) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="relative flex md:items-center"
              whileHover={{ x: i % 2 === 0 ? 5 : -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.span
                aria-hidden
                className="absolute left-5 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-orange-400/50 bg-orange-950 md:left-1/2"
                style={{ boxShadow: `0 0 12px ${item.accent}` }}
                whileHover={{ scale: 1.2 }}
              />
              <div
                className={cn(
                  "ml-12 md:ml-0 md:w-1/2",
                  i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                )}
              >
                <motion.p
                  className="text-xs font-semibold uppercase tracking-[0.25em] bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {item.phase}
                </motion.p>
                <motion.h3
                  className="mt-2 font-heading text-xl font-bold text-white"
                  whileHover={{ color: "#FBBF24" }}
                  transition={{ duration: 0.2 }}
                >
                  {item.title}
                </motion.h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}