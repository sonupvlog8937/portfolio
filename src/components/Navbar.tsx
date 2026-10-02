import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { profile } from "@/data/resume";

const links = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const initials = profile.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        }),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    links.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <motion.nav
        aria-label="Main navigation"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "glass rounded-full transition-all duration-500 hidden md:flex",
          scrolled ? "shadow-[0_8px_40px_rgba(249,115,22,0.3)] bg-orange-950/80 backdrop-blur-xl" : "bg-orange-950/60 backdrop-blur-lg"
        )}
      >
        <div className="items-center gap-1 px-2 py-2">
          {links.map((link) => (
            <motion.a
              key={link.id}
              href={`#${link.id}`}
              className="relative px-4 py-2 text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {active === link.id && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-full border border-orange-400/30 bg-gradient-to-r from-orange-500/20 via-orange-400/15 to-yellow-500/20"
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                />
              )}
              <span
                className={cn(
                  "relative z-10 transition-colors duration-200",
                  active === link.id ? "text-orange-300 font-semibold" : "text-white/70 hover:text-orange-200"
                )}
              >
                {link.label}
              </span>
            </motion.a>
          ))}
        </div>
      </motion.nav>
      <motion.button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="fixed right-4 top-4 z-50 md:hidden rounded-full p-3 glass text-orange-300 transition-colors hover:bg-orange-500/20"
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="glass fixed inset-x-4 top-20 z-40 rounded-2xl p-3 md:hidden bg-gradient-to-br from-orange-950/95 to-orange-900/90 backdrop-blur-xl border border-orange-500/20"
          >
            {links.map((link, index) => (
              <motion.a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "block rounded-xl px-4 py-3 text-sm transition-colors",
                  active === link.id
                    ? "bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-orange-300 border border-orange-400/30"
                    : "text-white/70 hover:bg-orange-500/10 hover:text-orange-200"
                )}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}