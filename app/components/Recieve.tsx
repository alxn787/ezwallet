import { Button } from "./Button";

export default function Recieve({ setSelectedTabs, address }: { 
    setSelectedTabs: (value: string) => void; 
    address: string; 
}) { 
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
            <div className="border border-slate-700 w-[440px] h-[380px] rounded-lg shadow-md p-3 bg-[#0c111f]  bg-opacity-80 text-white">
                <div className="flex justify-end">
                    <button 
                        onClick={() => setSelectedTabs("Tokens")}
                        className="text-white font-bold text-lg"
                    >
                        X
                    </button>
                </div>

                <div className="flex flex-col items-center h-full mt-6 ">
                    <div>
                    <img 
                        src={`https://quickchart.io/qr?text=${address}`} 
                        alt="QR Code"
                        className="w-40 h-40 rounded-lg"
                    />
                    </div>
                    <div className="mt-8 font-medium">
                    <p> {address}</p>
                    </div>
                    <div className="mt-5">
                    <Button 
                    onClick={() => {navigator.clipboard.writeText(address)}}
                    insidevalue = "Copy Address"
                    />
                    </div>

                </div>
            </div>
        </div>
    );
}
