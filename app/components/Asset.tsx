"use client"; /* eslint-disable */
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { NextButton, SecondaryButton } from "./Button";
import { useEffect, useState } from "react";
import { useTokens } from "../api/Hooks/useTokens";
import { TokenList } from "./TokenList";
import { Swap } from "./Swap";
import Recieve from "./Recieve";
import { SendToken } from "./Send";
import Insights from "./Insights";

export default function Asset({ publicKey }: { publicKey: string }) {
  const session = useSession();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const { tokenBalances } = useTokens(publicKey);
  const [selectedTabs, setSelectedTabs] = useState("Tokens");
  console.log(tokenBalances);

  type Tab = "Tokens" | "Recieve" | "Send" | "Swap" | "Insights";

  const Tabs: { id: Tab; name: string }[] = [
    { id: "Tokens", name: "Tokens" },
    { id: "Recieve", name: "Recieve" },
    { id: "Send", name: "Send" },
    { id: "Swap", name: "Swap" },
    { id: "Insights", name: "Insights"},
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
      <div className="flex flex-col justify-center items-center min-h-screen"> {/* Ensure loading state also takes full height */}
        Loading...
      </div>
    );
  }

  if (!session.data?.user) {
    router.push("/");
  }

  return (
    <div className="flex flex-col items-center max-h-screen h-[98%] pt-20">
      {/* Top section with user info and tabs */}
      <div className="w-[95%] max-w-[650px] rounded-t-lg bg-[#090808] text-white shadow-lg p-8 border-x border-t border-slate-800">
        <div className="flex flex-col sm:flex-row items-center">
          <div>
            <img
              className="rounded-full mb-4 sm:mb-0 sm:me-4 h-[68px] w-[68px]"
              src={session.data?.user?.image || undefined}
              alt="Profile"
            />
          </div>
          <div className="text-3xl font-semibold text-center sm:text-left">
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


      <div className="w-[95%] max-w-[650px] flex-grow overflow-y-auto rounded-b-lg shadow-lg px-4 pt-4 bg-[#090808] border-x border-b border-slate-800">
        {selectedTabs === "Tokens" ? (
          <div className="p-4 flex flex-col h-full"> 
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
        {selectedTabs === "Send" ? (
          <div className="my-3">
            <SendToken address={publicKey} />
          </div>
        ) : null}
        {selectedTabs === "Recieve" ? (
          <Recieve setSelectedTabs={setSelectedTabs} address={publicKey} />
        ) : null}
        {selectedTabs === "Insights" ? <Insights /> : null}
      </div>
    </div>
  );
}