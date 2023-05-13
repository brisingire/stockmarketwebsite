import {useState, useEffect} from "react"
import HighchartsReact from "highcharts-react-official"
import Highcharts, { theme } from "highcharts/highstock";
import { FaArrowCircleUp, FaArrowAltCircleDown, FaArrowAltCircleRight} from "react-icons/fa";
import "./IndustryChart.css"
import Industry from "../Industry";

const IndustryChart = ({assetObj}) =>{
    
    const [industryObjArr, setIndustryObjArr] = useState([])
    let assetPriceArr = []

    const fetchData = async()=>{
        
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL_DEV}/api/industries`)
        const data = await response.json()
        setIndustryObjArr(data)
        
        
    }

    useEffect(()=>{
    
        fetchData()
        
    },[window.location.pathname])
    
    //add price data from assetObj
    assetObj["price_data"].map((entry)=>{
        assetPriceArr = assetPriceArr.concat(entry["c"])
    })

    

    const options = {

        chart: {
            height: 500,
                  
        },

        title : {
            text: "Price Chart - Related Industries", 
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

        colors : [
            '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', 
            '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf', 
            '#aec7e8', '#ffbb78', '#98df8a', '#ff9896', '#c5b0d5', 
            '#c49c94', '#f7b6d2', '#c7c7c7', '#dbdb8d', '#9edae5'
          ],

        
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
            lineWidth: 3,
            // dashStyle: 'Dot',
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
    
    //push industry data into the series 
    if(industryObjArr.length>=1){
        
        //add themes to themeList 
        industryObjArr.map((industry)=>{
            if(industry.name != assetObj.name){
                if(industry.sector == assetObj.sector){
                    let industryPriceArr = []

                    industry["price_data"].map((entry)=>{
                        industryPriceArr = industryPriceArr.concat(entry["c"])
                    })

                    options.series.push({
                        type: 'line',
                        name: industry.name,
                        data: industryPriceArr,
                        // color: '#7f7f7f',
                        // dashStyle: 'Dot',
                        lineWidth: 1,
                        opacity: "0.9",
                        events: {
                            legendItemClick: () => {
                                window.location.href = `/industry/${industry.id}`;
                                return false; // Prevent the default behavior of hiding the line
                            },
                            
                        },
                    })
                }
                
            }
            
            
        })


        //calculating price information
        let totalIndustryPrice = 0
        let avgIndustryPrice = 0
        let count = 0
        
        
        industryObjArr.map((industry)=>{
            if(industry.sector == assetObj.sector){

                let industryPriceArr = []

                if(industry["price_data"].length>0){
                    industry["price_data"].map((entry)=>{
                        industryPriceArr = industryPriceArr.concat(entry["c"])
                    })
    
                    totalIndustryPrice = totalIndustryPrice + (industryPriceArr[industryPriceArr.length-1]/industryPriceArr[100])*100
                    count = count + 1
                }
            }

        })
        
        
        const industryPriceMove = totalIndustryPrice / count        
        const assetPriceMove = (assetPriceArr[assetPriceArr.length-1]/assetPriceArr[100])*100
       
        let industryInforamtionIcon = 0
        let industryInformationText = "Industry aligns with related industries over last 20 days"
        if(((industryPriceMove/assetPriceMove)<0.94)){
            // || (themePriceMove<100 && assetPriceMove>100)
            industryInforamtionIcon = 1
            industryInformationText = "Industry outperforms related industries over last 20 days"
        }else if(((industryPriceMove/assetPriceMove)>1.06)){
            // || (themePriceMove>100 && assetPriceMove<100)
            industryInforamtionIcon = -1
            industryInformationText = "Industry trails related industry over last 20 days"
        }
        
    


        return(
            <div className="industryChartContainer">
                <HighchartsReact highcharts={Highcharts} options={options} className="highchart"/>
                <div className="industryPriceInformation" >
                    {industryInforamtionIcon==1?<FaArrowCircleUp style={{fontSize: "x-large", color: "green"}}/>:industryInforamtionIcon==-1?<FaArrowAltCircleDown style={{fontSize: "x-large", color: "red"}}/>:<FaArrowAltCircleRight style={{fontSize: "x-large", color: "orange"}}/>}
                    <p>{industryInformationText}</p>
                </div>
                
            </div>
            

        )
    }
}

export default IndustryChart