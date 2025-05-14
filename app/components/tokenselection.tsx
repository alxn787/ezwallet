"use client";

import React from 'react';
import { SUPPORTED_TOKENS, TokenDetails } from "../lib/tokens";
import { X } from 'lucide-react'; // Assuming you have lucide-react installed for the close icon


interface TokenSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectToken: (token: TokenDetails) => void;
}

export function TokenSelectionModal({ isOpen, onClose, onSelectToken }: TokenSelectionModalProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
             style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0, 0, 0, 0.6)' }} // Apply blur and dark overlay
        >
            {/* Modal Content Container */}
            <div className="bg-[#212127] text-white rounded-lg shadow-xl w-full max-w-sm max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-neutral-700">
                    <h3 className="text-lg font-semibold">Select Token</h3>
                    <button onClick={onClose} className="text-neutral-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {/* Token List (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {SUPPORTED_TOKENS.map(token => (
                        <div
                            key={token.mint}
                            className="flex items-center p-3 rounded-md hover:bg-neutral-700 cursor-pointer transition-colors"
                            onClick={() => onSelectToken(token)}
                        >
                            <div className="w-6 h-6 mr-3 bg-neutral-600 rounded-full flex items-center justify-center text-xs">
                                {token.image[0]} {/* Placeholder initial */}
                            </div>
                            <div>
                                <p className="font-medium">{token.image}</p>
                                <p className="text-sm text-neutral-400">{token.name}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Optional: Search Input */}
                 <div className="p-4 border-t border-neutral-700">
                     <input type="text" placeholder="Search tokens..." className="w-full p-2 rounded bg-neutral-700 text-white placeholder-neutral-400 focus:outline-none"/>
                 </div>
            </div>
        </div>
    );
}