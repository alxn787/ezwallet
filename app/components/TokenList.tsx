import { TokenwithBalance } from "../api/Hooks/useTokens"


export function TokenList({tokens}: {
    tokens: TokenwithBalance[]
}) {
    return <div className="p-2">
        {tokens.map(t => <TokenRow key={t.name} token={t} />)}
    </div>
}

function TokenRow({token}: {
    token: TokenwithBalance
}) {
    return <div className="flex justify-between items-center">
        <div className="flex">
            <div>
                <img src={token.image} className="h-10 w-10 rounded-full mr-2" />
            </div>
            <div>
                <div className="font-bold">
                    {token.name}
                </div>
                <div className="font-slim">
                    {Number(token.balance).toFixed(3)}  {token.name}
                </div>
            </div>
        </div>
        <div>
            <div>
                <div className="font-bold flex justify-end">
                     ${Number(token.usdBalance).toFixed(2)}
                </div>

            </div>
        </div>
    </div>
}