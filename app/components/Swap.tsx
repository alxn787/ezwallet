"use client"
/* eslint-disable */
import { useEffect, useState } from "react"
import { SUPPORTED_TOKENS, TokenDetails } from "../lib/tokens"
import { TokenwithBalance } from "../api/Hooks/useTokens"
import { Button } from "./Button"
import axios from "axios"

export function Swap({ tokenBalances,setSelectedTabs}: {
    tokenBalances: {
        TotalBalance: number;
        tokens: TokenwithBalance[];
    } | null;
    setSelectedTabs:(x:string)=>void
}) {
    const [baseAsset, setBaseAsset] = useState(SUPPORTED_TOKENS[0])
    const [quoteAsset, setQuoteAsset] = useState(SUPPORTED_TOKENS[1])
    const [baseAmount, setBaseAmount] = useState<string>("")
    const [quoteAmount, setQuoteAmount] = useState<string>("")
    const [qouteLoading,setQuoteLoading] = useState<boolean>(false)
    const [quoteResponse,setquoteResponse] = useState(null)

    useEffect(()=>{
        if(!baseAmount){
            return;
        }
        setQuoteLoading(true)
        axios.get(`https://quote-api.jup.ag/v6/quote?inputMint=${baseAsset.mint}&outputMint=${quoteAsset.mint}&amount=${Number(baseAmount) * (10**baseAsset.decimals)}&slippageBps=50`)
            .then(res=>{setQuoteAmount((Number(res.data.outAmount) / Number(10 ** quoteAsset.decimals)).toString()),
                setQuoteLoading(false);
                setquoteResponse(res.data); 
            })

    },[baseAmount,baseAsset,quoteAsset])

    return (
        <div className="text-2xl text-white font-bold p-4">
            <div className="pl-2">
                Swap Tokens
            </div>

            <SwapInputRow 
                inputDisabled={false}
                amount={baseAmount}
                onAmountChange={(value: string) => setBaseAmount(value)}
                title="Send" 
                selectedToken={baseAsset} 
                onselect={(asset) => setBaseAsset(asset)} 
                subtitle={Number(tokenBalances?.tokens.find(x => x.name === baseAsset.name)?.balance).toFixed(3).toString()} 
            />
            <div className="relative flex items-center justify-center ">
                <div className="w-full  "></div>
                    <div className="absolute bg-black p-2 rounded-full w-[36px] h-[36px] shadow-md flex justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#212127" viewBox="0 0 24 24"  stroke="currentColor">
                    <path  d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                    </svg>
                </div>
            </div>

            <SwapInputRow 
                inputLoading={qouteLoading}
                inputDisabled={true}
                amount={quoteAmount} 
                onAmountChange={(value: string) => setQuoteAmount(value)}
                title="Recieve" 
                selectedToken={quoteAsset} 
                onselect={(asset) => setQuoteAsset(asset)} 
                subtitle={Number(tokenBalances?.tokens.find(x => x.name === quoteAsset.name)?.balance).toFixed(3)} 
            />
            
            <div className="flex justify-between mt-5">
                <Button insidevalue="Cancel" onClick={() => setSelectedTabs("Tokens")} />
                <Button 
                insidevalue="Confirm and Swap" 
                onClick={() => axios.post('/api/swap',{quoteResponse})} />
            </div>
        </div>
    )
}

function SwapInputRow({
    onselect,
    amount,
    onAmountChange,
    selectedToken,
    title,
    subtitle,
    inputDisabled,
    inputLoading
}: {
    selectedToken: TokenDetails;
    onselect: (asset: TokenDetails) => void;
    title: string;
    subtitle?: string;
    amount?: string;
    onAmountChange: (value: string) => void;
    inputDisabled: boolean;
    inputLoading?: boolean;
}) {
    return (
        <div className={`flex justify-between items-center bg-[#212127] text-sm rounded-lg m-1`}>
            
            <div className="p-5 font-light">
                <div className="m-1">
                    {title}
                </div>
                <input
                    disabled={inputDisabled}
                    onChange={(e) => onAmountChange(e.target.value)}
                    value={inputLoading ? "" : amount} 
                    placeholder={inputLoading ? "..." : "0"} 
                    type="text"
                    className="py-5 bg-[#212127] w-56 h-14  text-3xl focus:outline-none"
                />
                {inputLoading && (
                    <div className="absolute right-10 top-6 animate-spin">
                        <div className="border-4 border-t-transparent border-blue-500 w-6 h-6 rounded-full"></div>
                    </div>
                )}
            </div>
            <div className='text-sm p-6 '>
                <AssetSelector onselect={onselect} selectedToken={selectedToken} />
                <div className="text-sm m-1 font-light text-slate-500">
                    Current Balance: {subtitle} {selectedToken.name}
                </div>
            </div>
        </div>
    )
}


export function AssetSelector({ selectedToken, onselect }: { selectedToken: TokenDetails; onselect: (asset: TokenDetails) => void; }) {
    return (
        <div className=" flex justify-end">
            <select
                onChange={(e) => {
                    const selectedToken = SUPPORTED_TOKENS.find((x) => x.name === e.target.value)
                    if (selectedToken) {
                        onselect(selectedToken)
                    }
                }}
                id="countries"
                className="bg-black text-white text-sm rounded-lg w-20 p-3 "
            >
                <option value={selectedToken.name}>{selectedToken.name}</option>
                {SUPPORTED_TOKENS.filter(x => x.name !== selectedToken.name).map(token => <option key={token.name} value={token.name}>{token.name}</option>)}
            </select>
        </div>
    )
}

//https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=100000000&slippageBps=50

//
