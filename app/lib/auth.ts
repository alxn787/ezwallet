/* eslint-disable */
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/app/db";
import { Keypair } from "@solana/web3.js";
import { Session } from "next-auth";

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
    // Credentials Provider
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Enter your username" },
        password: { label: "Password", type: "password", placeholder: "Enter your password" },
      },
      async authorize(credentials, req) {
        console.log("authorize called with credentials:", credentials);
        const user = await db.user.findFirst({
          where: {
            username: "alenalexm50@gmail.com",
          },
        });

        if (!user) {
          console.error("User not found");
          return null;
        }
        

        return user
      },
    }),

    // Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],

  callbacks: {
    async session({ session, token }:any) {
      if (session.user && token.uid) {
        session.user.uid = token.uid; 
      }
      return session;
    },

    async jwt({ token, account, user }:any) {
      if (account?.provider === "google") {

        const dbUser = await db.user.findFirst({
          where: {
            sub: account.providerAccountId,
          },
        });

        if (dbUser) {
          token.uid = dbUser.id;
        }
      }

      if (user) {
        token.uid = user.id; 
      }

      return token;
    },

    async signIn({ user, account, profile }:any) {
      console.log("SignIn callback:", { user, account, profile });

      if (account?.provider === "google") {
        const email = user.email;

        // Check if user exists in the database
        const dbUser = await db.user.findFirst({
          where: { username: email },
        });

        if (dbUser) {
          return true; 
        }

        // Create new user in the database
        const keypair = Keypair.generate();
        const publicKey = keypair.publicKey.toBase58();
        const privateKey = keypair.secretKey;

        await db.user.create({
          data: {
            username: email,
            name: profile?.name,
            profilePicture: profile?.picture,
            Provider: "Google",
            sub: account.providerAccountId,
            Solwallet: {
              create: {
                publicKey: publicKey,
                privateKey: privateKey.toString(),
              },
            },
            Usdwallet: {
              create: {
                balance: 0,
              },
            },
          },
        });

        return true;
      }

      return true; 
    },
  },
};
