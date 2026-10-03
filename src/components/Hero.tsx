import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { downloadResume } from "../lib/resumePdf";

/**
 * Put your own photo at /public/hero.jpg (wide landscape works best).
 * If the file is missing, the CSS dusk scene below is shown instead.
 */
const HERO_IMAGE = "/hero.jpg";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const [imageOk, setImageOk] = useState(true);

  return (
    <section id="home" className="px-3 sm:px-4">
      <div className="relative mx-auto h-[78svh] min-h-[520px] max-w-[1840px] overflow-hidden rounded-b-[2.5rem] bg-[#0b0a09] sm:h-[62svh] lg:h-[56svh]">
        {/* image, or the fallback scene */}
        {imageOk ? (
          <img
            src={HERO_IMAGE}
            alt=""
            onError={() => setImageOk(false)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 70% at 78% 8%, rgba(255,196,140,0.55), transparent 60%)," +
                "radial-gradient(45% 55% at 92% 60%, rgba(255,214,180,0.35), transparent 65%)," +
                "radial-gradient(70% 60% at 20% 90%, rgba(40,70,25,0.65), transparent 70%)," +
                "linear-gradient(180deg, #3a2417 0%, #1c130d 55%, #070605 100%)",
            }}
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 grid items-end gap-8 px-6 pb-9 sm:px-10 lg:grid-cols-[1fr_auto] lg:gap-14 lg:px-[4.5rem] lg:pb-10">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease }}
              className="font-heading text-[clamp(2.9rem,8.4vw,9.5rem)] font-medium leading-[0.9] tracking-[-0.06em] text-cream"
            >
              Wanna go to my world?
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-3 text-sm italic text-white/40 sm:text-base"
            >
              (That glowing button down here? Yeah, that one.)
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease }}
            className="max-w-[26rem] lg:mb-1"
          >
            <p className="text-[1.05rem] leading-snug text-cream/85">
              Building responsive, production-ready web apps — React interfaces backed by
              Node.js APIs and MongoDB, where clean code meets thoughtful design.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-5">
              <a
                href="#projects"
                data-cursor
                className="group inline-flex items-center gap-4 rounded-full bg-cream py-1.5 pl-6 pr-1.5 text-[1.05rem] font-medium text-black transition-transform duration-300 hover:scale-[1.03]"
              >
                Wanna Play?
                <span className="grid h-11 w-11 place-items-center rounded-full bg-black text-cream transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowRight className="h-[18px] w-[18px]" />
                </span>
              </a>
              <button
                type="button"
                data-cursor
                onClick={() => downloadResume()}
                className="text-sm text-cream/60 underline decoration-white/20 underline-offset-4 transition-colors hover:text-cream"
              >
                Download resume
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
