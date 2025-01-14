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

interface Token {
    uid?: string;
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
        session: ({ session, token }: { session: SessionWithUser; token: Token }): SessionWithUser => {
            if (session.user && token.uid) {
                session.user.uid = token.uid ?? "";
            }
            return session;
        },

        async jwt({ token, account }: { token: Token; account: Account | null }): Promise<Token> {
            if (account) {
                const user = await db.user.findFirst({
                    where: {
                        sub: account.providerAccountId ?? ""
                    }
                });

                if (user) {
                    token.uid = user.id;
                }
            }
            return token;
        },

        async signIn({ user, account, profile }: { user: { email: string }; account: Account | null; profile: Profile | null }) {
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
                        profilePicture: profile?.image ?? "",
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
