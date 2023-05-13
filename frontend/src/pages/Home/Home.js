import React from "react"
import "./Home.css"
import { useParams } from "react-router-dom";
import {useState,useEffect} from "react"
import BasicChart from "./Components/basicChart/BasicChart";
import AssetInformation from "./Components/assetInformation/AssetInformation";
import PerformanceInformation from "../components/performanceInformation/PerformanceInformation";
import SectorChart from "./Components/sectorChart/SectorChart";
import IndustryChart from "./Components/industryChart/Industrychart";
import ThemeChart from "./Components/themeChart/ThemeChart";





const Home = ()=>{
    let { id } = useParams();
    const [assetObj, setAssetObj] = useState()

    const fetchData = async(url)=>{
        const response = await fetch(url)
        const data = await response.json()
        setAssetObj(data)
    }
    useEffect(() => {
        const url = `${process.env.REACT_APP_BACKEND_URL_DEV}/api/stocks/${id}`;
        fetchData(url);
      }, []);
    
    if(assetObj){
        return(
            <>
                <div className="homeContainer">
                    

                    {/* chart last 1/3/6 months  */}
                    <BasicChart assetObj={assetObj}/>

                
                    {/* basic information to asset   */}
                    <AssetInformation assetObj={assetObj}/>

                    {/* Performance Information  */}
                    <PerformanceInformation assetObj={assetObj}/>

                    <SectorChart assetObj={assetObj}/>
                    
                    <IndustryChart assetObj={assetObj}/>

                    <ThemeChart assetObj={assetObj}/>

                    
                </div>
           
           </>

            

            // relative strength of sector/industry/theme 
            // relative strength inside of sector/industry/theme
        )
    }
    
}


export default Home 