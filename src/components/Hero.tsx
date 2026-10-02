import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, Download, Sparkles } from "lucide-react";
import HeroScene from "./3d/HeroScene";
import SceneBoundary from "./3d/SceneBoundary";
import MagneticButton from "./ui/MagneticButton";
import { profile } from "../data/resume";
import { downloadResume } from "../lib/resumePdf";
import { fadeUp, staggerContainer } from "../animations/variants";

export default function Hero() {
  const reduced = !!useReducedMotion();
  const words = ["Building", "Modern"];

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 md:left-1/4">
        <SceneBoundary>
          <HeroScene reduced={reduced} />
        </SceneBoundary>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/50 to-transparent" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-28 pt-36 sm:px-8 lg:px-10">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div
            variants={fadeUp}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-gradient-to-r from-orange-500/20 via-orange-400/15 to-yellow-500/20 px-4 py-1.5 text-xs font-medium text-orange-300 backdrop-blur-sm shadow-lg shadow-orange-500/20"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-400" />
            </span>
            Available for opportunities
          </motion.div>
          <motion.p
            variants={fadeUp}
            className="font-heading text-sm font-bold uppercase tracking-[0.45em] bg-gradient-to-r from-orange-300 via-yellow-300 to-orange-300 bg-clip-text text-transparent"
          >
            {profile.name}
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="mt-4 font-heading text-[clamp(2.6rem,8vw,6rem)] font-extrabold leading-[1.04] tracking-tight bg-gradient-to-r from-white via-orange-200 to-yellow-200 bg-clip-text text-transparent"
          >
            {words.map((word, index) => (
              <motion.span
                key={word}
                className="mr-4 inline-block"
                whileHover={{ scale: 1.05, color: "#F97316" }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {word}
              </motion.span>
            ))}
            <motion.span
              className="block bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0%", "100%", "0%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                backgroundSize: "200% auto",
              }}
            >
              Digital Experiences
            </motion.span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
          >
            {profile.role} crafting modern, responsive, high-quality web applications —
            pixel-perfect React interfaces backed by robust Node.js REST APIs and MongoDB.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton href="#projects" variant="primary">
              <Sparkles className="h-4 w-4" />
              View My Work
            </MagneticButton>
            <MagneticButton onClick={() => downloadResume()} variant="ghost">
              <Download className="h-4 w-4" />
              Download Resume
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>
      <motion.a
        href="#about"
        aria-label="Scroll to the about section"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-orange-400/60 transition-colors hover:text-orange-300"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowDown className="h-5 w-5" />
      </motion.a>
    </section>
  );
}