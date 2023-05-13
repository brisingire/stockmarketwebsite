import "./ThemeChart.css"
import {useState, useEffect} from "react"
import HighchartsReact from "highcharts-react-official"
import Highcharts, { theme } from "highcharts/highstock";
import { FaArrowCircleUp, FaArrowAltCircleDown, FaArrowAltCircleRight} from "react-icons/fa";

const ThemeChart = ({assetObj}) =>{
    const [themeObjArr, setThemeObjArr] = useState([])
    let assetPriceArr = []

    const fetchData = async()=>{
        
        const newThemeObjArr = await Promise.all(
            assetObj.themes.map(async (themeId) => {
              const url = `${process.env.REACT_APP_BACKEND_URL_DEV}/api/themes/${themeId}`;
              const response = await fetch(url);
              const data = await response.json();
              return data;
            })
          );
          setThemeObjArr(newThemeObjArr);
        
    }

    useEffect(()=>{
    
        fetchData()
        
    },[window.location.pathname])
    


    
    assetObj["price_data"].map((entry)=>{
        assetPriceArr = assetPriceArr.concat(entry["c"])
    })

    

    const options = {

        chart: {
            // height: (8 / 16 * 100) + '%',
            // width: 800         
        },

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
            let themePriceArr = []

            theme["price_data"].map((entry)=>{
                themePriceArr = themePriceArr.concat(entry["c"])
            })

            options.series.push({
                type: 'line',
                name: theme.name,
                data: themePriceArr,
                events: {
                    legendItemClick: () => {
                        window.location.href = `/theme/${theme.id}`;
                        return false; // Prevent the default behavior of hiding the line
                    },
                    
                },
                
            })
            
        })
        
        //calculating price information
        let totalThemePrice = 0
        let avgThemePrice = 0
        
        
        themeObjArr.map((theme)=>{
            let themePriceArr = []

            theme["price_data"].map((entry)=>{
                themePriceArr = themePriceArr.concat(entry["c"])
            })

            totalThemePrice = totalThemePrice + (themePriceArr[themePriceArr.length-1]/themePriceArr[100])*100
                    })
        
        
        const themePriceMove = totalThemePrice / themeObjArr.length
        const assetPriceMove = (assetPriceArr[assetPriceArr.length-1]/assetPriceArr[100])*100
        let themeInformationIcon = 0
        let themeInformationText = "Stock aligns with related industries over last 20 days"
        if(((themePriceMove/assetPriceMove)<0.85)){
            // || (themePriceMove<100 && assetPriceMove>100)
            themeInformationIcon = 1
            themeInformationText = "Stock outperforms related industries over last 20 days"
        }else if(((themePriceMove/assetPriceMove)>1.1)){
            // || (themePriceMove>100 && assetPriceMove<100)
            themeInformationIcon = -1
            themeInformationText = "Stock trails related industries over last 20 days"
        }
        return(

            <div className="themeChartContainer">
                
                <HighchartsReact highcharts={Highcharts} options={options} className="highchart"/>
                <div className="themePriceInformation" >
                {themeInformationIcon==1?<FaArrowCircleUp style={{fontSize: "x-large", color: "green"}}/>:themeInformationIcon==-1?<FaArrowAltCircleDown style={{fontSize: "x-large", color: "red"}}/>:<FaArrowAltCircleRight style={{fontSize: "x-large", color: "orange"}}/>}
                    <p>{themeInformationText}</p>
                </div>
            </div>
        )
    }
}

export default ThemeChart