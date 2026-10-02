import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { Image } from "@/components/ui/image";
import GlassCard from "./ui/GlassCard";
import MagneticButton from "./ui/MagneticButton";
import ProjectModal from "./ProjectModal";
import SectionHeading from "./ui/SectionHeading";
import { schoolErp } from "@/data/projects";
import { fadeUp, slideLeft, slideRight, viewportOnce } from "@/animations/variants";

export default function Projects() {
  const [open, setOpen] = useState(false);

  return (
    <section className="relative mx-auto max-w-7xl px-6 pb-28 sm:px-8 lg:px-10">
      <SectionHeading
        overline="Project"
        title="School ERP"
        description="School Management System — digitally managing school operations, from student records to exams and communication."
      />
      <div className="relative grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <motion.div
          variants={slideRight}
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
            {schoolErp.tagline}
          </motion.p>
          <motion.h3
            className="mt-3 font-heading text-3xl font-extrabold bg-gradient-to-r from-white via-orange-200 to-yellow-200 bg-clip-text text-transparent sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            {schoolErp.name}
          </motion.h3>
          <motion.p
            className="mt-5 text-sm leading-relaxed text-white/70"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {schoolErp.description}
          </motion.p>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="mt-7 grid grid-cols-1 gap-2 sm:grid-cols-2"
          >
            {schoolErp.highlights.map((highlight) => (
              <motion.div
                key={highlight.label}
                whileHover={{ scale: 1.02, x: 5 }}
                className="flex items-center gap-3 rounded-xl border border-orange-500/20 bg-gradient-to-r from-orange-500/5 to-transparent px-4 py-3 transition-all hover:border-orange-400/40"
                data-cursor
              >
                <motion.span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-yellow-500/10"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <highlight.icon className="h-4 w-4" style={{ color: highlight.color }} />
                </motion.span>
                <span className="text-sm text-white/75">{highlight.label}</span>
              </motion.div>
            ))}
          </motion.div>
          <div className="mt-6 flex flex-wrap gap-2">
            {schoolErp.tech.map((tech) => (
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
            <MagneticButton href={schoolErp.liveUrl} external variant="primary">
              <ExternalLink className="h-4 w-4" />
              Live Project
            </MagneticButton>
            <MagneticButton onClick={() => setOpen(true)} variant="ghost">
              <ArrowUpRight className="h-4 w-4" />
              Case Study
            </MagneticButton>
          </div>
        </motion.div>
        <motion.div
          variants={slideLeft}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="lg:col-span-7"
        >
          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
            <GlassCard
              tilt
              className="overflow-hidden p-0 transition-all duration-500 hover:shadow-[0_0_60px_rgba(249,115,22,0.3)] border border-orange-500/20 hover:border-orange-400/40"
            >
              <Image
                src={schoolErp.image}
                alt="School ERP — light-line blueprint visualization"
                className="aspect-[16/9] w-full"
              />
              <div className="grid grid-cols-2 gap-3 border-t border-orange-500/20 p-5 bg-gradient-to-br from-orange-950/30 to-transparent sm:grid-cols-4">
                {schoolErp.featureGroups.map((group) => (
                  <motion.div
                    key={group.title}
                    whileHover={{ y: -2 }}
                    className="transition-transform"
                  >
                    <p className="text-xs font-semibold text-orange-300">{group.title}</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-white/50">
                      {group.items.join(" · ")}
                    </p>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>
      <ProjectModal project={schoolErp} open={open} onClose={() => setOpen(false)} />
    </section>
  );
}