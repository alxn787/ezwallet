"use client"
/* eslint-disable */
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { cn } from "../lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}
//@ts-ignore
function NavBar({ items, onTabChange, activeTab }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex items-center justify-center gap-2 py-1 px-1 rounded-full shadow-lg ">
      {items.map((item: NavItem) => {
        const Icon = item.icon;
        const isActive = activeTab === item.name;

        return (
          <Link
            key={item.name}
            href={item.url}
            onClick={() => onTabChange(item.name)}
            className={cn(
              "relative cursor-pointer text-sm font-semibold px-4 md:px-6 py-3 rounded-full transition-colors flex items-center gap-2", // Added flex and gap-2
              "text-white/80 hover:text-blue-400 hover:bg-blue-400/10",
              isActive && "bg-blue-900/10 text-blue-400"
            )}
          >
            <Icon size={18} strokeWidth={2.5} /> {/* Icon is now always visible */}
            <span className="hidden md:inline">{item.name}</span>
            {isActive && (
              <motion.div
                layoutId="lamp"
                className="absolute inset-0 w-full bg-blue-400/10 rounded-full -z-10"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              ></motion.div>
            )}
          </Link>
        );
      })}
    </div>
  );
}