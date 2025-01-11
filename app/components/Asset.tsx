"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SecondaryButton } from "./Button";
import { useEffect, useState } from "react";

export default function Asset({publicKey}:{
    publicKey : string
}){
    const session = useSession();
    const router = useRouter();
    const [copied,setCopied] = useState(false);

    useEffect(()=>{
        if(copied){
            let timeout = setTimeout(()=>setCopied(false),3000)
        
        return ()=> {
            clearTimeout(timeout)
        }
        }
    },[copied])

    if(session.status === "loading"){
        return(
            <div className="flex flex-col justify-center items-center">
                Loading...
            </div>
        )
    }

    if(!session.data?.user){
        router.push("/")
    }
    
    return(
        <div className="flex justify-center">
            <div className="max-w-4xl rounded-lg bg-white shadow-lg p-5">
                <div className="flex justify-between items-center">
                    <div>
                        <img className="rounded-full me-4 h-[68px] w-[68px]" src = {session.data?.user?.image?? ""}></img>
                    </div>
                    <div className="text-3xl font-semibold text-blue-950">
                        Welcome Back, {session.data?.user?.name}
                    </div>
                    <div>
                        <SecondaryButton children = {copied?"Copied":"Your Wallet Address"} onClick={()=>{navigator.clipboard.writeText(publicKey); setCopied(true)}}/>
                    </div>
                </div>
            </div>
        </div>
    )
}