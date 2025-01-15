import GoogleProvider from "next-auth/providers/google";
import db from "@/app/db";
import { Keypair } from "@solana/web3.js";
import { Session } from 'next-auth';

export interface session extends Session {
    user: {
      email: string;
      name: string;
      image: string
      uid: string;
    };
}

export const authConfig = {
    secret: process.env.NEXTAUTH_SECRET || 'secr3t',
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        })
    ],
    callbacks: {
        session: ({ session, token }: any): session => {
            const newSession: session = session as session;
            if (newSession.user && token.uid) {
              // @ts-ignore
              newSession.user.uid = token.uid ?? "";
            }
            return newSession!;
        },
        async jwt({ token, account}: any) {
            const user = await db.user.findFirst({
                where: {
                    sub: account?.providerAccountId ?? ""
                }
            })
            if (user) {
              token.uid = user.id
            }
            return token
        },
        async signIn({ user, account, profile}: any) {
            if (account?.provider === "google") {
                const email = user.email;
                if (!email) {
                    return false
                }

                const userDb = await db.user.findFirst({
                    where: {
                        username: email
                    }
                })

                if (userDb) {
                    return true;
                }

                const keypair = Keypair.generate();
                const publicKey = keypair.publicKey.toBase58();
                const privateKey = keypair.secretKey;

                await db.user.create({
                    data: {
                        username: email,
                        name: profile?.name,
                        //@ts-ignore
                        profilePicture: profile?.picture,
                        Provider: "Google",
                        sub: account.providerAccountId,
                        Solwallet: {
                            create: {
                                publicKey: publicKey,
                                privateKey: privateKey.toString()
                            }
                        },
                        Usdwallet: {
                            create: {
                                balance: 0
                            }
                        }
                    }
                })

                return true;

            }
            
            return false
        },
    }
}