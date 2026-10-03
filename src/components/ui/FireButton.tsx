import { motion } from "framer-motion";
import { type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

interface FireButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}

export default function FireButton({
  children,
  onClick,
  href,
  variant = "primary",
  className,
}: FireButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const baseClasses = "relative inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 overflow-hidden";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:shadow-[0_0_30px_rgba(249,115,22,0.6)]",
    secondary: "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]",
    ghost: "border-2 border-orange-400/50 text-orange-300 hover:border-orange-400 hover:shadow-[0_0_25px_rgba(249,115,22,0.4)]",
  };

  const Component = href ? motion.a : motion.button;
  const props = href ? { href } : { onClick, type: "button" as const };

  return (
    <Component
      {...props}
      className={cn(baseClasses, variantClasses[variant], className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      data-cursor
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-orange-600 via-yellow-500 to-orange-600"
        animate={{
          backgroundPosition: isHovered ? ["0% 50%", "100% 50%", "0% 50%"] : "0% 50%",
        }}
        transition={{
          duration: 2,
          repeat: isHovered ? Infinity : 0,
          ease: "linear",
        }}
        style={{
          backgroundSize: "200% 200%",
        }}
      />

      {/* Fire particles on hover */}
      {isHovered && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bottom-0 h-1 w-1 rounded-full bg-orange-400"
              style={{
                left: `${20 + i * 12}%`,
              }}
              initial={{ y: 0, opacity: 1, scale: 1 }}
              animate={{
                y: [-20, -40],
                opacity: [1, 0],
                scale: [1, 0.5],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeOut",
              }}
            />
          ))}
        </>
      )}

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: isHovered
            ? [
                "0 0 20px rgba(249, 115, 22, 0.4)",
                "0 0 40px rgba(251, 191, 36, 0.6)",
                "0 0 20px rgba(249, 115, 22, 0.4)",
              ]
            : "0 0 0px rgba(249, 115, 22, 0)",
        }}
        transition={{
          duration: 1.5,
          repeat: isHovered ? Infinity : 0,
          ease: "easeInOut",
        }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </Component>
  );
}
