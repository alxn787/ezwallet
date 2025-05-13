import { NextRequest, NextResponse } from "next/server";
import { getAccount, getAssociatedTokenAddress, getOrCreateAssociatedTokenAccount} from "@solana/spl-token";
import { connection, getSupportedTokens } from "@/app/lib/constants";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export async function GET(req:NextRequest){
     const { searchParams } = new URL(req.url);
     const address = searchParams.get("address")as string;
     const supportedTokens = await getSupportedTokens();
     const balances = await Promise.all(supportedTokens.map(token=>getAccountBalance(token,address)))
     const tokens = supportedTokens.map((token,index)=>({
        ...token,
        balance: balances[index],
        usdBalance: balances[index] * Number(token.price)   
    }) )
     return NextResponse.json({
        tokens,
        TotalBalance:tokens.reduce((acc,val)=>acc + val.usdBalance,0 )
     })
}

async function getAccountBalance(token:{
    name:string;
    mint:string;
    native:boolean; 
    decimals:number;
} , address:string
){
    if(token.native){
        const balance = await connection.getBalance(new PublicKey(address))
        return balance / LAMPORTS_PER_SOL;
    }
    const ata = await getAssociatedTokenAddress(new PublicKey(token.mint),new PublicKey(address))
    console.log(ata)


    try{
        const account = await getAccount(connection,ata)
        console.log(account)
        return Number(account.amount)/ (10 ** token.decimals)
    }catch(e){
        console.error(`Failed to fetch account balance for token ${token.name}:`, e);
        return 0;
    }

}