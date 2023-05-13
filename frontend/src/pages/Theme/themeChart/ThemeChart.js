import "./ThemeChart.css"
import {useEffect, useState} from "react"
import HighchartsReact from "highcharts-react-official"
import Highcharts, { theme } from "highcharts/highstock";
import { FaArrowCircleUp, FaArrowAltCircleDown, FaArrowAltCircleRight} from "react-icons/fa";

const ThemeChart = ({assetObj}) =>{

    const [themeObjArr, setThemeObjArr] = useState([])
    let assetPriceArr = []

    const fetchData = async()=>{
        
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL_DEV}/api/themes`)
        const data = await response.json()
        setThemeObjArr(data)   
    }


    //count number of themes in the chart for height of chart 
    let counter = 0
    themeObjArr.map((theme)=>{
        if(theme.industry == assetObj.industry ){
            counter = counter +1 
        }
    })
    


    useEffect(()=>{
    
        fetchData()
        
    },[window.location.pathname])

    //add price data from assetObj
    assetObj["price_data"].map((entry)=>{
        assetPriceArr = assetPriceArr.concat(entry["c"])
    })


    
    const options = {

        chart: {
            height: counter > 8 ? 700 : 500
         
            
            // width: 800         
        },


        colors : [
            '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', 
            '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf', 
            '#aec7e8', '#ffbb78', '#98df8a', '#ff9896', '#c5b0d5', 
            '#c49c94', '#f7b6d2', '#c7c7c7', '#dbdb8d', '#9edae5'
          ],

        title : {
            text: "Price Chart - Related Themes", 
            style: {
                fontWeight: 'bold', 
            },
            
            
        }, 
        

        xAxis : {
            // categories: categories, 
            labels: {
                enabled: false
            },
            gridLineWidth: 0, 
            plotBands: [{
                color: 'rgba(95, 158, 160, 0.1)', // gray color with opacity 0.2
                from: 100, // starting x-axis value for plot band
                to: 126, // ending x-axis value for plot band
            }],

        }, 
        
        yAxis : {
            // categories: categories, 
            type: 'logarithmic',
            labels: {
                enabled: false
            },
            title: {
                text: null
              },
              gridLineWidth: 0
        }, 

       
        
        series: [
        
        {
            type: 'line',
            name: assetObj.name,
            data : assetPriceArr,
            zIndex: 2,
            lineWidth: 2.3,
        }  
        ],

        plotOptions: {
            series: {
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                }
            }
        },
        
        
        tooltip: { enabled: false },
            
        credits: {
            enabled: false
        },     
        
    }

    if(themeObjArr.length>=1){
        
        //add themes to themeList 
        themeObjArr.map((theme)=>{
            if(theme.name != assetObj.name){
                if(theme.industry == assetObj.industry  ){
                    let themePriceArr = []

                    theme["price_data"].map((entry)=>{
                        themePriceArr = themePriceArr.concat(entry["c"])
                    })

                    options.series.push({
                        type: 'line',
                        name: theme.name,
                        data: themePriceArr,
                        lineWidth: 1, 
                        opacity: 1,
                        events: {
                            legendItemClick: () => {
                                window.location.href = `/theme/${theme.id}`;
                                return false; // Prevent the default behavior of hiding the line
                            },
                            
                        },
                    })
                }
                
            }
            
            
        })
    }

    //calculating price information
    let totalThemePrice = 0
    let avgIndustryPrice = 0
    let count = 0 
    
    themeObjArr.map((theme)=>{

        if(theme.industry == assetObj.industry){
            let themePriceArr = []
            if(theme["price_data"].length>0){
                theme["price_data"].map((entry)=>{
                    themePriceArr = themePriceArr.concat(entry["c"])
                })
    
                totalThemePrice = totalThemePrice + (themePriceArr[themePriceArr.length-1]/themePriceArr[100])*100
                
                count = count + 1
            }
            
            
        }
        
    })
    
    
    const themePriceMove = totalThemePrice / count
   
    const assetPriceMove = (assetPriceArr[assetPriceArr.length-1]/assetPriceArr[100])*100
    
    
 
    let themeInformationIcon = 0
    let themeInformationText = "Theme aligns with related themes over last 20 days"
    if (((assetPriceMove / themePriceMove) > 1.05)) {
        themeInformationIcon = 1;
        themeInformationText ="Theme outperforms related themes over last 20 days"
    } else if (((assetPriceMove / themePriceMove) < 0.95)) {
        themeInformationIcon = -1;
        themeInformationText = "Theme trails related themes over last 20 days"
    }
    
    
        
    if(counter > 1){
        return(
            <div>
                <div style={{marginTop: "4rem"}}>
                    <HighchartsReact highcharts={Highcharts} options={options} className="highchart"/>
                </div>
                <div className="industryPriceInformation">
                    {themeInformationIcon==1?<FaArrowCircleUp style={{fontSize: "x-large", color: "green"}}/>:themeInformationIcon==-1?<FaArrowAltCircleDown style={{fontSize: "x-large", color: "red"}}/>:<FaArrowAltCircleRight style={{fontSize: "x-large", color: "orange"}}/>}
                    <p>{themeInformationText}</p>
                </div>
            </div>
        )
    }
    
}

export default ThemeChart