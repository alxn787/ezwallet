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

     const solwallet = await db.solwallet.findFirst({
        where:{
            UserId:session.user.uid
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
                quoteResponse:data.quoteResponse,
                userPublicKey: solwallet.publicKey,
                wrapAndUnwrapSol: true,
            })
        })
    ).json();

    const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
    var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
    const privatekey = getPrivateKeyFromDb(solwallet.privateKey)
    transaction.sign([privatekey]);

    // get the latest block hash
    const latestBlockHash = await connection.getLatestBlockhash();

    // Execute the transaction
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
    console.log(`https://solscan.io/tx/${txid}`);

}



function getPrivateKeyFromDb(privateKey:string){
    const arr = privateKey.split(",").map(x=>Number(x))
    const privateKeyUint8Arr = Uint8Array.from(arr)
    const keyPair = Keypair.fromSecretKey(privateKeyUint8Arr)
    return keyPair;
}

