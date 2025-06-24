'use client';
/* eslint-disable */
import { useEffect, useState, useCallback, memo } from "react";
import Tradingview from "../components/Tradingview";
import { SUPPORTED_TOKENS} from "../lib/tokens";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


const MAINTENANCE_MARGIN_RATE = 0.0065; 
//@ts-ignore
function TradingInterface({ onTokenSelect }) {
    const [orderType, setOrderType] = useState<'Market' | 'Limit'>('Market');
    const [leverage, setLeverage] = useState(1.1);
    const [selectedTokenSymbol, setSelectedTokenSymbol] = useState(SUPPORTED_TOKENS[0]?.symbol || '');
    const [tradeSide, setTradeSide] = useState<'buy' | 'sell'>('buy');
    const [currentPrice, setCurrentPrice] = useState<number | null>(null);
    const [loadingPrice, setLoadingPrice] = useState(false);
    const [inputAmount, setInputAmount] = useState('');
    const [entryPrice, setEntryPrice] = useState<number | null>(null);
    const [liquidationPrice, setLiquidationPrice] = useState<number | null>(null);


    const selectedTokenDetails = SUPPORTED_TOKENS.find(token => token.symbol === selectedTokenSymbol);
    //@ts-ignore
    const handleLeverageChange = useCallback((event) => {
        setLeverage(parseFloat(event.target.value));
    }, []);

    //@ts-ignore
    const handleTokenChange = useCallback((event) => {
        const newTokenSymbol = event.target.value;
        setSelectedTokenSymbol(newTokenSymbol);
        if (onTokenSelect) {
            onTokenSelect(newTokenSymbol);
        }
        setInputAmount('');
        setEntryPrice(null);
        setLiquidationPrice(null);
        setCurrentPrice(null);
    }, [onTokenSelect]);
    //@ts-ignore
    const handleTradeSideChange = useCallback((side) => {
        setTradeSide(side);
    }, []);
    ///@ts-ignore
    const handleInputAmountChange = useCallback((event) => {
        setInputAmount(event.target.value);
    }, []);


    const getTokenPrice = useCallback(async (mint:string) => {
        if (!mint) {
            setCurrentPrice(null);
            setLoadingPrice(false);
            return;
        }

        setLoadingPrice(true);
        setCurrentPrice(null);
        try {
            const priceResponse = await fetch(
                `https://api.jup.ag/price/v2?ids=${mint}`
            );


            const responseText = await priceResponse.text();


            if (!priceResponse.ok) {
                throw new Error(`Error fetching price: ${priceResponse.statusText}`);
            }

            let priceData;
            try {
                priceData = JSON.parse(responseText);
            } catch (parseError) {
                throw new Error("Invalid JSON response from price API");
            }


            if (priceData && priceData.data && priceData.data[mint] && priceData.data[mint].price !== undefined) {
                const priceInfo = priceData.data[mint];
                const priceString = priceInfo.price;

                const priceNumber = parseFloat(priceString);

                if (!isNaN(priceNumber)) {
                    setCurrentPrice(priceNumber);
                } else {
                    setCurrentPrice(null);
                }
            } else {
                setCurrentPrice(null);
            }

        } catch (error) {
            setCurrentPrice(null);
        } finally {
            setLoadingPrice(false);
        }
    }, []);

    useEffect(() => {
        const details = SUPPORTED_TOKENS.find(token => token.symbol === selectedTokenSymbol);

        if (details) {
            getTokenPrice(details.mint);
        } else {
            setCurrentPrice(null);
        }
    }, [selectedTokenSymbol, getTokenPrice]);

    useEffect(() => {
        if (currentPrice !== null) {
            setEntryPrice(currentPrice);
        } else {
            setEntryPrice(null);
            setLiquidationPrice(null); 
        }
    }, [currentPrice]);
    useEffect(() => {
        if (entryPrice !== null && leverage >= 1.1) { 
            let calculatedLiqPrice = null;
            const imr = 1 / leverage; 

            if (imr > MAINTENANCE_MARGIN_RATE) {
                if (tradeSide === 'buy') { 
                    // Formula: Entry Price * (1 - (1/Leverage - MMR) / (1 - MMR))
                     calculatedLiqPrice = entryPrice * (1 - (imr - MAINTENANCE_MARGIN_RATE) / (1 - MAINTENANCE_MARGIN_RATE));
                } else { // Short position
                    // Formula: Entry Price * (1 + (1/Leverage - MMR) / (1 + MMR))
                    calculatedLiqPrice = entryPrice * (1 + (imr - MAINTENANCE_MARGIN_RATE) / (1 + MAINTENANCE_MARGIN_RATE));
                }
            }

            setLiquidationPrice(calculatedLiqPrice);

        } else {
             setLiquidationPrice(null); 
        }
    }, [entryPrice, leverage, tradeSide]); 



    //@ts-ignore
    const formatPrice = useCallback((price) => {
        if (price === null) return '-';
        const decimals = selectedTokenDetails?.decimals ?? 2;
        return `$ ${price.toFixed(decimals > 8 ? 8 : decimals)}`;
    }, [selectedTokenDetails]);


    return (
        <div className="w-full p-4 bg-[#212127] text-white rounded-lg shadow-lg flex flex-col">
            <div className="text-2xl font-bold mb-2">
                {loadingPrice ? (
                    "Loading..."
                ) : currentPrice !== null ? (
                     formatPrice(currentPrice)
                ) : (
                    "Price N/A"
                )}
            </div>

            <div className="flex mb-4 rounded-md overflow-hidden">
                <button
                    className={`flex-1 py-2 text-center font-bold ${tradeSide === 'buy' ? 'bg-green-600/90' : 'bg-gray-700 hover:bg-gray-600'}`}
                    onClick={() => handleTradeSideChange('buy')}
                >
                    Long/Buy
                </button>
                <button
                    className={`flex-1 py-2 text-center font-bold ${tradeSide === 'sell' ? 'bg-red-600/80' : 'bg-gray-700 hover:bg-gray-600'}`}
                    onClick={() => handleTradeSideChange('sell')}
                >
                    Short/Sell
                </button>
            </div>

            <div className="flex mb-4 rounded-md overflow-hidden">
                <button
                    className={`flex-1 py-2 text-center ${orderType === 'Market' ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'}`}
                    onClick={() => setOrderType('Market')}
                >
                    Market
                </button>
                <button
                    className={`flex-1 py-2 text-center ${orderType === 'Limit' ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'}`}
                    onClick={() => setOrderType('Limit')}
                >
                    Limit
                </button>
            </div>

            {orderType === 'Limit' && (
                 <div className="mb-4">
                    <input
                        type="number"
                        placeholder={currentPrice !== null ? formatPrice(currentPrice) : "Enter Limit Price"}
                        className="w-full p-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        // You might want state and handler for limit price input
                    />
                 </div>
            )}

            <div className="flex justify-between items-center mb-4 text-sm">
                <span>You're paying</span>
                <span>{inputAmount || '0'} {selectedTokenDetails?.symbol.replace(/USDT$/, '').replace(/USD$/, '') || 'Token'}</span>
            </div>

            <div className="flex items-center mb-4 gap-1 bg-black rounded-lg">
                <select
                    className="p-2 rounded-lg bg-black text-white focus:outline-none  flex-shrink-0"
                    value={selectedTokenSymbol}
                    onChange={handleTokenChange}
                >
                    {SUPPORTED_TOKENS.filter(token => token.symbol).map(token => (
                        <option key={token.mint} value={token.symbol}>
                            {token.name}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="0.00"
                    className="flex-1 p-2 rounded-r-md bg-black text-white placeholder-gray-400 focus:outline-none rounded-lg"
                    value={inputAmount}
                    onChange={handleInputAmountChange}
                />
            </div>

            <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                    <span>Leverage: {leverage.toFixed(1)}x</span>
                    <span>100x</span> {/* Max Leverage - consider making dynamic */}
                </div>
                <input
                    type="range"
                    min="1.1"
                    max="100"
                    step="0.1"
                    value={leverage}
                    onChange={handleLeverageChange}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                {/* Static leverage labels */}
                <div className="flex justify-between text-sm mt-1">
                     <span>1.1x</span>
                     <span>20x</span>
                     <span>40x</span>
                     <span>60x</span>
                     <span>80x</span>
                     <span>100x</span>
                </div>
            </div>


            <button className={`w-full py-3 font-bold rounded-md mb-4 transition-colors
                ${tradeSide === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`
            }>
                {tradeSide === 'buy' ? 'Long/Buy' : 'Short/Sell'}
            </button>

            <div className="text-sm mt-auto">
                <div className="flex justify-between mb-1">
                    <span>Entry Price</span>
                    <span>{formatPrice(entryPrice)}</span>
                </div>
                <div className="flex justify-between mb-1">
                    <span>Liquidation Price</span>
                    <span>{formatPrice(liquidationPrice)}</span>
                </div>
                <div className="flex justify-between mb-1">
                    <span>Total Fees</span>
                    <span>-</span>
                </div>
                <div className="flex justify-between mb-1">
                    <span>borrow fees due :</span>
                    <span>-</span>
                </div>
            </div>
        </div>
    );
}


export default function Perps() {
    const session = useSession();
        const router = useRouter();
    if(!session.data?.user){
        router.push("/")
    }
    const [currentToken, setCurrentToken] = useState(SUPPORTED_TOKENS[0]?.symbol || '');
    //@ts-ignore
    const handleTokenSelect = (tokenSymbol) => {
        setCurrentToken(tokenSymbol);
    };

    return (
        <div className="w-screen h-screen flex flex-col">
            <div className="h-16 "></div> 
            <div className="flex flex-1 ">
                <div className=" w-2/3 h-full rounded-xlx"> 
                    <Tradingview symbol={currentToken} />
                </div>

                <div className="h-full px-2  w-1/3">
                    <TradingInterface onTokenSelect={handleTokenSelect} />
                </div>
            </div>
        </div>
    );
}