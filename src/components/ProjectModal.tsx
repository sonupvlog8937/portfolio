import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import { Image } from "@/components/ui/image";
import type { Project } from "@/data/projects";

interface ProjectModalProps {
  project: Project;
  open: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, open, onClose }: ProjectModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} aria-hidden />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${project.name} case study`}
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="glass relative z-10 max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: project.accent }}>
                  {project.type}
                </p>
                <h3 className="mt-1 font-heading text-2xl font-extrabold text-white sm:text-3xl">
                  {project.name}
                </h3>
                <p className="mt-1 text-sm text-white/50">{project.tagline}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close case study"
                className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <Image
              src={project.image}
              alt={`${project.name} — ${project.tagline}`}
              className="mt-6 aspect-video w-full rounded-xl border border-white/10"
            />
            <p className="mt-6 text-sm leading-relaxed text-white/60">{project.description}</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {project.featureGroups.map((group) => (
                <div key={group.title} className="rounded-xl border border-white/8 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-white/90">{group.title}</p>
                  <ul className="mt-2 space-y-1.5">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs leading-relaxed text-white/55">
                        <span
                          aria-hidden
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: project.accent }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/60"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="mt-8">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-spectrum inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-[0_0_28px_rgba(0,242,255,0.25)] transition-shadow hover:shadow-[0_0_45px_rgba(0,242,255,0.45)]"
              >
                <ExternalLink className="h-4 w-4" />
                Visit Live Project
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}