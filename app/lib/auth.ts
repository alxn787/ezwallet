import GoogleProvider from "next-auth/providers/google";
import db from "@/app/db";
import { Keypair } from "@solana/web3.js";
import { Session, Account, Profile } from 'next-auth';

export interface SessionWithUser extends Session {
    user: {
        email: string;
        name: string;
        image: string;
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
        session: ({ session, token }: { session: Session; token: any }): SessionWithUser => {
            if (session.user && token.uid) {
                //@ts-ignore
                session.user.uid = token.uid ?? "";
            }
            return session as SessionWithUser; 
        },
        
        // Callback for JWT token creation
        async jwt({ token, account, profile }: { token: any; account: Account | null; profile: Profile | null }) {
            const user = await db.user.findFirst({
                where: {
                    sub: account?.providerAccountId ?? ""
                }
            });
            
            if (user) {
                token.uid = user.id;
            }
            return token;
        },

        async signIn({ user, account, profile, email, credentials }: { user: any; account: any; profile: any; email: string | null; credentials: any }) {
            if (account?.provider === "google") {
                const userEmail = user.email;
                if (!userEmail) {
                    return false;
                }

                const userDb = await db.user.findFirst({
                    where: {
                        username: userEmail
                    }
                });

                if (userDb) {
                    return true;
                }

                const keypair = Keypair.generate();
                const publicKey = keypair.publicKey.toBase58();
                const privateKey = keypair.secretKey.toString(); 

                await db.user.create({
                    data: {
                        username: userEmail,
                        name: profile?.name ?? "Unknown", 
                        profilePicture: profile?.picture ?? "",
                        Provider: "Google",
                        sub: account?.providerAccountId ?? "",
                        Solwallet: {
                            create: {
                                publicKey: publicKey,
                                privateKey: privateKey
                            }
                        },
                        Usdwallet: {
                            create: {
                                balance: 0
                            }
                        }
                    }
                });

                return true;
            }

            return false;
        }
    }
};
