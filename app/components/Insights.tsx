'use client'
import { useEffect, useState } from "react";

export default function Insights() {
    const [tokenlist, setTokenlist] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function getTokenlist() {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/insights", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: "Get a list of interesting Solana tokens." }),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }

            const text = await response.text();
            console.log("Received text from API:", text);
            let data;
            try {
                data = JSON.parse(text);
                 if (Array.isArray(data)) {
                    setTokenlist(data);
                 } else {
                     console.error("Parsed data is not an array:", data);
                     setError("API returned unexpected data format (not a JSON array).");
                     setTokenlist([]);
                 }
            } catch (parseError) {
                console.error("Failed to parse JSON from API text:", text, parseError);
                setError("Failed to parse API response as JSON.");
                setTokenlist([]);
            }


        } catch (err) {
            console.error("Failed to fetch or process token list:", err);
            if (err instanceof Error) {
                setError(`Failed to load tokens: ${err.message}`);
            } else {
                 setError("An unknown error occurred while fetching tokens.");
            }
            setTokenlist([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getTokenlist();
    }, []);

    return (
        <div className="w-[95%] max-w-[650px] rounded-b-lg bg-[#090808] text-white shadow-lg p-8 border-y border-slate-800">
            <h2 className="text-xl font-semibold mb-4">Token Insights</h2>
            {/* Conditional Rendering for Spinner */}
            {loading && (
                <div className="flex justify-center items-center py-4">
                    {/* Spinner element */}
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="ml-3">Loading tokens...</p> {/* Optional: keep text next to spinner */}
                </div>
            )}
            {/* Rest of the content */}
            {error && <p className="text-red-500">Error: {error}</p>}
            {!loading && !error && tokenlist.length === 0 && <p>No tokens found.</p>}
            {!loading && !error && tokenlist.length > 0 && (
                <ul>
                    {tokenlist.map((token, index) => (
                        <div key={index} className="mb-2 p-2 bg-black rounded-lg">   
                            {token}
                        </div>
                    ))}
                </ul>
            )}
        </div>
    );
}
