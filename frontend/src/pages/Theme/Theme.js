import {useEffect, useState} from "react"
import React from "react"
import { useParams } from "react-router-dom";
import BasicChart from "./basicChart/BasicChart.js";
import AssetInformation from "./assetInformation/AssetInformation.js";
import PerformanceInformation from "../components/performanceInformation/PerformanceInformation.js";
import ThemeChart from "./themeChart/ThemeChart.js";
import StockList from "../components/stockList/StockList.js";

const Theme = () =>{

    let { id } = useParams();
    const [assetObj, setAssetObj] = useState()
    const fetchData = async(url)=>{
        const response = await fetch(url)
        const data = await response.json()
        setAssetObj(data)
    }
       useEffect(()=>{
        const url = `${process.env.REACT_APP_BACKEND_URL_DEV}/api/themes/`+id
        fetchData(url)
    },[])
    
   
    if(assetObj){
        return(
            
            <div className="homeContainer">
                
            
                {/* chart last 1/3/6 months  */}
                <BasicChart assetObj={assetObj}/>

                {/* assetInformation */}
                <AssetInformation assetObj={assetObj}/>

                {/* Performance Information  */}
                <PerformanceInformation assetObj={assetObj}/>

                {/* SectorIndustryChart */}
                <ThemeChart assetObj={assetObj}/>

                {/* stockList  */}
                <StockList assetObj={assetObj}/>
                
            </div>
        
            // relative strength of sector/industry/theme 
            // relative strength inside of sector/industry/theme
        )
    }
}

export default Theme