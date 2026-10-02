import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Image } from "@/components/ui/image";
import GlassCard from "./ui/GlassCard";
import SectionHeading from "./ui/SectionHeading";
import { profile } from "@/data/resume";
import { fadeUp, slideLeft, slideRight, staggerContainer, viewportOnce } from "@/animations/variants";

const focusAreas = [
  "MERN Stack Development",
  "E-commerce Platforms",
  "REST API Development",
  "Responsive UI Development",
  "Database Management",
  "Debugging & Troubleshooting",
];

export default function About() {
  return (
    <section id="about" className="relative mx-auto max-w-7xl px-6 py-28 sm:px-8 lg:px-10">
      <SectionHeading overline="Who I Am" title="About Me" />
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div variants={slideRight} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
            <GlassCard tilt className="overflow-hidden p-0 border border-orange-500/20 hover:border-orange-400/40">
              <Image
                src={profile.aboutImage}
                alt="Abstract 3D artwork representing Sonu Kumar's development work"
                className="aspect-[16/10] w-full lg:aspect-[4/3]"
              />
              <div className="p-6 bg-gradient-to-br from-orange-950/50 to-transparent">
                <p className="font-heading text-xl font-bold bg-gradient-to-r from-orange-300 to-yellow-300 bg-clip-text text-transparent">{profile.name}</p>
                <p className="mt-1 text-sm text-orange-400">{profile.role} | Full Stack Web Developer</p>
                <p className="mt-3 flex items-center gap-1.5 text-sm text-white/60">
                  <MapPin className="h-4 w-4 text-orange-400" />
                  {profile.location}
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
        <motion.div variants={slideLeft} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <motion.h3
            className="font-heading text-2xl font-bold leading-snug text-white sm:text-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Full Stack developer — <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">from interface to database.</span>
          </motion.h3>
          <motion.p
            className="mt-5 leading-relaxed text-white/70"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            I'm a passionate Full Stack / MERN developer from Bihar, India, focused on building
            modern, responsive, high-quality web applications. From crafting clean,
            pixel-perfect interfaces in React to designing REST APIs and managing data in
            MongoDB, I build real-world products end-to-end.
          </motion.p>
          <motion.p
            className="mt-4 leading-relaxed text-white/70"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            My project work spans a full e-commerce &amp; quick-commerce platform and a complete
            school management system — each built with authentication, admin tooling and a
            responsive interface that works beautifully on every device.
          </motion.p>
          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="mt-8 flex flex-wrap gap-2"
          >
            {focusAreas.map((area) => (
              <motion.li
                key={area}
                variants={fadeUp}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(249,115,22,0.2)" }}
                className="rounded-full border border-orange-500/20 bg-white/5 px-4 py-1.5 text-xs text-white/70 cursor-pointer transition-colors"
              >
                {area}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}