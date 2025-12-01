/* eslint-disable */
"use client"

import { useEffect, useState, useId, useRef, memo } from "react"
import { SUPPORTED_TOKENS, TokenDetails } from "../lib/tokens"
import { TokenwithBalance } from "../api/Hooks/useTokens"
import axios from "axios"
import { LuArrowUpDown } from "react-icons/lu"
import { motion } from "framer-motion"
import { useForm, UseFormRegister } from 'react-hook-form';
import { RotateCWIcon } from "./rotateloader"
import React, { InputHTMLAttributes, DetailedHTMLProps } from 'react';


type SwapFormValues = {
    baseAmount: string;
};

interface TradingViewSymbolOverviewWidgetProps {
    symbol: string;
    className?: string;
}

function TradingViewSymbolOverviewWidget({ symbol, className }: TradingViewSymbolOverviewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(
    () => {
      if (!container.current || !symbol) return;

      container.current.innerHTML = '';

      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "symbols": [
            [
              "${symbol}"
            ]
          ],
          "chartOnly": false,
          "width": "100%",
          "height": "100%",
          "locale": "en",
          "colorTheme": "dark",
          "autosize": true,
          "showVolume": false,
          "showMA": false,
          "hideDateRanges": false,
          "hideMarketStatus": false,
          "hideSymbolLogo": false,
          "scalePosition": "right",
          "scaleMode": "Normal",
          "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
          "fontSize": "10",
          "noTimeScale": false,
          "valuesTracking": "1",
          "changeMode": "price-and-percent",
          "chartType": "area",
          "maLineColor": "#2962FF",
          "maLineWidth": 1,
          "maLength": 9,
          "headerFontSize": "medium",
          "lineWidth": 2,
          "lineType": 0,
          "dateRanges": [
            "1d|1",
            "1m|30",
            "3m|60",
            "12m|1D",
            "60m|1W",
            "all|1M"
          ]
        }`;
      container.current.appendChild(script);

    },
    [symbol]
  );

  return (
        <div className={`tradingview-widget-container `} ref={container}>
        </div>

  );
}

const MemoizedTradingViewSymbolOverviewWidget = memo(TradingViewSymbolOverviewWidget);


export function Swap2({ tokenBalances, type }: {
    tokenBalances: {
        TotalBalance: number;
        tokens: TokenwithBalance[];
    } | null;
    type: "Instant" | "Trigger";
}) {
    const [baseAsset, setBaseAsset] = useState(SUPPORTED_TOKENS[0]);
    const [quoteAsset, setQuoteAsset] = useState(SUPPORTED_TOKENS[1]);
    const [quoteAmount, setQuoteAmount] = useState<string>("");
    const [qouteLoading, setQuoteLoading] = useState<boolean>(false);
    const [quoteResponse, setquoteResponse] = useState(null);
    const [rotation, setRotation] = useState(0);
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    const [marketUnitPrice, setMarketUnitPrice] = useState<string>("0");
    const [triggerTabSwapRate, setTriggerTabSwapRate] = useState<string>("0");
    const [showTriggerTabExpiryDropdown, setShowTriggerTabExpiryDropdown] = useState(false);
    const [selectedTriggerTabExpiry, setSelectedTriggerTabExpiry] = useState('Never');
    const TriggerTabDropdownRef = useRef<HTMLDivElement>(null);
    const expiryOptions = ['10 mins', '1 hr', '4 hr', '1 day', '3 day', '7 day', 'Never'];

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
            if (type === 'Trigger') {
                 setTriggerTabSwapRate("0");
            }
            return;
        }

        // Don't fetch quote if same token is selected
        if (baseAsset.mint === quoteAsset.mint) {
            setQuoteAmount("");
            setquoteResponse(null);
            setQuoteLoading(false);
            if (type === 'Trigger') {
                 setTriggerTabSwapRate("0");
            }
            return;
        }

        const amountInSmallestUnits = BigInt(Math.floor(Number(watchedBaseAmount) * (10 ** baseAsset.decimals)));

        setQuoteLoading(true);
        const controller = new AbortController();
        const signal = controller.signal;

        const quoteUrl = `/api/quote?inputMint=${baseAsset.mint}&outputMint=${quoteAsset.mint}&amount=${amountInSmallestUnits.toString()}&slippageBps=50`;
        console.log("Fetching quote from:", quoteUrl);

        axios.get(quoteUrl, { 
            signal,
            timeout: 15000, // 15 second timeout
        })
            .then(res => {
                if (res.data && res.data.outAmount) {
                    const newQuoteAmountString = (Number(res.data.outAmount) / (10 ** quoteAsset.decimals)).toString();
                    setQuoteAmount(newQuoteAmountString);
                    setquoteResponse(res.data);
                } else {
                    console.error("Invalid quote response:", res.data);
                    setQuoteAmount("Error");
                    setquoteResponse(null);
                    if (type === 'Trigger') {
                        setTriggerTabSwapRate("Error");
                    }
                }
            })
            .catch(err => {
                 if (axios.isCancel(err)) {
                     console.log('Amount quote request cancelled', err.message);
                 } else {
                    console.error("Error fetching amount quote:", err);
                    if (err.response) {
                        console.error("Response error:", err.response.data);
                        console.error("Status:", err.response.status);
                    } else if (err.request) {
                        console.error("Request error:", err.request);
                    }
                    setQuoteAmount("Error");
                    setquoteResponse(null);
                    if (type === 'Trigger') {
                        setTriggerTabSwapRate("Error");
                    }
                 }
             })
            .finally(() => {
                setQuoteLoading(false);
            });

        return () => {
            controller.abort();
        };

    }, [watchedBaseAmount, baseAsset, quoteAsset, baseAsset.decimals, quoteAsset.decimals, refetchTrigger, type])


    useEffect(() => {
        const fetchUnitPrice = async () => {
            if (type === 'Instant' && (!watchedBaseAmount || Number(watchedBaseAmount) <= 0)) {
                 setMarketUnitPrice("0");
                 return;
            }
             if (type === 'Trigger' && (!baseAsset || !quoteAsset)) {
                 setMarketUnitPrice("0");
                 return;
             }

            const unitAmountInSmallestUnits = BigInt(1 * (10 ** baseAsset.decimals));
            const controller = new AbortController();
            const signal = controller.signal;

            // Don't fetch unit price if same token is selected
            if (baseAsset.mint === quoteAsset.mint) {
                setMarketUnitPrice("0");
                if(type === 'Trigger' && triggerTabSwapRate === "0") {
                    setTriggerTabSwapRate("0");
                }
                return;
            }

            try {
                const unitQuoteUrl = `/api/quote?inputMint=${baseAsset.mint}&outputMint=${quoteAsset.mint}&amount=${unitAmountInSmallestUnits.toString()}&slippageBps=50`;
                const res = await axios.get(unitQuoteUrl, { 
                    signal,
                    timeout: 15000,
                });
                
                if (res.data && res.data.outAmount) {
                    const unitQuoteAmount = Number(res.data.outAmount) / (10 ** quoteAsset.decimals);

                    if (unitQuoteAmount > 0) {
                         setMarketUnitPrice(unitQuoteAmount.toFixed(quoteAsset.decimals).toString());

                         if(type === 'Trigger' && triggerTabSwapRate === "0") {
                              setTriggerTabSwapRate(unitQuoteAmount.toFixed(quoteAsset.decimals).toString());
                         }

                    } else {
                         setMarketUnitPrice("0");
                         if(type === 'Trigger' && triggerTabSwapRate === "0") {
                             setTriggerTabSwapRate("0");
                         }
                    }
                } else {
                    console.error("Invalid unit price quote response:", res.data);
                    setMarketUnitPrice("0");
                    if(type === 'Trigger' && triggerTabSwapRate === "0") {
                        setTriggerTabSwapRate("0");
                    }
                }
            } catch (err) {
                if (axios.isCancel(err)) {
                    console.log('Unit price quote request cancelled', err.message);
                } else {
                   console.error("Error fetching unit price quote:", err);
                   if (err.response) {
                       console.error("Response error:", err.response.data);
                       console.error("Status:", err.response.status);
                   } else if (err.request) {
                       console.error("Request error:", err.request);
                   }
                   setMarketUnitPrice("0");
                    if(type === 'Trigger' && triggerTabSwapRate === "0") {
                        setTriggerTabSwapRate("0");
                    }
                }
            }
        };

        fetchUnitPrice();

    }, [baseAsset, quoteAsset, refetchTrigger, type, watchedBaseAmount, triggerTabSwapRate, quoteAsset.decimals, baseAsset.decimals]);


    useEffect(() => {
        if (typeof document !== 'undefined') {
            const handleClickOutside = (event: MouseEvent) => {
                if (TriggerTabDropdownRef.current && !TriggerTabDropdownRef.current.contains(event.target as Node)) {
                    setShowTriggerTabExpiryDropdown(false);
                }
            };

            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [TriggerTabDropdownRef]);

    const handleSwapAssets = () => {
        setRotation(rotation + 180);

        const currentBase = baseAsset;
        const currentQuote = quoteAsset;

        if (type === 'Trigger') {
             setTriggerTabSwapRate("0");
        }

        const amountToSetAsNewBase = quoteAmount;

        setBaseAsset(currentQuote);
        setQuoteAsset(currentBase);

        setValue('baseAmount', amountToSetAsNewBase);

         setQuoteAmount('');
         setquoteResponse(null);
    };

    const handleRefetchQuote = () => {
        setRefetchTrigger(prev => prev + 1);
    };

    const onSubmitSwap = (data: SwapFormValues) => {
        console.log(`Submitting ${type} swap with amount:`, data.baseAmount);

        if (type === 'Trigger') {
            console.log('Trigger swap logic - Rate:', triggerTabSwapRate, 'Expiry:', selectedTriggerTabExpiry);
            alert(`Trigger set: Buy ${quoteAsset.name} at ${triggerTabSwapRate} ${quoteAsset.name}/${baseAsset.name} expiring in ${selectedTriggerTabExpiry}`);
            return;
        }

        if (quoteResponse) {
             axios.post('/api/swap', { quoteResponse })
                 .then(response => {
                     console.log('Instant swap successful', response.data);
                 })
                 .catch(error => {
                     console.error('Instant swap failed', error);
                 });
        } else {
             console.warn('Instant swap attempted with no valid quote');
        }
    };

    const handleTriggerTabSwapRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTriggerTabSwapRate(event.target.value);
    };

    const handleTriggerTabExpirySelect = (option: string) => {
        setSelectedTriggerTabExpiry(option);
        setShowTriggerTabExpiryDropdown(false);
    };

     const percentageChange = (() => {
        const currentRate = parseFloat(triggerTabSwapRate);
        const marketRate = parseFloat(marketUnitPrice);

        if (isNaN(currentRate) || isNaN(marketRate) || marketRate === 0) return "N/A";
        const change = ((currentRate - marketRate) / marketRate) * 100;
        return change.toFixed(2);
     })();

     const percentageColor = percentageChange === "N/A" ? "text-gray-400" : parseFloat(percentageChange) >= 0 ? "text-green-500" : "text-red-500";

    return (
        <div className="text-2xl text-white font-bold p-4 w-full h-full overflow-y-auto">
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
                subtitle={tokenBalances?.tokens.find(x => x.name === baseAsset.name)?.balance ? Number(tokenBalances.tokens.find(x => x.name === baseAsset.name)!.balance).toFixed(3) : "0.000"}
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
                onAmountValueChange={() => {}}
                title="Receive"
                selectedToken={quoteAsset}
                 onselect={(asset) => setQuoteAsset(asset)}
                subtitle={tokenBalances?.tokens.find(x => x.name === quoteAsset.name)?.balance ? Number(tokenBalances.tokens.find(x => x.name === quoteAsset.name)!.balance).toFixed(3) : "0.000"}
            />

             {type === 'Trigger' && (
                <div className="flex flex-col md:flex-row px-1 gap-2 md:gap-0 mt-4">
                    <div className="w-full md:w-3/4 mb-4 md:mb-0 md:mr-4 bg-[#212127] py-4 px-4 rounded-lg flex flex-col justify-between ">
                        <div className="flex justify-between items-start text-sm text-gray-400">
                            <span>Sell {baseAsset.name} at rate <span className={percentageColor}>({percentageChange}%)</span></span>
                            <span
                                onClick={() => setTriggerTabSwapRate(quoteAmount?quoteAmount:marketUnitPrice)}
                                className="text-blue-400 cursor-pointer">Use Market</span>
                        </div>
                        <div className="flex justify-between items-end mt-2">
                            <input
                                type="text"
                                value={triggerTabSwapRate}
                                onChange={handleTriggerTabSwapRateChange}
                                className="text-2xl font-bold text-white bg-transparent border-none focus:outline-none w-1/2"
                            />
                            <div className="text-right">
                                <div className="text-white font-bold">{quoteAsset.name}/{baseAsset.name}</div>
                                <div className="text-gray-400 text-sm">Market: ≈ {marketUnitPrice}</div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-1/4 bg-[#212127] rounded-lg p-4 flex flex-col relative" ref={TriggerTabDropdownRef}>
                        <div className="text-sm text-gray-400">Expiry</div>
                        <div
                            className="flex items-center justify-between mt-1 text-white cursor-pointer"
                            onClick={() => setShowTriggerTabExpiryDropdown(!showTriggerTabExpiryDropdown)}
                        >
                            <span>{selectedTriggerTabExpiry}</span>
                            <span>&#9662;</span>
                        </div>

                        {showTriggerTabExpiryDropdown && (
                            <div className="absolute bottom-full left-0 mb-2 w-full bg-[#212127] shadow-xl rounded-md z-10">
                                {expiryOptions.map((option) => (
                                    <div
                                        key={option}
                                        className="px-4 py-2 text-white hover:bg-neutral-950/30 cursor-pointer text-sm"
                                        onClick={() => handleTriggerTabExpirySelect(option)}
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="flex justify-center mt-5">
                <form onSubmit={handleSubmit(onSubmitSwap)} className="w-full flex justify-center">
                     {type === 'Trigger' ? (
                         <button
                             type="submit"
                             className="text-neutral-900 py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-500/80 transition-colors w-[98%] text-[20px]"
                         >
                             Set Trigger
                         </button>
                     ) : (
                         watchedBaseAmount && Number(watchedBaseAmount) > 0 ? (
                             (tokenBalances?.tokens.find(x => x.name === baseAsset.name)?.balance ? Number(tokenBalances.tokens.find(x => x.name === baseAsset.name)!.balance) : 0) >= Number(watchedBaseAmount) ? (
                                 <button
                                     type="submit"
                                     className="text-neutral-900 py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-500/80 transition-colors w-[98%] text-[20px]"
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
                     )}
                </form>
            </div>

            {/* {type === 'Instant' && baseAsset && quoteAsset && (
                 <div className="flex gap-4 mt-6 ">
                    <MemoizedTradingViewSymbolOverviewWidget
                       symbol={`SOLUSD`}
                       className="flex-1"
                    />

                    {baseAsset.symbol !== quoteAsset.symbol && (
                       <MemoizedTradingViewSymbolOverviewWidget
                          symbol={`${quoteAsset.symbol}`}
                          className="flex-1"
                       />
                    )}
                 </div>
            )} */}
            
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

     const displayValue = inputLoading ? "" : amountValue;
     const placeholderText = inputLoading ? "" : "0";

     const standardProps: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> = {
        id: inputId,
        disabled: inputDisabled || inputLoading,
        placeholder: placeholderText,
        type: "text",
        className: "bg-[#212127] w-full h-14 text-3xl focus:outline-none text-white",
     };

     const inputProps = inputRegisterProps ? {
         ...standardProps,
         ...inputRegisterProps,
     } : {
         ...standardProps,
         value: displayValue,
         onChange: onAmountValueChange ? (e: React.ChangeEvent<HTMLInputElement>) => onAmountValueChange(e.target.value) : undefined,
     };

    return (
        <div className={`flex justify-between items-center bg-[#212127] text-sm rounded-lg m-1 ${className || ''}`}>
            <div className="p-5 font-light relative flex-grow">
                <div className="m-1">
                    {title}
                </div>
                <div className="relative w-full">
                    <input
                        {...inputProps}
                    />
                     {inputLoading && (
                         <div className="absolute inset-0 bg-neutral-700/30 rounded-xl animate-pulse flex items-center justify-center">
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
                    { selectedToken.name }
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