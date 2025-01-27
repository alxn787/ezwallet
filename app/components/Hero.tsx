"use client"
import { signIn, useSession } from "next-auth/react"
import { Button } from "./Button"
import { useRouter } from "next/navigation";


export const Hero = () => {
    const session = useSession();
    const router = useRouter();
    return (
        <div className="flex flex-col items-center bg-gradient-to-r from-[#090808] via-[#0c111f] to-[#0d111f] text-white min-h-screen py-12">
            <div className="text-6xl font-semibold text-center">
                <span>The Indian Cryptocurrency </span>
                <span className="text-blue-400">Revolution</span>
            </div>
            <div className="text-gray-400 text-2xl mt-6 text-center">
                Create a frictionless wallet with just a Google Account
            </div>
            <div className="text-gray-400 text-2xl mt-6 text-center">
                Trade tokens with ease
            </div>
            {session.data?.user ? (
                <div className="mt-8 text-white py-2 px-6 rounded shadow-lg">
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
                </div>
            )}
        </div>
    );
};
