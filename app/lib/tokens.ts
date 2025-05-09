
export interface TokenDetails {
    name: string;
    mint: string;
    native: boolean;
    price: string;
    image: string;
    decimals: number;
}


export const SUPPORTED_TOKENS: TokenDetails[] = [
    {
        "name": "SOL",
        "mint": "So11111111111111111111111111111111111111112",
        "native": true,
        "price": "180",
        "image": "https://upload.wikimedia.org/wikipedia/commons/3/34/Solana_cryptocurrency_two.jpg",
        "decimals": 9
    },
    {
        "name": "USDC",
        "mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        "native": false,
        "price": "1",
        "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1vAKYEl0YffTpWSxrqEi_gmUsl-0BuXSKMQ&s",
        "decimals": 6
    },
    {
        "name": "USDT",
        "mint": "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
        "native": false,
        "price": "1",
        "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvSxrpym7ij1Hf6zQOltcDORlrJGyj1kPf3A&s",
        "decimals": 6
    },
    {
        "name": "OFFICIAL TRUMP",
        "mint": "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN",
        "native": false,
        "price": "10.81",
        "image": "https://wsrv.nl/?w=48&h=48&url=https%3A%2F%2Farweave.net%2FVQrPjACwnQRmxdKBTqNwPiyo65x7LAT773t8Kd7YBzw",
        "decimals": 6
    },
    {
        "name": "Doland Tremp",
        "mint": "FU1q8vJpZNUrmqsciSjp8bAKKidGsLmouB8CBdf8TKQv",
        "native": false,
        "price": "0.027022",
        "image": "https://dd.dexscreener.com/ds-data/tokens/solana/fu1q8vjpznurmqscisjp8bakkidgslmoub8cbdf8tkqv.png?key=c4ae52",
        "decimals": 2
    },
    {
        "name": "Fartcoin",
        "mint": "9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump",
        "native": false,
        "price": "1.19",
        "image": "https://wsrv.nl/?w=48&h=48&url=https%3A%2F%2Fipfs.io%2Fipfs%2FQmQr3Fz4h1etNsF7oLGMRHiCzhB5y9a7GjyodnF7zLHK1g",
        "decimals": 6
    },
    {
        "name": "Drift Protocol",
        "mint": "DriFtupJYLTosbwoN8koMbEYSx54aFAVLddWsbksjwg7",
        "native": false,
        "price": "0.66",
        "image": "https://dd.dexscreener.com/ds-data/tokens/solana/driftupjyltosbwon8kombeyşx54afavlddwsbksjwg7.png?key=b38d8f",
        "decimals": 6
    },
    {
        "name": "Bonk",
        "mint": "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
        "native": false,
        "price": "0.00001599",
        "image": "https://bonkcoin.com/favicon.ico",
        "decimals": 5
    },
    {
        "name": "dogwifhat",
        "mint": "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
        "native": false,
        "price": "0.67",
        "image": "https://dd.dexscreener.com/ds-data/tokens/solana/ekpqgsjtjmfqkz9kqansqyxrcf8fbopzlhyxdm65zcjm.png?key=633e62",
        "decimals": 6
    },
    {
        "name": "Jupiter",
        "mint": "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
        "native": false,
        "price": "0.4593",
        "image": "https://static.jup.ag/jup/icon.png",
        "decimals": 6
    },
    {
        "name": "Serum",
        "mint": "SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt",
        "native": false,
        "price": "0.016050",
        "image": "https://dd.dexscreener.com/ds-data/tokens/solana/srmuapvndxxokk5gt7xd5cuugxmbcoaz2lheuaokwrt.png?key=c85757",
        "decimals": 6
    },
    {
        "name": "Raydium",
        "mint": "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        "native": false,
        "price": "2.76",
        "image": "https://dd.dexscreener.com/ds-data/tokens/solana/4k3dyjzvzp8emzwuxbbcjevskkk59s5icnly3qrkx6r.png?key=672359",
        "decimals": 6
    }
]