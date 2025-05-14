"use client";
/* eslint-disable */
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface TokenData {
  id: string;
  name: string;
  symbol: string;
  usdPrice: number;
  holderCount: number;
  liquidity: number;
  icon: string;

  stats24h?: {
    priceChange: number;
  };
  organicScore?: number;
}

export default function Pro() {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
      const session = useSession();
      const router = useRouter();
    if(!session?.data?.user){
        router.push("/")
    }

  const API_ENDPOINT = "https://datapi.jup.ag/v1/assets/search?query";

  async function getAllProTokens() {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<TokenData[]>(API_ENDPOINT);
      setTokens(response.data);
      console.log(response.data);
    } catch (err) {
      console.error("Error fetching token data:", err);
      setError("Failed to fetch token data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllProTokens();
  }, []);

  const formatNumber = (num: number) => {
    if (num === null || num === undefined) return "-";
    return num.toLocaleString();
  };

  const formatPrice = (price: number) => {
    if (price === null || price === undefined) return "-";
    if (price < 0.001) return price.toFixed(6);
    if (price < 1) return price.toFixed(4);
    return price.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="h-20"></div>
      <div className="flex flex-col items-center ">

        {loading && <p className="text-blue-400">Loading tokens...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {!loading && !error && tokens.length === 0 && (
          <p className="text-gray-400">No token data available.</p>
        )}

        {!loading && !error && tokens.length > 0 && (
          <div className="overflow-x-auto w-full rounded-lg shadow-xl">
            <table className="min-w-full bg-black bg-opacity-50 rounded-lg overflow-hidden">
              <thead className="bg-blue-900 bg-opacity-70">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">
                    Token
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">
                    Price (USD)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">
                    Holders
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">
                    Liquidity (USD)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {tokens.map((token) => (
                  <tr
                    key={token.id}
                    className="hover:bg-blue-900 hover:bg-opacity-40 transition-colors duration-200"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-200">
                      <div className="flex items-center">
                        {token.icon && (
                          <img
                            src={token.icon}
                            alt={`${token.name} icon`}
                            className="w-6 h-6 mr-3 rounded-full border border-blue-700"
                          />
                        )}
                        <div>
                          <div className="font-medium text-white">
                            {token.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {token.symbol}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-200">
                      {formatPrice(token.usdPrice)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-200">
                      {formatNumber(token.holderCount)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-200">
                      {formatPrice(token.liquidity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}