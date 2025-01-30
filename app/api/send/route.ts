import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey,sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import db from "@/app/db"
import { authConfig } from "@/app/lib/auth";

export async function POST(req:NextRequest){

    const data : {
        recieverAddress:string;
        address:string;
    } = await req.json()

    const session = await getServerSession(authConfig);
     if(!session?.user){
        return NextResponse.json({
            message:"user not logged in"
        })
     }

    const user = await db.user.findFirst({
        where:{
            username: session.user.email
        },
        select:{
            id:true
        }
    })

    const solwallet = await db.solwallet.findFirst({
        where:{
            UserId:user?.id
        }
    })

    if(!solwallet){
        return NextResponse.json({
            message:"no wallet found"
        })
    }


    console.log(data)
    const keypair = getPrivateKeyFromDb(solwallet.privateKey)
    const connection = new Connection("https://api.devnet.solana.com")
    const transacton = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey:new PublicKey(data.address),
            toPubkey: new PublicKey(data.recieverAddress),
            lamports: 0.1 * LAMPORTS_PER_SOL   
        })
    )
    const signature = await sendAndConfirmTransaction(connection,transacton,[keypair])

    return NextResponse.json({
        signature
    })

    function getPrivateKeyFromDb(privateKey: string) {
        const arr = privateKey.split(",").map(x => Number(x));
        const privateKeyUintArr = Uint8Array.from(arr);
        const keypair = Keypair.fromSecretKey(privateKeyUintArr);
        return keypair;
    }

}