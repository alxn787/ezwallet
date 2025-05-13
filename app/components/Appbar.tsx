"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./Button";
import { useEffect, useState } from "react";
import Navbarbutton from "./Navbarbutton";

export default function Appbar() {
  const session = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <div
      className={`top-0 z-50 p-2 flex justify-between items-center text-white
      px-4 md:px-10 lg:px-20
      left-0 right-0 fixed duration-300 ease-in-out
      ${scrolled ? "bg-black/70 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="flex items-center">
        <div className="font-extrabold text-lg sm:text-xl">
          EZWALLET
        </div>
        <div className="font-semibold text-[16px] flex gap-2 sm:gap-3 md:gap-5 ml-3 sm:ml-4 md:ml-5">
          <Navbarbutton name="Spot" />
          <Navbarbutton name="Pro" />
          <Navbarbutton name="Perp" />
        </div>
      </div>

      <div>
        {session.data?.user ? (
          <Button insidevalue="Sign Out" onClick={() => signOut()} />
        ) : (
          <Button insidevalue="Sign In" onClick={() => signIn("google")} />
        )}
      </div>
    </div>
  );
}