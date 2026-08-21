import { useEffect, useState } from "react"

const useDebounce=(query,delay)=>{

    const [value,setValue] = useState("")

    useEffect(()=>{
    let timer = setTimeout(()=>{
        // console.log("setting",query)
        setValue(query)
     },delay)
     return ()=>{
        clearTimeout(timer)
     }
    },[query,delay])

    return value
}

export default useDebounce