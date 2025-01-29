"use client"; /* eslint-disable */
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { NextButton, SecondaryButton } from "./Button";
import { useEffect, useState } from "react";
import { useTokens } from "../api/Hooks/useTokens";
import { TokenList } from "./TokenList";
import { Swap } from "./Swap";
import Recieve from "./Recieve";




export default function Asset({ publicKey }: { publicKey: string }) {
  const session = useSession();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const { tokenBalances } = useTokens(publicKey);
  const [selectedTabs, setSelectedTabs] = useState("Tokens");
 

  type Tab = "Tokens" | "Recieve" | "Send" | "Swap";

  const Tabs: { id: Tab; name: string }[] = [
    { id: "Tokens", name: "Tokens" },
    { id: "Recieve", name: "Recieve" },
    { id: "Send", name: "Send" },
    { id: "Swap", name: "Swap" },
  ];

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 3000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [copied]);

  if (session.status === "loading") {
    return (
      <div className="flex flex-col justify-center items-center">
        Loading...
      </div>
    );
  }

  if (!session.data?.user) {
    router.push("/");
  }


  return (
    <div className="flex flex-col items-center pt-20">
        <div className="w-[95%] max-w-[650px] rounded-lg bg-white shadow-lg p-8">
            <div className="flex flex-col sm:flex-row items-center">
                <div>
                    <img
                    className="rounded-full mb-4 sm:mb-0 sm:me-4 h-[68px] w-[68px]"
                    src={session.data?.user?.image || undefined}
                    alt="Profile"
                    />
                </div>
                <div className="text-3xl font-semibold text-blue-950 text-center sm:text-left">
                     Welcome Back, {session.data?.user?.name}
                </div>
            </div>
            <div className="text-slate-500 mt-4 font-semibold text-center sm:text-left">
                Account Assets
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center mt-3">
                    <div className="flex justify-center items-end font-bold">
                        <div className="text-4xl sm:text-6xl me-2">
                            ${tokenBalances?.TotalBalance.toFixed(2)}
                        </div>
                        <div className="text-2xl sm:text-4xl text-slate-500">USD</div>
                    </div>
            </div>
            <div className="mt-4 flex justify-center sm:justify-center">
            {Tabs.map((tab) => (
                <NextButton
                key={tab.id}
                active={tab.id === selectedTabs}
                insidevalue={tab.name}
                onClick={() => setSelectedTabs(tab.id)}
                />
            ))}
            </div>
        </div>
        <div className="bg-slate-100 w-[95%] max-w-[650px] rounded-lg shadow-lg p-8 mt-4">
            {selectedTabs === "Tokens" ? (
            <div className="p-4">
                <TokenList tokens={tokenBalances?.tokens || []} />
            </div>
            ) : null}
            {selectedTabs === "Swap" ? (
            <div className="my-3">
                <Swap
                tokenBalances={tokenBalances}
                setSelectedTabs={setSelectedTabs}
                />
            </div>
            ) : null}
        </div>
        {selectedTabs === "Recieve"? <Recieve setSelectedTabs = {setSelectedTabs} address = {publicKey}/> : null}
    </div>
  );
}
