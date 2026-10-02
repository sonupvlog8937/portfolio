import type { ComponentType, CSSProperties } from "react";
import {
  Atom,
  Boxes,
  Braces,
  Bug,
  Cloud,
  Database,
  FileCode2,
  GitBranch,
  Github,
  Globe,
  Layers,
  MonitorSmartphone,
  Palette,
  Route,
  Server,
  ShieldCheck,
  Smartphone,
  Zap,
} from "lucide-react";

type IconType = ComponentType<{ className?: string; style?: CSSProperties }>;

export interface Skill {
  name: string;
  icon: IconType;
  color: string;
}

export interface SkillCategory {
  name: string;
  accent: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    name: "Frontend",
    accent: "#00F2FF",
    skills: [
      { name: "HTML5", icon: FileCode2, color: "#F97316" },
      { name: "CSS3", icon: Palette, color: "#3B82F6" },
      { name: "JavaScript (ES6+)", icon: Braces, color: "#FACC15" },
      { name: "React.js", icon: Atom, color: "#00F2FF" },
      { name: "Redux Toolkit", icon: Layers, color: "#8B5CF6" },
      { name: "React Router", icon: Route, color: "#EC4899" },
    ],
  },
  {
    name: "Backend",
    accent: "#3B82F6",
    skills: [
      { name: "Node.js", icon: Server, color: "#10B981" },
      { name: "Express.js", icon: Zap, color: "#94A3B8" },
      { name: "REST APIs", icon: Globe, color: "#00F2FF" },
      { name: "Auth & Authorization", icon: ShieldCheck, color: "#EC4899" },
    ],
  },
  {
    name: "Database",
    accent: "#10B981",
    skills: [
      { name: "MongoDB", icon: Database, color: "#10B981" },
      { name: "Mongoose", icon: Boxes, color: "#8B5CF6" },
    ],
  },
  {
    name: "Tools & Other",
    accent: "#EC4899",
    skills: [
      { name: "Git", icon: GitBranch, color: "#F97316" },
      { name: "GitHub", icon: Github, color: "#E2E8F0" },
      { name: "Cloudinary", icon: Cloud, color: "#3B82F6" },
      { name: "Android Development", icon: Smartphone, color: "#10B981" },
      { name: "Responsive UI", icon: MonitorSmartphone, color: "#00F2FF" },
      { name: "Debugging & Troubleshooting", icon: Bug, color: "#EC4899" },
    ],
  },
];