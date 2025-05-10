"use client"
import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "./Button";
import { useEffect, useState } from "react";

export default function Appbar() {
    const session = useSession();
    const [scrolled, setScrolled] = useState(false);

    useEffect(()=>{
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };
        
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll)
    },[scrolled])
    return (
        <div className={`top-0 z-50 p-2 flex justify-between text-white font-extrabold text-xl px-20 left-0 right-0 fixed duration-300 ease-in-out bg-black/30 ${scrolled ? "backdrop-blur-sm" : " bg-transparent"}`}>
            <div>
                EZWALLET
            </div>
            <div>
                {session.data?.user ? 
                    <Button insidevalue="Sign Out" onClick={() => signOut()}/> : 
                    <Button insidevalue="Sign In" onClick={() => signIn("google")}/>
                }
            </div>
        </div>
    )
}