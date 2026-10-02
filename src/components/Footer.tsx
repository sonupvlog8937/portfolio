import { profile } from "@/data/resume";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-black py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 text-center">
        <a href="#home" className="font-heading text-lg font-extrabold tracking-widest bg-gradient-to-r from-white via-orange-200 to-yellow-200 bg-clip-text text-transparent">
          SONU <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">KUMAR</span>
        </a>
        <p className="text-sm text-white/50">
          {profile.title} · {profile.location}
        </p>
        <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-white/50 transition-colors hover:text-orange-300 hover:scale-105 transform inline-block"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} Sonu Kumar. All rights reserved.
        </p>
      </div>
    </footer>
  );
}