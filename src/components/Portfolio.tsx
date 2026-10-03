import { motion } from "framer-motion";
import type { ReactNode } from "react";
import CustomCursor from "./CustomCursor";
import ScrollProgress from "./ScrollProgress";
import Navbar from "./Navbar";
import Hero from "./Hero";
import About from "./About";
import Skills from "./Skills";
import FeaturedProject from "./FeaturedProject";
import Projects from "./Projects";
import Journey from "./Journey";
import Education from "./Education";
import Contact from "./Contact";
import Footer from "./Footer";

// Every section after About sits in the same dark rounded card.
function Card({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="px-3 sm:px-4"
    >
      <div className="mx-auto max-w-[1440px] overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#121211]">
        {children}
      </div>
    </motion.div>
  );
}

export default function Portfolio() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-black font-body text-cream antialiased">
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <About />
        <div className="mt-6 flex flex-col gap-6 pb-6">
          <Card><Skills /></Card>
          <Card><FeaturedProject /></Card>
          <Card><Projects /></Card>
          <Card><Journey /></Card>
          <Card><Education /></Card>
          <Card><Contact /></Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
