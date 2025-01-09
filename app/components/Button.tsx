"use client"
export const Button = ({children,onClick}:{
    children : React.ReactNode,
    onClick : () => void
})=>{
    return(
        <button type="button" onClick={onClick} className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
            {children}
        </button>

    )
}