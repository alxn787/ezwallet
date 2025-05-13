"use client"
import { useEffect, useState, useId } from "react"
import { SUPPORTED_TOKENS, TokenDetails } from "../lib/tokens"
import { TokenwithBalance } from "../api/Hooks/useTokens"
import axios from "axios"
import { LuArrowUpDown } from "react-icons/lu"
import { motion } from "framer-motion"
import { useForm, UseFormRegister } from 'react-hook-form';
import { RotateCWIcon } from "./rotateloader"
import { useRouter } from "next/navigation"

type SwapFormValues = {
    baseAmount: string;
};


export function Swap2({ tokenBalances }: {
    tokenBalances: {
        TotalBalance: number;
        tokens: TokenwithBalance[];
    } | null;
}) {
    const [baseAsset, setBaseAsset] = useState(SUPPORTED_TOKENS[0])
    const [quoteAsset, setQuoteAsset] = useState(SUPPORTED_TOKENS[1])
    const [quoteAmount, setQuoteAmount] = useState<string>("")
    const [qouteLoading, setQuoteLoading] = useState<boolean>(false)
    const [quoteResponse, setquoteResponse] = useState(null)
    const [rotation, setRotation] = useState(0);
    const [refetchTrigger, setRefetchTrigger] = useState(0);
    const router = useRouter();

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<SwapFormValues>({
        defaultValues: {
            baseAmount: "",
        }
    });

    const watchedBaseAmount = watch('baseAmount');

    useEffect(() => {
        if (!watchedBaseAmount || Number(watchedBaseAmount) <= 0) {
            setQuoteAmount("");
            setquoteResponse(null);
            setQuoteLoading(false);
            window.localStorage.removeItem('currentSwapRate');
            return;
        }

        const amountInSmallestUnits = BigInt(Math.floor(Number(watchedBaseAmount) * (10 ** baseAsset.decimals)));

        setQuoteLoading(true);
        const controller = new AbortController();
        const signal = controller.signal;

        axios.get(`https://quote-api.jup.ag/v6/quote?inputMint=${baseAsset.mint}&outputMint=${quoteAsset.mint}&amount=${amountInSmallestUnits.toString()}&slippageBps=50`, { signal })
            .then(res => {
                const newQuoteAmountString = (Number(res.data.outAmount) / (10 ** quoteAsset.decimals)).toString();

                setQuoteAmount(newQuoteAmountString);
                setquoteResponse(res.data);
                const newqamtperqt = Number(newQuoteAmountString)/Number(watchedBaseAmount) 

                if(newQuoteAmountString !== "" && newQuoteAmountString !== "Error")
                {
                    window.localStorage.setItem('currentSwapRate', newqamtperqt.toString());
                } else {
                     window.localStorage.removeItem('currentSwapRate');
                }

            })
            .catch(err => {
                 if (axios.isCancel(err)) {
                     console.log('Request cancelled', err.message);
                 } else {
                    console.error("Error fetching quote:", err);
                    setQuoteAmount("Error");
                    setquoteResponse(null);
                    window.localStorage.removeItem('currentSwapRate');
                 }
             })
            .finally(() => {
                setQuoteLoading(false);
            });

        return () => {
            controller.abort();
        };

    }, [watchedBaseAmount, baseAsset, quoteAsset, baseAsset.decimals, quoteAsset.decimals, refetchTrigger])

    const handleSwapAssets = () => {
        setRotation(rotation + 180);

        const currentBase = baseAsset;
        const currentQuote = quoteAsset;

        const amountToSetAsNewBase = quoteAmount;

        setBaseAsset(currentQuote);
        setQuoteAsset(currentBase);

        setValue('baseAmount', amountToSetAsNewBase);

         setQuoteAmount('');
         setquoteResponse(null);
         window.localStorage.removeItem('currentSwapRate');
    };

    const handleRefetchQuote = () => {
        setRefetchTrigger(prev => prev + 1);
    };

    const onSubmitSwap = (data: SwapFormValues) => {
        console.log("Submitting swap with amount:", data.baseAmount);

        if (quoteResponse) {
             axios.post('/api/swap', { quoteResponse })
                 .then(response => {
                     console.log('Swap successful', response.data);
                 })
                 .catch(error => {
                     console.error('Swap failed', error);
                 });
        } else {
             console.warn('Swap attempted with no valid quote');
        }
    };


    return (
        <div className="text-2xl text-white font-bold p-4">
            <div className="flex justify-end pr-2 ">
                <RotateCWIcon
                   className={`border border-neutral-800 rounded-full p-1 hover:bg-white/20 hover:text-white text-neutral-300 cursor-pointer ${qouteLoading ? 'animate-spin' : ''}`}
                   onClick={handleRefetchQuote}
                />
            </div>

            <SwapInputRow
                inputRegisterProps={register('baseAmount', {})}
                inputDisabled={false}
                amountValue={watchedBaseAmount}
                title="Send"
                selectedToken={baseAsset}
                onselect={(asset) => setBaseAsset(asset)}
                subtitle={Number(tokenBalances?.tokens.find(x => x.name === baseAsset.name)?.balance || 0).toFixed(3).toString()}
            />


           <motion.div
                className="flex items-center justify-center z-100 my-[-18px]"
            >
                <motion.div
                    className="bg-black p-2 border-2 border-black rounded-full w-[36px] h-[36px] shadow-md flex justify-center items-center cursor-pointer hover:border-blue-500 text-blue-500 transition-colors duration-200 ease-in-out"
                    onClick={handleSwapAssets}
                    animate={{ rotate: rotation }}
                    transition={{ duration: 0.3 }}
                >
                    <LuArrowUpDown className="text-white/70 hover:text-blue-500" />
                </motion.div>
            </motion.div>

            <SwapInputRow
                inputDisabled={true}
                inputLoading={qouteLoading}
                amountValue={quoteAmount}
                onAmountValueChange={setQuoteAmount}
                title="Receive"
                selectedToken={quoteAsset}
                 onselect={(asset) => setQuoteAsset(asset)}
                subtitle={Number(tokenBalances?.tokens.find(x => x.name === quoteAsset.name)?.balance || 0).toFixed(3)}
            />


            <div className="flex justify-center mt-5">
                <form onSubmit={handleSubmit(onSubmitSwap)} className="w-full flex justify-center">
                    {
                        watchedBaseAmount && Number(watchedBaseAmount) > 0 ? (
                            Number(tokenBalances?.tokens.find(x => x.name === baseAsset.name)?.balance || 0) >= Number(watchedBaseAmount) ? (
                                <button
                                    type="submit"
                                    className="text-neutral-700 py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-500/80 transition-colors w-[98%] text-[20px]"
                                >
                                     Swap
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="text-neutral-700 py-2 px-4 rounded-lg bg-blue-400 opacity-50 cursor-not-allowed w-[98%] text-[20px]"
                                    disabled={true}
                                >
                                    Insufficient Balance
                                </button>
                            )
                        ) : (
                            <button
                                type="button"
                                className="text-neutral-700 py-2 px-4 rounded-lg bg-blue-400 opacity-50 cursor-not-allowed w-[98%] text-[20px]"
                                disabled={true}
                            >
                                Enter an amount
                            </button>
                        )
                    }
                </form>
            </div>

        </div>
    )
}

interface SwapInputRowProps {
    selectedToken: TokenDetails;
    onselect: (asset: TokenDetails) => void;
    title: string;
    subtitle?: string;
    amountValue: string;
    onAmountValueChange?: (value: string) => void;
    inputDisabled: boolean;
    inputLoading?: boolean;
    inputRegisterProps?: ReturnType<UseFormRegister<any>>;
    className?: string;
}

function SwapInputRow({
    onselect,
    amountValue,
    onAmountValueChange,
    inputRegisterProps,
    selectedToken,
    title,
    subtitle,
    inputDisabled,
    inputLoading,
    className
}: SwapInputRowProps) {
     const inputId = useId();

     const finalInputProps = inputRegisterProps ? {
         ...inputRegisterProps,
     } : {
         value: amountValue,
         onChange: (e: React.ChangeEvent<HTMLInputElement>) => onAmountValueChange?.(e.target.value),
     };

     const displayValue = inputLoading ? "" : amountValue;

     const placeholderText = inputLoading ? "" : "0";


    return (
        <div className={`flex justify-between items-center bg-[#212127] text-sm rounded-lg m-1 ${className || ''}`}>
            <div className="p-5 font-light relative flex-grow">
                <div className="m-1">
                    {title}
                </div>
                <div className="relative w-full">
                    <input
                        id={inputId}
                        disabled={inputDisabled || inputLoading}
                        placeholder={placeholderText}
                        type="text"
                        className="bg-[#212127] w-full h-14 text-3xl focus:outline-none text-white"
                        {...finalInputProps}
                        value={displayValue}
                    />
                     {inputLoading && (
                         <div className="absolute inset-0 bg-neutral-700/30 rounded-xl animate-pulse flex items-center justify-center w-48">
                         </div>
                    )}
                </div>
            </div>
            <div className='text-sm p-6 flex flex-col items-end flex-shrink-0'>
                <AssetSelector
                    selectedToken={selectedToken}
                    onselect={onselect}
                />
                <div className="text-sm m-1 font-light text-slate-500">
                     Balance: {subtitle} {selectedToken.name}
                </div>
            </div>
        </div>
    )
}

export function AssetSelector({ selectedToken, onselect }: { selectedToken: TokenDetails; onselect: (asset: TokenDetails) => void; }) {
    return (
        <div className="relative flex items-center border border-transparent hover:border-blue-400 rounded-xl transition-colors bg-black text-white text-sm cursor-pointer w-40 hover:bg-blue-900/10">
            <div className="flex items-center flex-grow min-w-0 p-3">
                {selectedToken.image ? (
                    <img src={selectedToken.image} alt={selectedToken.name} className="w-5 h-5 mr-2 rounded-full flex-shrink-0" />
                ) : (
                    <div className="w-5 h-5 mr-2 bg-neutral-600 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0">
                        {selectedToken.name ? selectedToken.name[0] : '?'}
                    </div>
                )}
                <span className="font-medium overflow-hidden text-ellipsis whitespace-nowrap flex-grow">
                    { selectedToken.name}
                </span>
            </div>

            <select
                onChange={(e) => {
                    const tokenName = e.target.value;
                    const selectedToken = SUPPORTED_TOKENS.find((x) => x.name === tokenName);
                    if (selectedToken) {
                        onselect(selectedToken);
                    }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                value={selectedToken.name}
            >
                 {SUPPORTED_TOKENS.map(token => (
                    <option key={token.name} value={token.name}>
                        {token.name}
                    </option>
                ))}
            </select>

             <div className="flex-shrink-0 pr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
             </div>
        </div>
    )
}