import { Connection, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmRawTransaction, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";

export async function POST(){
    const connection = new Connection("https://api.mainnet-beta.solana.com")
    const transacton = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey:new PublicKey(""),
            toPubkey: new PublicKey(""),
            lamports: 0.1 * LAMPORTS_PER_SOL   
        })
    )
    const signature = sendAndConfirmTransaction(connection,transacton,)
}