"use client"
import { signIn, useSession } from "next-auth/react"
import { Button } from "./Button"
import { useRouter } from "next/navigation";


export const Hero = () => {
    const session = useSession();
    const router = useRouter();
    return (
        <div className="flex flex-col items-center bg-gradient-to-r from-[#090808] via-[#0c111f] to-[#0d111f] text-white min-h-screen py-12">
            <div className="py-10 text-center">
          <h1 className="text-6xl font-bold mb-6">
            Wallet as a Service,
            <span className="text-[rgb(74,118,230)]"> Simplified</span>
          </h1>
          <div className="text-xl text-gray-300 max-w-2xl mx-auto">
                Swap tokens and manage balances with ease.
          </div>
        </div>
            {session.data?.user ? (
                <div className=" text-white py-2 px-6 rounded shadow-lg">
                    <Button
                        insidevalue="Go to Dashboard"
                        onClick={() => router.push("/dashboard")}                    />
                </div>
            ) : (
                <div className="mt-8 text-white py-2 px-6 rounded shadow-lg">
                    <Button
                        insidevalue="Sign Up With Google"
                        onClick={() => signIn("google")}
                    />
                    <Button
                        insidevalue="View Demo"
                        onClick={() => signIn("google")}
                    />
                </div>
            )}
        </div>
    );
};
