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
        <div className="text-2xl font-bold p-4">
            <div>
                Swap Tokens
            </div>

            <SwapInputRow 
                inputDisabled={false}
                amount={baseAmount}
                onAmountChange={(value: string) => setBaseAmount(value)}
                title="You Pay" 
                selectedToken={baseAsset} 
                onselect={(asset) => setBaseAsset(asset)} 
                subtitle={Number(tokenBalances?.tokens.find(x => x.name === baseAsset.name)?.balance).toFixed(3).toString()} 
                topBorderEnabled={true}  
                bottomBorderEnabled={false} 
            />

            <SwapInputRow 
                inputLoading={qouteLoading}
                inputDisabled={true}
                amount={quoteAmount} 
                onAmountChange={(value: string) => setQuoteAmount(value)}
                title="You Receive" 
                selectedToken={quoteAsset} 
                onselect={(asset) => setQuoteAsset(asset)} 
                subtitle={Number(tokenBalances?.tokens.find(x => x.name === quoteAsset.name)?.balance).toFixed(3)} 
                topBorderEnabled={false} 
                bottomBorderEnabled={true} 
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
    topBorderEnabled,
    bottomBorderEnabled,
    inputDisabled,
    inputLoading
}: {
    selectedToken: TokenDetails;
    onselect: (asset: TokenDetails) => void;
    title: string;
    subtitle?: string;
    topBorderEnabled: boolean;
    bottomBorderEnabled: boolean;
    amount?: string;
    onAmountChange: (value: string) => void;
    inputDisabled: boolean;
    inputLoading?: boolean;
}) {
    return (
        <div className={`flex justify-between items-center border text-sm ${topBorderEnabled ? "rounded-t-xl" : ""} ${bottomBorderEnabled ? "rounded-b-xl" : ""}`}>
            <div className='text-sm p-6'>
                <div className="m-1">
                    {title}
                </div>
                <AssetSelector onselect={onselect} selectedToken={selectedToken} />
                <div className="text-sm m-1 font-light text-slate-500">
                    Current Balance: {subtitle} {selectedToken.name}
                </div>
            </div>
            <div className="p-5 font-light">
                <input
                    disabled={inputDisabled}
                    onChange={(e) => onAmountChange(e.target.value)}
                    value={inputLoading ? "" : amount} 
                    placeholder={inputLoading ? "..." : "0"} 
                    type="text"
                    className="py-5 bg-slate-100 w-56 h-24 text-end text-5xl focus:outline-none"
                />
                {inputLoading && (
                    <div className="absolute right-10 top-6 animate-spin">
                        <div className="border-4 border-t-transparent border-blue-500 w-6 h-6 rounded-full"></div>
                    </div>
                )}
            </div>
        </div>
    )
}


function AssetSelector({ selectedToken, onselect }: { selectedToken: TokenDetails; onselect: (asset: TokenDetails) => void; }) {
    return (
        <div className="">
            <select
                onChange={(e) => {
                    const selectedToken = SUPPORTED_TOKENS.find((x) => x.name === e.target.value)
                    if (selectedToken) {
                        onselect(selectedToken)
                    }
                }}
                id="countries"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-20 p-2.5"
            >
                <option value={selectedToken.name}>{selectedToken.name}</option>
                {SUPPORTED_TOKENS.filter(x => x.name !== selectedToken.name).map(token => <option key={token.name} value={token.name}>{token.name}</option>)}
            </select>
        </div>
    )
}

//https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=100000000&slippageBps=50

//
