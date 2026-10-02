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

export default function Portfolio() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black font-body text-white antialiased">
      <Background />
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <FeaturedProject />
        <Projects />
        <Journey />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}