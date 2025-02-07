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
                        className="rounded-md border border-blue-950 inline-flex items-center justify-center text-white hover:text-[#2460e8] focus:outline-none hover:scale-110"
                        onClick={() => setSelectedTabs("Tokens")}
                    >
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
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
