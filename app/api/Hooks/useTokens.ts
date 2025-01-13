import { TokenDetails } from "@/app/lib/tokens";
import axios from "axios";
import { useEffect, useState } from "react";

export interface TokenwithBalance extends TokenDetails{
    balance: string;
    usdBalance: string; 
}

export function useTokens(address:string){
    const [tokenBalances, SetTokenBalance] = useState<{
        TotalBalance:Number
        tokens: TokenwithBalance[]
    } | null>(null);
    const [loading, SetLoading] = useState(true); 

    useEffect(()=>{
        axios.get(`/api/token?address=${address}`)
        .then(res => {
            SetTokenBalance(res.data)
            SetLoading(false)
        })
    },[])

    return{
        loading,tokenBalances
    }
}