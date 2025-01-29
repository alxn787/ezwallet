"use client"
import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "./Button";

export default function Appbar(){
    const session = useSession();
    return (
        <div className=" top-0 z-50 p-2  flex justify-between text-white font-extrabold text-xl px-20 left-0 right-0 fixed backdrop-blur-sm bg-gradient-to-r from-[#080d18] via-[#0c111f] to-[#0d111f]">
            <div>
                EZWALLET
            </div>
            <div>
                {session.data?.user ? <Button insidevalue = "Sign Out" onClick={() => signOut()}/> : <Button insidevalue = "Sign In" onClick={() => signIn("google")}/>}
            </div>

        </div>
    )
}