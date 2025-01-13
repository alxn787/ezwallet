"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { NextButton, SecondaryButton } from "./Button";
import { Children, useEffect, useState } from "react";
import axios from "axios";
import { useTokens } from "../api/Hooks/useTokens";
import { TokenList } from "./TokenList";

export default function Asset({publicKey}:{
    publicKey : string
}){
    const session = useSession();
    const router = useRouter();
    const [copied,setCopied] = useState(false);
    const { tokenBalances, loading} = useTokens(publicKey);
    const [selectedTabs, setSelectedTabs] = useState("Tokens");

    type Tab = "Tokens" | "Add funds" | "Send" | "Swap" | "Withdraw"

    const Tabs:Tab[]= ["Tokens" , "Add funds" , "Send" , "Swap" , "Withdraw"]

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
            <div className="w-[760px] rounded-lg bg-white shadow-lg p-8">
                <div className="flex  items-center">
                    <div>
                        <img className="rounded-full me-4 h-[68px] w-[68px]" src = {session.data?.user?.image?? ""}></img>
                    </div>
                    <div className="text-3xl font-semibold text-blue-950">
                        Welcome Back, {session.data?.user?.name}
                    </div>
                </div>
                <div className="text-slate-500 mt-4 font-semibold">
                    Account Assets
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex justify-center items-end font-bold mt-3 ">
                        <div className="text-6xl me-2">
                        ${tokenBalances?.TotalBalance.toFixed(2)}
                        </div>
                        <div className="text-4xl text-slate-500">
                            USD
                        </div>
                    </div>
                    <div>
                    <SecondaryButton children = {copied?"Copied":"Your Wallet Address"} onClick={()=>{navigator.clipboard.writeText(publicKey); setCopied(true)}}/>
                    </div>
                </div>
                <div>
                    {Tabs.map((tab) => <NextButton active = {tab === selectedTabs} children = {tab} onClick={()=>setSelectedTabs(tab)}/>)}
                </div>
                {selectedTabs === 'Tokens'? <div className="p-4">
                    <TokenList tokens = {tokenBalances?.tokens || []}/>
                </div> : null}

            </div>
        </div>
    )
}