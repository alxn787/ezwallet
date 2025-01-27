"use client"
import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "./Button";

export default function Appbar(){
    const session = useSession();
    return (
        <div className=" top-0 z-40 p-2  flex justify-between text-white bg-gradient-to-r from-[#090808] via-[#0c111f] to-[#0d111f] font-extrabold text-xl">
            <div>
                EZWALLET
            </div>
            <div>
                {session.data?.user ? <Button insidevalue = "Sign Out" onClick={() => signOut()}/> : <Button insidevalue = "Sign In" onClick={() => signIn("google")}/>}
            </div>

        </div>
    )
}