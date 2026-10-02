import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Lock } from "lucide-react";
import { Image } from "@/components/ui/image";
import GlassCard from "./ui/GlassCard";
import MagneticButton from "./ui/MagneticButton";
import ProjectModal from "./ProjectModal";
import SectionHeading from "./ui/SectionHeading";
import { zeedaddy } from "@/data/projects";
import { fadeUp, slideLeft, slideRight, staggerContainer, viewportOnce } from "@/animations/variants";

export default function FeaturedProject() {
  const [open, setOpen] = useState(false);

  return (
    <section id="projects" className="relative mx-auto max-w-7xl px-6 py-28 sm:px-8 lg:px-10">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-96 w-[60rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-500/8 via-yellow-500/8 to-orange-500/8 blur-[140px]"
      />
      <SectionHeading overline="Featured Project" title={zeedaddy.name} description={zeedaddy.tagline} />
      <div className="relative grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <motion.div
          variants={slideRight}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="lg:col-span-7"
        >
          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
            <GlassCard
              tilt
              className="overflow-hidden p-0 transition-all duration-500 border border-orange-500/20 hover:border-orange-400/40 hover:shadow-[0_0_60px_rgba(249,115,22,0.3)]"
            >
              <div className="flex items-center gap-3 border-b border-orange-500/20 px-4 py-3 bg-gradient-to-r from-orange-950/30 to-transparent">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-orange-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-pink-400/80" />
                </div>
                <div className="mx-auto flex items-center gap-1.5 rounded-md bg-orange-500/10 px-3 py-1 text-xs text-orange-300">
                  <Lock className="h-3 w-3" />
                  zeedaddy.in
                </div>
                <div className="w-10" aria-hidden />
              </div>
              <Image
                src={zeedaddy.image}
                alt="Zeedaddy — e-commerce and quick commerce platform interface"
                className="aspect-[16/10] w-full"
              />
            </GlassCard>
          </motion.div>
        </motion.div>
        <motion.div
          variants={slideLeft}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="lg:col-span-5"
        >
          <motion.p
            className="text-xs font-semibold uppercase tracking-[0.35em] bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {zeedaddy.type}
          </motion.p>
          <motion.h3
            className="mt-3 font-heading text-3xl font-extrabold bg-gradient-to-r from-white via-orange-200 to-yellow-200 bg-clip-text text-transparent sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            {zeedaddy.name}
          </motion.h3>
          <motion.p
            className="mt-2 text-sm text-white/60"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {zeedaddy.tagline}
          </motion.p>
          <motion.p
            className="mt-5 text-sm leading-relaxed text-white/70"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {zeedaddy.description}
          </motion.p>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-3"
          >
            {zeedaddy.highlights.map((highlight) => (
              <motion.div
                key={highlight.label}
                variants={fadeUp}
                whileHover={{ scale: 1.05, x: 5 }}
                className="flex items-center gap-2 rounded-lg border border-orange-500/20 bg-gradient-to-r from-orange-500/5 to-transparent px-3 py-2 text-[11px] text-white/70 transition-all hover:border-orange-400/40 sm:text-xs"
                data-cursor
              >
                <highlight.icon className="h-3.5 w-3.5 shrink-0" style={{ color: highlight.color }} />
                {highlight.label}
              </motion.div>
            ))}
          </motion.div>
          <div className="mt-6 flex flex-wrap gap-2">
            {zeedaddy.tech.map((tech) => (
              <motion.span
                key={tech}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(249,115,22,0.2)" }}
                className="rounded-full border border-orange-500/20 px-3 py-1 text-[11px] text-white/60 cursor-pointer transition-colors"
              >
                {tech}
              </motion.span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <MagneticButton href={zeedaddy.liveUrl} external variant="primary">
              <ExternalLink className="h-4 w-4" />
              Live Project
            </MagneticButton>
            <MagneticButton onClick={() => setOpen(true)} variant="ghost">
              <ArrowUpRight className="h-4 w-4" />
              Case Study
            </MagneticButton>
          </div>
        </motion.div>
      </div>
      <ProjectModal project={zeedaddy} open={open} onClose={() => setOpen(false)} />
    </section>
  );
}