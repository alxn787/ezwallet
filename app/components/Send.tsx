import { useState } from "react";
import { SUPPORTED_TOKENS, TokenDetails } from "../lib/tokens";
import { AssetSelector } from "./Swap";
import { Button } from "./Button";


export function SendToken(){

    const [selectedToken,setselectedToken] = useState(SUPPORTED_TOKENS[0])
    const [recieverAddress, setRecieverAddress] = useState("")

    function SendTransaction(){
        alert(selectedToken.name)
    }
   
    return (
        <div className="text-white">
            <div className="bg-[#212127] rounded-lg flex justify-between">
                <input 
                onChange={(e)=>setRecieverAddress(e.target.value)}
                type="text" 
                placeholder="Enter address" 
                className="bg-[#212127] rounded-lg px-4 py-3 w-full"/>
                <AssetSelector 
                onselect={(asset)=>setselectedToken(asset) }
                selectedToken ={selectedToken}/>
            </div>
            <div className="flex justify-center my-5">
            <Button 
            insidevalue = {`Send ${selectedToken.name}`} 
            onClick={()=>{SendTransaction}}/>
            </div>
        </div>
    )
}