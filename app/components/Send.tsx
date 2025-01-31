import { useState } from "react";
import { SUPPORTED_TOKENS} from "../lib/tokens";
import { AssetSelector } from "./Swap";
import { Button } from "./Button";
import axios from "axios";


export function SendToken({address}:{address:string}){

    const [selectedToken,setselectedToken] = useState(SUPPORTED_TOKENS[0])
    const [recieverAddress, setRecieverAddress] = useState("")
    const [Amount, setAmount] = useState("")




    async function SendTransaction(){
        console.log(recieverAddress,address)
        axios.post("/api/send",{recieverAddress, address,Amount})
    }
   
    return (
        <div className="text-white">
            <div className="bg-[#212127] rounded-lg flex justify-between p-2">
                <input 
                onChange={(e)=>setRecieverAddress(e.target.value)}
                type="text" 
                placeholder="Enter address" 
                className="bg-[#212127] rounded-lg px-4 py-3 w-full focus:outline-none"/>
            </div>
            <div className="flex justify-between items-center bg-[#212127] text-sm p-3 rounded-xl mt-3">
                <input
                    onChange={(e) => setAmount(e.target.value)}
                    value={Amount} 
                    placeholder="0" 
                    type="text"
                    className="py-5 bg-[#212127] w-56 h-14  text-3xl focus:outline-none"
                />

                <AssetSelector 
                onselect={(asset)=>setselectedToken(asset) }
                selectedToken ={selectedToken}/>
            </div>
            <div className="flex justify-center my-5">
            <Button 
            insidevalue = {`Send ${selectedToken.name}`} 
            onClick={()=>{SendTransaction()}}/>
            </div>
        </div>
    )
}