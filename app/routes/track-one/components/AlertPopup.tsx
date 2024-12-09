import { useState, useEffect } from "react"
import { useAlertContext } from "../context/AlertContext"
import type { Alert } from "~/lib/types"

export default function AlertPopUp(){
    const {alertArr} = useAlertContext()


    return <div className="fixed top-[50px] right-0 z-[999999] flex flex-col gap-2">
        {alertArr.map((alert:Alert)=><Alert status={alert.status} msg={alert.msg} key={alert.alertId}/>)}
    </div>
}

function Alert({status,msg}:{status:string,msg:string}){
    const [slideIn,setSlideIn] = useState(false)
    console.log(status,msg)

    useEffect(()=>{
        setSlideIn(true)
        setTimeout(() => {
            setSlideIn(false)
        }, 3000);
    },[])

    function getAlertColor(status:string){
        if(status==="success") return "rgb(132 204 22)"
        if(status==="failure") return "rgb(220 38 38)"
        return "rgb(107 114 128)";
    }   

    
    return <div className={`transition-transform duration-200 ease-in-out transform ${
            slideIn ? "translate-x-0" : "translate-x-[999px]"
        } text-white border-2 border-[#BCAAA0] px-3 py-2 min-w-[100px] max-w-[250px] font-sans flex justify-between items-center gap-2 text-sm rounded-md`}
        style={{ backgroundColor: getAlertColor(status) }}>
        <p>{msg}</p>
    </div>
}