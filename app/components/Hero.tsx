/* eslint-disable */
"use client"
import { signIn, useSession } from "next-auth/react"
import { Button } from "./Button"
import { useRouter } from "next/navigation"
import Pricing from "./Pricing";
import BetaAccess from "./Beta";
import { AutoPlayVideo } from "./Autoplay";
import Footer from "./Footer";


export const Hero = () => {
    const session = useSession();
    const router = useRouter();
    return (
        <div>
            <div className="flex flex-col items-center bg-gradient-to-r from-[#090808] via-[#0c111f] to-[#0d111f] text-white min-h-screen py-12 ">
                <div className="py-10 text-center mt-20">
                    <h1 className="text-6xl font-bold mb-6">
                        Wallet as a Service,
                        <span className="text-[rgb(74,118,230)]"> Simplified</span>
                    </h1>
                    <div className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Swap, Send and Manage Tokens with ease.
                    </div>
                </div>
                {session.data?.user ? (
                    <div className=" text-white py-2 px-6 rounded shadow-lg">
                        <Button
                            insidevalue="Go to Dashboard"
                            onClick={() => router.push("/Spot")}                    />
                    </div>
                ) : (
                    <div className="mt-8 text-white py-2 px-6 rounded shadow-lg">
                        <Button
                            insidevalue="Sign Up With Google"
                            onClick={() => signIn("google")}
                        />
                        <Button
                            insidevalue="View Demo"
                            onClick={() => signIn('credentials',{
                                email:"demouser",
                                password:"demo123"
                            })}
                        />
                    </div>
                )}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 py-20 max-w-screen-xl">
                    <div className="bg-gray-800/50 p-8 rounded-xl backdrop-blur-sm">
                        <h3 className="text-xl font-semibold mb-3">Token Swapping</h3>
                        <p className="text-gray-300">Seamlessly swap between different tokens with competitive rates and minimal slippage.</p>
                    </div>
                    <div className="bg-gray-800/50 p-8 rounded-xl backdrop-blur-sm">
                        <h3 className="text-xl font-semibold mb-3">Balance Tracking</h3>
                        <p className="text-gray-300">Real-time balance monitoring across multiple chains and tokens in one place.</p>
                    </div>
                    <div className="bg-gray-800/50 p-8 rounded-xl backdrop-blur-sm">
                        <h3 className="text-xl font-semibold mb-3">Enterprise Security</h3>
                        <p className="text-gray-300">Bank-grade security with multi-signature support and advanced encryption.</p>
                    </div>
                </div>

                <div className="my-7 border border-slate-700 rounded-md p-2 bg-slate-900">
                    <AutoPlayVideo/>
                </div>
            </div>
            <div className="bg-black border border-x-black border-b-black border-t-blue-950 pb-14">
                <BetaAccess/>
                <Pricing/>
            </div>
            <Footer/>
        </div>    
    );
};
