import { Connection } from "@solana/web3.js"
import axios from "axios";
import { SUPPORTED_TOKENS } from "./tokens";
let prices: {[key:string]:{
    price: string;
}} = {};

export const connection = new Connection("https://solana-mainnet.g.alchemy.com/v2/wMhI7MINrKttxLL6U8FkFB_wsMDk7sbl")


export async function getSupportedTokens() {

let LAST_UPDATED: number = 0; 
const TOKENPRICE_REFRESH_INTERVAL = 60000; 
  if (!LAST_UPDATED || new Date().getTime() - LAST_UPDATED < TOKENPRICE_REFRESH_INTERVAL) {
    try {
      const response = await axios.get(
        "https://api.jup.ag/price/v2?ids=So11111111111111111111111111111111111111112,EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v,Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"
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

  return SUPPORTED_TOKENS.map((token) => ({
    ...token,
    price: prices[token.mint]?.price || null, 
  }));
}
