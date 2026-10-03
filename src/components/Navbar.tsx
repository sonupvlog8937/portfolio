import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

// label -> section ids it covers
const items = [
  { label: "Origin", ids: ["home", "about"] },
  { label: "Skills", ids: ["skills"] },
  { label: "Work", ids: ["projects"] },
  { label: "Journey", ids: ["experience", "education"] },
  { label: "Contact", ids: ["contact"] },
];

const idToLabel = Object.fromEntries(items.flatMap((i) => i.ids.map((id) => [id, i.label])));

export default function Navbar() {
  const [active, setActive] = useState("Origin");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting && idToLabel[e.target.id]) setActive(idToLabel[e.target.id]);
        }),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    Object.keys(idToLabel).forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* desktop: floating side nav */}
      <motion.nav
        aria-label="Sections"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed right-4 top-1/2 z-50 hidden -translate-y-1/2 rounded-[1.6rem] border border-white/10 bg-black/65 p-2 backdrop-blur-xl lg:block"
      >
        <ul className="flex flex-col gap-1">
          {items.map(({ label, ids }) => {
            const on = active === label;
            return (
              <li key={label}>
                <a
                  href={`#${ids[0]}`}
                  data-cursor
                  aria-current={on ? "true" : undefined}
                  className={cn(
                    "flex items-center justify-end gap-3 rounded-xl border px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300",
                    on
                      ? "border-white/10 bg-white/[0.06] text-cream"
                      : "border-transparent text-cream/55 hover:text-cream"
                  )}
                >
                  {label}
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full border transition-all duration-300",
                      on
                        ? "border-[#ff5a1f] bg-[#ff5a1f] shadow-[0_0_8px_#ff5a1f]"
                        : "border-cream/40 bg-transparent"
                    )}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </motion.nav>

      {/* mobile / tablet: compact menu */}
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="fixed right-4 top-4 z-50 grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-black/65 text-cream backdrop-blur-xl lg:hidden"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed right-4 top-[4.25rem] z-40 w-52 rounded-3xl border border-white/10 bg-black/85 p-2 backdrop-blur-xl lg:hidden"
          >
            {items.map(({ label, ids }) => (
              <a
                key={label}
                href={`#${ids[0]}`}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.2em]",
                  active === label ? "bg-white/[0.06] text-cream" : "text-cream/55"
                )}
              >
                {label}
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full border",
                    active === label ? "border-[#ff5a1f] bg-[#ff5a1f]" : "border-cream/40"
                  )}
                />
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
