import React from "react"
import { useParams } from "react-router-dom";
import {useState,useEffect} from "react"
import BasicChart from "./basicChart/BasicChart"
import AssetInformation from "./assetInformation/AssetInformation";
import PerformanceInformation from "../components/performanceInformation/PerformanceInformation";
import IndustryChart from "./industryChart/IndustryChart";
import StockList from "../components/stockList/StockList";
import ThemeChart from "./themeChart/ThemeChart";




const Industry = () =>{

    let { id } = useParams();
    const [assetObj, setAssetObj] = useState()
   
    const fetchData = async(url)=>{
        const response = await fetch(url)
        const data = await response.json()
        setAssetObj(data)
    }
       useEffect(()=>{
        const url = `${process.env.REACT_APP_BACKEND_URL_DEV}/api/industries/`+id
        
        fetchData(url)
    },[])
    
    if(assetObj){
        return(
            
            <div className="homeContainer">
            
                {/* chart last 1/3/6 months  */}
                <BasicChart assetObj={assetObj}/>

                {/* basic information to asset   */}
                <AssetInformation assetObj={assetObj}/>

                {/* Performance Information  */}
                <PerformanceInformation assetObj={assetObj}/>

                {/*industry  chart */}
                <IndustryChart assetObj={assetObj}/>


                {/* theme chart  */}
                <ThemeChart assetObj={assetObj}/>

                {/* stockList  */}
                <StockList assetObj={assetObj}/>
                
            </div>
        
            // relative strength of sector/industry/theme 
            // relative strength inside of sector/industry/theme
        )
    }
    

}

export default Industry 