import { getServerSession } from "next-auth";

import db from "@/app/db";
import { authConfig } from "../lib/auth";
import Asset from "../components/Asset";

async function getUserWallet() {
    const session = await getServerSession(authConfig);
    const user = await db.user.findFirst({
        where:{ 
        username:session?.user?.email
    }
    })
    console.log(`uid is ${user?.username}`)

    const userWallet = await db.solwallet.findFirst({
        where: {
            UserId: user?.id
        },
        select: {
            publicKey: true
        }
    })
    console.log(userWallet?.publicKey)

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
            <div className="bg-blue-900">
                No solana wallet found
            </div>
        )
    }
 return(
    <div className="bg-gradient-to-r from-[#090808] via-[#0c111f] to-[#0d111f] w-full h-screen">
        <Asset publicKey ={userWallet.userWallet?.publicKey??""}/>
    </div>
 )
}

