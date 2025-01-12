import { Connection } from "@solana/web3.js"
import axios from "axios";

let prices: {[key:string]:{
    price: string;
}} = {};
export interface TokenDetails {
    name: string,
    mint: string,
    native: Boolean,
    image:string
}
export let SUPPORTED_TOKENS :TokenDetails[] = [{
    name: "USDC",
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    native: false,
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXeBdRX87OyUcfUBP9Hq8zQgCo1cVeEaXZWNizy9Ekup2ElJUPuAzwX9k&s"
},{
    name: "USDT",
    mint:"Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    native: false,
    image:"https://png.pngtree.com/png-vector/20220119/ourmid/pngtree-tether-symbol-vector-icon-usdt-logo-crypto-pay-financial-altcoin-vector-png-image_44031312.jpg"
},{
    name: "SOL",
    mint:"So11111111111111111111111111111111111111112",
    native: true,
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH2rvI0FKxYk-l-MP9WiRkZUR4bY3qGkvz_w&s"
}]

export const connection = new Connection("https://solana-mainnet.g.alchemy.com/v2/wMhI7MINrKttxLL6U8FkFB_wsMDk7sbl")


export async function getSupportedTokens() {

let LAST_UPDATED: number = 0; 
const TOKENPRICE_REFRESH_INTERVAL = 60000; 
  if (!LAST_UPDATED || new Date().getTime() - LAST_UPDATED < TOKENPRICE_REFRESH_INTERVAL) {
    try {
      const response = await axios.get(
        "https://api.jup.ag/price/v2?ids=So11111111111111111111111111111111111111112,EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v,DEkqHyPN7GMRJ5cArtQFAWefqbZb33Hyf6s5iCwjEonT"
      );
      const prices = response.data.data;

      LAST_UPDATED = new Date().getTime();


      return SUPPORTED_TOKENS.map((token) => ({
        ...token,
        price: prices[token.mint]?.price || null, 
      }));
    } catch (error) {
      console.error("Error fetching token prices:", error);
      return SUPPORTED_TOKENS.map((token) => ({
        ...token,
        price: null, 
      }));
    }
  }

  // If the cache is still valid, return tokens with the current prices
  return SUPPORTED_TOKENS.map((token) => ({
    ...token,
    price: prices[token.mint]?.price || null, // Access price based on token.mint
  }));
}
