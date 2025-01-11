import { getServerSession } from "next-auth";

import db from "@/app/db";
import { authConfig } from "../lib/auth";
import Asset from "../components/Asset";

async function getUserWallet() {
    const session = await getServerSession(authConfig);

    const userWallet = await db.solwallet.findFirst({
        where: {
            UserId: session?.user?.uid
        },
        select: {
            publicKey: true
        }
    })

    if (!userWallet) {
        return {
            error: "No solana wallet found associated to the user"
        }
    }
    
    return {error: null, userWallet};
}


export default async function Dashboard(){
    const userWallet = await getUserWallet();
    if(!userWallet){
        return(
            <div>
                No solana wallet found
            </div>
        )
    }
 return(
    <div>
        <Asset publicKey ={userWallet.userWallet?.publicKey?? ""}/>
    </div>
 )
}

