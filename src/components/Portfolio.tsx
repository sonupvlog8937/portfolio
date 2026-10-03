import { motion, AnimatePresence } from "framer-motion";
import Background from "./Background";
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

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  }
};

export default function Portfolio() {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black font-body text-white antialiased overflow-x-hidden"
        initial="initial"
        animate="animate"
        exit="exit"
        {...pageTransition}
      >
        <Background />
        <CustomCursor />
        <ScrollProgress />
        <Navbar />
        <main>
          <Hero />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
          >
            <About />
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
          >
            <Skills />
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
          >
            <FeaturedProject />
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
          >
            <Projects />
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
          >
            <Journey />
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
          >
            <Education />
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
          >
            <Contact />
          </motion.div>
        </main>
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
}