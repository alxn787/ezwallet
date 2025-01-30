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
        })
    }

    // get serialized transactions for the swap
        const { swapTransaction } = await (
            await fetch('https://quote-api.jup.ag/v6/swap', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quoteResponse: data.quoteResponse,
                userPublicKey: solwallet.publicKey,
                wrapAndUnwrapSol: true,
            })
            })
        ).json();

        if (!swapTransaction) {
            throw new Error("swapTransaction is undefined");
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
}

function getPrivateKeyFromDb(privateKey: string) {
    const arr = privateKey.split(",").map(x => Number(x));
    const privateKeyUintArr = Uint8Array.from(arr);
    const keypair = Keypair.fromSecretKey(privateKeyUintArr);
    return keypair;
}
