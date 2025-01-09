"use client"
import { signIn } from "next-auth/react"
import { Button } from "./Button"

export const Hero = ()=>{
    return(
        <div className="flex flex-col items-center ">
            <div className="text-6xl font-semibold ">
                <span>The Indian Cryptocurrency </span>
                <span className="text-blue-400">Revolution</span>
            </div>
            <div className="text-slate-500 text-2xl mt-6 ">
            Create a frictionless wallet with just a Google Account
            </div>
            <div className="mt-8">
                <Button children = "Sign Up With Google" onClick={()=>signIn("google")}></Button>
            </div>
        </div>

    )
}