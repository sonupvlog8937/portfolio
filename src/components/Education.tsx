import { motion } from "framer-motion";
import { Award, GraduationCap, School } from "lucide-react";
import GlassCard from "./ui/GlassCard";
import SectionHeading from "./ui/SectionHeading";
import { education, qualifications } from "@/data/resume";
import { fadeUp, staggerContainer, viewportOnce } from "@/animations/variants";

export default function Education() {
  return (
    <section id="education" className="relative mx-auto max-w-6xl px-6 pb-28 sm:px-8">
      <SectionHeading overline="Background" title="Education & Qualifications" />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid gap-6 md:grid-cols-2"
      >
        {education.map((item) => {
          const Icon = item.icon === "diploma" ? GraduationCap : School;
          return (
            <motion.div key={item.title} variants={fadeUp} whileHover={{ y: -5 }}>
              <GlassCard tilt className="h-full p-6 sm:p-8 border border-orange-500/20 hover:border-orange-400/40">
                <div className="flex items-start gap-4">
                  <motion.span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 text-orange-400"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Icon className="h-6 w-6" />
                  </motion.span>
                  <div>
                    <motion.h3
                      className="font-heading text-lg font-bold leading-snug text-white"
                      whileHover={{ color: "#FBBF24" }}
                    >
                      {item.title}
                    </motion.h3>
                    <p className="mt-1 text-sm text-white/60">{item.place}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.period && (
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs text-orange-300"
                        >
                          {item.period}
                        </motion.span>
                      )}
                      {item.score && (
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className="rounded-full border border-green-500/25 bg-green-500/10 px-3 py-1 text-xs text-green-300"
                        >
                          {item.score}
                        </motion.span>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-10"
      >
        <motion.h3
          className="flex items-center gap-2 font-heading text-lg font-bold bg-gradient-to-r from-orange-300 to-yellow-300 bg-clip-text text-transparent"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Award className="h-5 w-5 text-orange-400" />
          Qualifications
        </motion.h3>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {qualifications.map((qualification) => (
            <motion.span
              key={qualification}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(249,115,22,0.2)" }}
              className="rounded-full border border-orange-500/20 bg-white/5 px-4 py-2 text-xs text-white/70 cursor-pointer transition-colors"
            >
              {qualification}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}