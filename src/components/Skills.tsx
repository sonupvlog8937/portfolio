import { motion } from "framer-motion";
import GlassCard from "./ui/GlassCard";
import SectionHeading from "./ui/SectionHeading";
import { skillCategories } from "@/data/skills";
import { fadeUp, staggerContainer, viewportOnce, float } from "@/animations/variants";

export default function Skills() {
  return (
    <section id="skills" className="relative mx-auto max-w-7xl px-6 py-28 sm:px-8 lg:px-10">
      <SectionHeading
        overline="Tech Stack"
        title="Skills & Technologies"
        description="The tools and technologies I use to design, build and ship complete web applications."
      />
      <div className="space-y-14">
        {skillCategories.map((category) => (
          <motion.div key={category.name} variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            <div className="mb-5 flex items-center gap-3">
              <motion.span
                aria-hidden
                className="h-px w-10"
                style={{ background: category.accent }}
                initial={{ width: 0 }}
                whileInView={{ width: 40 }}
                transition={{ duration: 0.6 }}
              />
              <motion.h3
                className="font-heading text-lg font-bold uppercase tracking-widest bg-gradient-to-r from-orange-300 via-yellow-300 to-orange-300 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {category.name}
              </motion.h3>
            </div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
            >
              {category.skills.map((skill) => (
                <motion.div key={skill.name} variants={fadeUp}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <GlassCard
                      tilt
                      className="h-full p-4 text-center transition-all duration-300 hover:shadow-[0_0_35px_rgba(249,115,22,0.3)] sm:p-5 border border-orange-500/20 hover:border-orange-400/40"
                    >
                      <motion.div
                        className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 transition-all duration-300"
                        whileHover={{ scale: 1.1, rotate: 6 }}
                      >
                        <skill.icon className="h-5 w-5" style={{ color: skill.color }} />
                      </motion.div>
                      <motion.p
                        className="mt-3 text-xs font-medium leading-snug text-white/80 sm:text-sm"
                        whileHover={{ color: "#FBBF24" }}
                      >
                        {skill.name}
                      </motion.p>
                    </GlassCard>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}