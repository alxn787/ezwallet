"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Bell, Rocket } from "lucide-react";
// Assuming Swap2 still exists in this path. If not, you'll need to define it here or import it correctly.
import { Swap2 } from "../components/swap2";
import { TokenwithBalance, useTokens } from "../api/Hooks/useTokens";

//@ts-ignore
const cn = (...classes) => classes.filter(Boolean).join(" ");

//@ts-ignore
function NavBar({ items, onTabChange, activeTab }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    if (typeof window !== 'undefined') { // Guard for SSR
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 py-1 px-1 rounded-full shadow-lg "> {/* Adjusted gap for small screens */}
      {items.map((item: navItems) => {
        const Icon = item.icon;
        const isActive = activeTab === item.name;

        return (
          <Link
            key={item.name}
            href={item.url}
            onClick={() => onTabChange(item.name)}
            // Adjusted padding for smaller screens
            className={cn(
              "relative cursor-pointer text-sm md:text-base font-semibold px-3 md:px-6 py-2 md:py-3 rounded-full transition-colors flex items-center gap-1 sm:gap-2 group", // Adjusted text size, padding, gap, added group class
              "hover:text-blue-400 hover:bg-blue-400/10",
              isActive && "bg-blue-900/10"
            )}
          >
            {/* Icon size is fine, scales with container or defaults */}
            <Icon size={16} strokeWidth={2.5} className={cn(isActive ? "text-blue-400" : "text-white/80", "group-hover:text-blue-400")} />

            {/* Apply text color classes directly to the span */}
            <span
              className={cn(
                "hidden sm:inline", // Hide text on very small screens, show on sm and up
                isActive ? "text-blue-400" : "text-white/80", // Apply active/inactive text color
                "group-hover:text-blue-400" // Apply hover text color (optional, can also inherit from Link)
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

type instantTabProps = {
  tokenbalances: {
    TotalBalance: number;
    tokens: TokenwithBalance[];
  } | null;
};

const InstantTab = ({ tokenbalances }: instantTabProps) => (
  <div className="w-full h-full overflow-y-auto p-4">
    {/* This uses the Swap2 component */}
    <Swap2 tokenBalances={tokenbalances} />
  </div>
);

const AboutTab = ({ tokenbalances }: instantTabProps) => {
  // State and logic for the hardcoded input and expiry in AboutTab
  const [aboutTabSwapRate, setAboutTabSwapRate] = useState(() => {
    // Check for window existence for SSR compatibility
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('currentSwapRate') ?? "0";
    }
    return "0"; // Default value for server-side render
  });

  const [showAboutTabExpiryDropdown, setShowAboutTabExpiryDropdown] = useState(false);
  const [selectedAboutTabExpiry, setSelectedAboutTabExpiry] = useState('Never');
  const aboutTabDropdownRef = useRef<HTMLDivElement>(null); // Specify type for ref

  const expiryOptions = ['10 mins', '1 hr', '4 hr', '1 day', '3 day', '7 day', 'Never'];

  useEffect(() => {
    // Check for document existence for SSR compatibility
    if (typeof document !== 'undefined') {
      const handleClickOutside = (event: MouseEvent) => {
        if (aboutTabDropdownRef.current && !aboutTabDropdownRef.current.contains(event.target as Node)) {
          setShowAboutTabExpiryDropdown(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [aboutTabDropdownRef]);

  const handleAboutTabSwapRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAboutTabSwapRate(event.target.value);
    // Optional: Update localStorage immediately or on blur/save
    // if (typeof window !== 'undefined') {
    //   window.localStorage.setItem('currentSwapRate', event.target.value);
    // }
  };

  const handleAboutTabExpirySelect = (option: string) => {
    setSelectedAboutTabExpiry(option);
    setShowAboutTabExpiryDropdown(false);
  };


  return (
    <div className="w-full h-full overflow-y-auto px-4">
        {/* This uses the Swap2 component */}
        <Swap2 tokenBalances={tokenbalances} />

        {/* START: The hardcoded block from the user's code, now made editable with dropdown */}
        <div className="flex flex-col md:flex-row px-4 gap-2 md:gap-0 mt-4"> {/* Added mt-4 for spacing */}
            <div className="w-full md:w-3/4 mb-4 md:mb-0 md:mr-4 bg-[#212127] py-4 px-4 rounded-lg flex flex-col justify-between border border-[#8DFF7C]">
                <div className="flex justify-between items-start text-sm text-gray-400">
                    <span>Buy SOL at rate <span className="text-green-500">(-0.02%)</span></span>
                    <span className="text-green-500 cursor-pointer">Use Market</span>
                </div>
                <div className="flex justify-between items-end mt-2">
                    <input
                        type="text"
                        value={aboutTabSwapRate} // Use state variable
                        onChange={handleAboutTabSwapRateChange} // Add change handler
                        className="text-2xl font-bold text-white bg-transparent border-none focus:outline-none w-1/2"
                    />
                    <div className="text-right">
                        <div className="text-white font-bold">USDC</div>
                        <div className="text-gray-400 text-sm">≈ $173.97</div>
                    </div>
                </div>
            </div>

            {/* Expiry Dropdown Section for the hardcoded block */}
            <div className="w-full md:w-1/4 bg-[#212127] rounded-lg p-4 flex flex-col relative" ref={aboutTabDropdownRef}>
                <div className="text-sm text-gray-400">Expiry</div>
                <div
                    className="flex items-center justify-between mt-1 text-white cursor-pointer"
                    onClick={() => setShowAboutTabExpiryDropdown(!showAboutTabExpiryDropdown)} // Toggle dropdown visibility
                >
                    <span>{selectedAboutTabExpiry}</span> {/* Display selected option */}
                    <span>&#9662;</span> {/* Down arrow */}
                </div>

                {/* Dropdown Options for the hardcoded block */}
                {showAboutTabExpiryDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-full bg-[#212127] border border-[#8DFF7C] rounded-md shadow-lg z-10">
                        {expiryOptions.map((option) => (
                            <div
                                key={option}
                                className="px-4 py-2 text-white hover:bg-[#333] cursor-pointer text-sm"
                                onClick={() => handleAboutTabExpirySelect(option)} // Select option
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
        {/* END: The hardcoded block from the user's code, now made editable with dropdown */}
    </div>
  );
};

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

  // Render the appropriate component based on activeTab
  const renderContent = () => {
    switch (activeTab) {
      case "Instant":
        return <InstantTab tokenbalances={tokenBalances} />;
      case "Trigger":
        return <AboutTab tokenbalances={tokenBalances} />;
      default:
        return null;
    }
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
      <div className="z-10 border border-gray-700 h-[90vh] max-h-screen w-full max-w-xl md:w-3/5 md:h-[70vh] lg:w-3/4 lg:h-[80vh] xl:w-4/5 2xl:w-[85%] relative flex flex-col items-center rounded-lg overflow-hidden">
        <div className="absolute top-4 sm:top-8 md:top-10 lg:top-12 w-full flex justify-center px-2">
          <NavBar
            items={navItems}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>

        <div className="flex-1 flex items-start justify-center w-full mt-20 md:mt-24 lg:mt-28 overflow-hidden">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}


export default NewDashboardPage;
