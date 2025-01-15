"use client"
import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "./Button";

export default function Appbar(){
    const session = useSession();
    return (
        <div className="p-2 flex justify-between font-extrabold text-xl">
            <div>
                EZWALLET
            </div>
            <div>
                {session.data?.user ? <Button insidevalue = "Sign Out" onClick={() => signOut()}/> : <Button insidevalue = "Sign In" onClick={() => signIn("google")}/>}
            </div>

        </div>
    )
}