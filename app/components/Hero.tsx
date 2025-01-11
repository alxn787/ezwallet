"use client"
import { signIn, useSession } from "next-auth/react"
import { Button } from "./Button"
import { useRouter } from "next/navigation";


export const Hero = ()=>{
    const session = useSession();
    const router = useRouter();
    return(
        <div className="flex flex-col items-center ">
            <div className="text-6xl font-semibold ">
                <span>The Indian Cryptocurrency </span>
                <span className="text-blue-400">Revolution</span>
            </div>
            <div className="text-slate-500 text-2xl mt-6 ">
            Create a frictionless wallet with just a Google Account
            </div>
            <div className="text-slate-500 text-2xl mt-6 ">
            Trade tokens with ease
            </div>
            {session.data?.user? <div className="mt-8">
                <Button  children = "Go to Dashboard" onClick={()=>router.push("http://localhost:3000/dashboard")}></Button>
            </div> : 
            <div className="mt-8">
                <Button  children = "Sign Up With Google" onClick={()=>signIn("google")}></Button>
            </div>}
            
        </div>

    )
}