import { motion } from "framer-motion";
import { Check, Copy, Download, Github, Mail, Phone } from "lucide-react";
import { useState } from "react";
import GlassCard from "./ui/GlassCard";
import MagneticButton from "./ui/MagneticButton";
import SectionHeading from "./ui/SectionHeading";
import { profile } from "@/data/resume";
import { downloadResume } from "@/lib/resumePdf";
import { fadeUp, staggerContainer, viewportOnce } from "@/animations/variants";

const channels = [
  { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { icon: Phone, label: "Mobile", value: profile.phone, href: profile.phoneHref },
  { icon: Github, label: "GitHub", value: "sonupvlog8937", href: profile.github },
];

export default function Contact() {
  const [emailCopied, setEmailCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setEmailCopied(true);
      window.setTimeout(() => setEmailCopied(false), 2000);
    } catch {
      setEmailCopied(false);
    }
  };

  return (
    <section id="contact" className="relative mx-auto max-w-6xl px-6 pb-28 sm:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-10 h-72 w-[50rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-orange-500/10 blur-[130px]"
      />
      <SectionHeading
        overline="Get In Touch"
        title="Let's Build Something Amazing"
        description="Have a project or an opportunity in mind? Reach out — I'd love to hear about it."
      />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid gap-4 sm:grid-cols-3"
      >
        {channels.map((channel) => (
          <motion.a
            key={channel.label}
            variants={fadeUp}
            href={channel.href}
            target={channel.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="group"
            whileHover={{ y: -5 }}
          >
            <GlassCard
              tilt
              className="flex h-full flex-col items-center gap-3 p-6 text-center transition-all border border-orange-500/20 hover:border-orange-400/40 hover:shadow-[0_0_35px_rgba(249,115,22,0.3)]"
            >
              <motion.span
                className="flex h-12 w-12 items-center justify-center rounded-full border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 text-orange-400 transition-transform duration-300"
                whileHover={{ scale: 1.1, rotate: 10 }}
              >
                <channel.icon className="h-5 w-5" />
              </motion.span>
              <p className="text-xs uppercase tracking-widest text-white/50">{channel.label}</p>
              <p className="break-all text-sm font-medium text-white/90">{channel.value}</p>
            </GlassCard>
          </motion.a>
        ))}
      </motion.div>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-12 flex flex-wrap justify-center gap-4"
      >
        <MagneticButton onClick={() => downloadResume()} variant="primary">
          <Download className="h-4 w-4" />
          Download Resume
        </MagneticButton>
        <MagneticButton onClick={copyEmail} variant="ghost" aria-label="Copy email address">
          {emailCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {emailCopied ? "Email Copied" : "Copy Email"}
        </MagneticButton>
        <MagneticButton href={profile.github} external variant="ghost">
          <Github className="h-4 w-4" />
          GitHub
        </MagneticButton>
      </motion.div>
    </section>
  );
}