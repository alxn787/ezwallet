/* eslint-disable */
import { authConfig } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import db from "@/app/db"
import { Keypair, VersionedTransaction } from "@solana/web3.js";
import { connection } from "@/app/lib/constants";

export async function POST(req:NextRequest){
    const data : {
        quoteResponse:any;
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
        }, { status: 400 })
    }

    if (!data.quoteResponse) {
        return NextResponse.json({
            message: "quoteResponse is required"
        }, { status: 400 })
    }

    try {
        // Updated to use the new Jupiter API endpoint (old quote-api.jup.ag/v6/swap is deprecated)
        // The new endpoint requires the full quoteResponse from the new quote API
        const swapResponse = await fetch('https://lite-api.jup.ag/swap/v1/swap', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quoteResponse: data.quoteResponse,
                userPublicKey: solwallet.publicKey,
                wrapAndUnwrapSol: true,
            })
        });

        if (!swapResponse.ok) {
            const errorData = await swapResponse.json().catch(() => ({}));
            return NextResponse.json({
                message: "Failed to get swap transaction",
                error: errorData
            }, { status: swapResponse.status })
        }

        const { swapTransaction } = await swapResponse.json();

        if (!swapTransaction) {
            return NextResponse.json({
                message: "swapTransaction is undefined"
            }, { status: 500 })
        }


        const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
        var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
        const privateKey = getPrivateKeyFromDb(solwallet.privateKey)
        transaction.sign([privateKey]);
        const latestBlockHash = await connection.getLatestBlockhash();


        const rawTransaction = transaction.serialize()
        const txid = await connection.sendRawTransaction(rawTransaction, {
            skipPreflight: true,
            maxRetries: 2
        });
        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: txid
        });

        return NextResponse.json({
            txid
        })
    } catch (error: any) {
        console.error("Swap error:", error);
        return NextResponse.json({
            message: "Swap failed",
            error: error.message || "Unknown error"
        }, { status: 500 })
    }
}

function getPrivateKeyFromDb(privateKey: string) {
    const arr = privateKey.split(",").map(x => Number(x));
    const privateKeyUintArr = Uint8Array.from(arr);
    const keypair = Keypair.fromSecretKey(privateKeyUintArr);
    return keypair;
}
