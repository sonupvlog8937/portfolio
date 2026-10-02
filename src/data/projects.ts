import type { ComponentType, CSSProperties } from "react";
import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  Heart,
  LayoutDashboard,
  MessagesSquare,
  PackageCheck,
  School,
  ShieldCheck,
  ShoppingBag,
  ShoppingBasket,
  ShoppingCart,
  Truck,
  UtensilsCrossed,
} from "lucide-react";

type IconType = ComponentType<{ className?: string; style?: CSSProperties }>;

export interface ProjectHighlight {
  label: string;
  icon: IconType;
  color: string;
}

export interface FeatureGroup {
  title: string;
  items: string[];
}

export interface Project {
  name: string;
  type: string;
  tagline: string;
  description: string;
  liveUrl: string;
  image: string;
  accent: string;
  tech: string[];
  highlights: ProjectHighlight[];
  featureGroups: FeatureGroup[];
}

export const zeedaddy: Project = {
  name: "Zeedaddy",
  type: "Featured Project",
  tagline: "E-commerce & Quick Commerce Platform",
  description:
    "A modern shopping platform combining e-commerce and quick-commerce functionality — from product discovery to cart, checkout and a complete admin panel, built end-to-end on the MERN stack with a REST API backend and a fully responsive web interface.",
  liveUrl: "https://zeedaddy.in",
  image:
    "https://media.base44.com/images/public/6abf866b3423b9ea08ae1343/7ae24bf35_generated_f672a8b3.jpg",
  accent: "#00F2FF",
  tech: ["React.js", "Redux Toolkit", "Node.js", "Express.js", "MongoDB", "Mongoose", "Cloudinary"],
  highlights: [
    { label: "Online Shopping", icon: ShoppingBag, color: "#00F2FF" },
    { label: "Grocery Ordering", icon: ShoppingBasket, color: "#10B981" },
    { label: "Food Ordering", icon: UtensilsCrossed, color: "#F97316" },
    { label: "Shopping Cart", icon: ShoppingCart, color: "#3B82F6" },
    { label: "Wishlist", icon: Heart, color: "#EC4899" },
    { label: "Authentication", icon: ShieldCheck, color: "#8B5CF6" },
    { label: "Order Management", icon: PackageCheck, color: "#00F2FF" },
    { label: "Admin Panel", icon: LayoutDashboard, color: "#F97316" },
    { label: "Delivery Management", icon: Truck, color: "#10B981" },
  ],
  featureGroups: [
    {
      title: "Shopping & Discovery",
      items: ["Online product shopping", "Product categories", "Product search"],
    },
    {
      title: "Quick Commerce",
      items: ["Grocery ordering", "Food ordering"],
    },
    {
      title: "User Experience",
      items: ["Shopping cart", "Wishlist", "User authentication", "Address management"],
    },
    {
      title: "Orders & Admin",
      items: [
        "Complete order management",
        "Admin panel",
        "Product management",
        "Category management",
        "Delivery / order management",
      ],
    },
    {
      title: "Engineering",
      items: ["REST API based backend", "Responsive web interface"],
    },
  ],
};

export const schoolErp: Project = {
  name: "School ERP",
  type: "Project",
  tagline: "School Management System",
  description:
    "A school management platform designed to digitally manage school operations — student records, administration, exams, academic information and communication, built on the MERN stack.",
  liveUrl: "https://apspaibigha.com",
  image:
    "https://media.base44.com/images/public/6abf866b3423b9ea08ae1343/d11499908_generated_b6e84735.jpg",
  accent: "#8B5CF6",
  tech: ["React.js", "Redux Toolkit", "Node.js", "Express.js", "MongoDB"],
  highlights: [
    { label: "Student Management", icon: GraduationCap, color: "#00F2FF" },
    { label: "Administration", icon: School, color: "#3B82F6" },
    { label: "Exam Management", icon: ClipboardList, color: "#EC4899" },
    { label: "Academic Information", icon: BookOpen, color: "#10B981" },
    { label: "Communication Modules", icon: MessagesSquare, color: "#F97316" },
  ],
  featureGroups: [
    { title: "Student Management", items: ["Student management", "Student-related records"] },
    { title: "Administration", items: ["School administration", "Admin-based management system"] },
    { title: "Exams & Academics", items: ["Exam management", "Academic information management"] },
    { title: "Communication", items: ["Communication / management modules"] },
  ],
};