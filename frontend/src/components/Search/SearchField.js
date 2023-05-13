import "./searchField.css"
import {useState, useEffect} from "react"
import SearchResult from "./SearchResult";

const SearchField = () =>{

    const [inputValue, setInputValue] = useState("");
    const [query, setQuery] = useState([]); 

    const fetchHelper = async (key) =>{
        let helpArr = []
        const url = "http://localhost:8000/api/"+"stocks"+"?search="+key+"&limit=6"
        const response = await fetch(url)
        const data = await response.json()
        helpArr = helpArr.concat(data["results"])

        const sector_url = "http://localhost:8000/api/"+"sectors"+"?search="+key+"&limit=5"
        const sector_response = await fetch(sector_url)
        const sector_data = await sector_response.json()
        helpArr = helpArr.concat(sector_data["results"])

        const industry_url = "http://localhost:8000/api/"+"industries"+"?search="+key+"&limit=6"
        const industry_response = await fetch(industry_url)
        const industry_data = await industry_response.json()
        helpArr = helpArr.concat(industry_data["results"])

        const theme_url = "http://localhost:8000/api/"+"themes"+"?search="+key+"&limit=6"
        const theme_response = await fetch(theme_url)
        const theme_data = await theme_response.json()
        helpArr = helpArr.concat(theme_data["results"])
        
        return helpArr
    }

    const fetchData = async (key) =>{
        setInputValue(key)
        let arr = await fetchHelper(key)

        // set querry list to empty array if I do not search for more keys than 1.
        //otherwise it updates query list 
        if(key.length>1){
            setQuery(arr)
        }
        else{
            setQuery([])
        }
        
    }


   
    return(
        <div className="SearchContainer">
            <input className="SearchField" placeholder={"Sector, Industry, Theme or Stock..."} value={inputValue} onChange={(e)=>fetchData(e.target.value)}/>
            <SearchResult query={query}/>
        </div>
    ) 
}

export default SearchField