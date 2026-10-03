import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { profile } from "@/data/resume";

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
    <section id="about" className="px-3 pt-[clamp(3rem,9vw,8rem)] sm:px-4">
      <div className="mx-auto max-w-[1100px] rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-[#171715] to-[#0f0f0d] px-6 py-16 text-center sm:px-14 sm:py-24">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-cream/60">About me</p>

        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-10 max-w-[18ch] font-heading text-[clamp(2.2rem,5.4vw,4.9rem)] font-normal leading-[1.04] tracking-[-0.03em] text-cream sm:max-w-none"
        >
          I am {profile.name},{" "}
          <em className="font-serif font-normal italic tracking-normal">
            a MERN developer building for the web.
          </em>
        </motion.h2>

        <div className="mx-auto mt-10 max-w-2xl space-y-4 text-base leading-relaxed text-cream/60 sm:text-lg">
          <p>
            Full Stack developer from Bihar, India, focused on modern, responsive,
            high-quality web applications — pixel-perfect React interfaces, REST APIs and
            data in MongoDB, built end-to-end.
          </p>
          <p>
            My work spans a full e-commerce and quick-commerce platform and a complete school
            management system, each with authentication, admin tooling and a layout that
            works on every device.
          </p>
        </div>

        <ul className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-2">
          {focusAreas.map((area) => (
            <li
              key={area}
              className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs text-cream/70"
            >
              {area}
            </li>
          ))}
        </ul>

        <p className="mt-8 inline-flex items-center gap-1.5 text-sm text-cream/45">
          <MapPin className="h-4 w-4" />
          {profile.location}
        </p>
      </div>
    </section>
  );
}
