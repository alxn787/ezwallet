// File: app/NewDashboardPage.tsx
/* eslint-disable */
"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Bell, Rocket } from "lucide-react";
import { Swap2 } from "../components/swap2";
import { TokenwithBalance, useTokens } from "../api/Hooks/useTokens";

//@ts-ignore
const cn = (...classes) => classes.filter(Boolean).join(" ");

//@ts-ignore
function NavBar({ items, onTabChange, activeTab }) {
  const [isMobile, setIsMobile] = useState(false);

  type navItems = {
  name: string;
  url: string;
  icon: any;
};

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    if (typeof window !== 'undefined') {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 py-1 px-1 rounded-full shadow-lg ">
      {items.map((item:navItems) => {
        const Icon = item.icon;
        const isActive = activeTab === item.name;

        return (
          <Link
            key={item.name}
            href={item.url}
            onClick={() => onTabChange(item.name)}
            className={cn(
              "relative cursor-pointer text-sm md:text-base font-semibold px-3 md:px-6 py-2 md:py-3 rounded-full transition-colors flex items-center gap-1 sm:gap-2 group",
              "hover:text-blue-400 hover:bg-blue-400/10",
              isActive && "bg-blue-900/10"
            )}
          >
            <Icon size={16} strokeWidth={2.5} className={cn(isActive ? "text-blue-400" : "text-white/80", "group-hover:text-blue-400")} />

            <span
              className={cn(
                "hidden sm:inline",
                isActive ? "text-blue-400" : "text-white/80",
                "group-hover:text-blue-400"
              )}
            >
              {item.name}
            </span>

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

type navItems = {
  name: string;
  url: string;
  icon: any;
};

function NewDashboardPage({ publicKey }: { publicKey: string }) {
  const navItems = [
    { name: "Instant", url: "#", icon: Rocket },
    { name: "Trigger", url: "#", icon: Bell },
  ];

  const [activeTab, setActiveTab] = useState(navItems[0].name);

  const { tokenBalances } = useTokens(publicKey);

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
  };

  const renderContent = () => {
    return <Swap2 tokenBalances={tokenBalances} type={activeTab as "Instant" | "Trigger"} />;
  };

  return (
    <div className="text-white w-screen h-screen relative flex flex-col items-center justify-center bg-black bg-gradient-to-br from-[#232a3f] via-black to-[#1c2237] p-4 sm:p-6">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.5)",
        }}
      />
      <div className="z-10 h-[90vh] max-h-[95vh] w-full max-w-xl md:w-3/5 md:h-[75vh] lg:w-3/4 lg:h-[85vh] xl:w-4/5 2xl:w-[85%] relative flex flex-col items-center rounded-lg overflow-hidden">
        <div className="absolute top-4 sm:top-8 md:top-10 lg:top-12 w-full flex justify-center px-2">
          <NavBar
            items={navItems}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>

        <div className="flex-1 flex items-start justify-center w-full mt-28 overflow-hidden">
          <div className="w-full h-full overflow-y-auto">
               {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewDashboardPage;