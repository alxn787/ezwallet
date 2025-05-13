'use client'

import { useRouter } from "next/navigation"

export default function Navbarbutton({name}:{name:string}){
    const router = useRouter();
    return(
        <div 
        className="hover:text-blue-400 cursor-pointer"
        onClick={()=>router.push(`/${name}`)}
        >
            {name}
        </div>
    )
}