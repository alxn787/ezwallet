import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const inputMint = searchParams.get("inputMint");
    const outputMint = searchParams.get("outputMint");
    const amount = searchParams.get("amount");
    const slippageBps = searchParams.get("slippageBps") || "50";

    if (!inputMint || !outputMint || !amount) {
        return NextResponse.json(
            { error: "Missing required parameters: inputMint, outputMint, amount" },
            { status: 400 }
        );
    }

    try {
        // Updated to use the new Jupiter API endpoint (old quote-api.jup.ag/v6/quote is deprecated)
        const quoteUrl = `https://lite-api.jup.ag/swap/v1/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`;
        
        console.log("Fetching quote from Jupiter:", quoteUrl);

        const response = await fetch(quoteUrl, {
            method: "GET",
            headers: {
                "Accept": "application/json",
            },
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => "Could not read error response");
            console.error("Jupiter API error:", response.status, errorText);
            
            // Try to parse as JSON if possible
            let errorDetails = errorText;
            try {
                const errorJson = JSON.parse(errorText);
                errorDetails = errorJson;
            } catch {
                // Keep as text
            }
            
            return NextResponse.json(
                { 
                    error: "Failed to fetch quote from Jupiter",
                    status: response.status,
                    details: errorDetails 
                },
                { status: response.status >= 400 && response.status < 500 ? response.status : 500 }
            );
        }

        let data;
        try {
            data = await response.json();
        } catch (parseError: any) {
            const text = await response.text().catch(() => "Could not read response");
            console.error("Failed to parse JSON response:", parseError, "Response text:", text.substring(0, 500));
            return NextResponse.json(
                { 
                    error: "Invalid JSON response from Jupiter",
                    details: text.substring(0, 500)
                },
                { status: 500 }
            );
        }
        
        if (!data || !data.outAmount) {
            console.error("Invalid quote response - missing outAmount:", data);
            return NextResponse.json(
                { 
                    error: "Invalid quote response from Jupiter",
                    details: "Response missing outAmount field",
                    receivedData: data 
                },
                { status: 500 }
            );
        }

        console.log("Successfully fetched quote, outAmount:", data.outAmount);
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Error fetching quote:", error);
        const errorMessage = error?.message || "Unknown error";
        const errorStack = error?.stack;
        
        return NextResponse.json(
            { 
                error: "Failed to fetch quote",
                message: errorMessage,
                stack: process.env.NODE_ENV === "development" ? errorStack : undefined
            },
            { status: 500 }
        );
    }
}

