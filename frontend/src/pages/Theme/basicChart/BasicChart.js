import HighchartsReact from "highcharts-react-official"
import Highcharts from "highcharts/highstock";
import {useEffect, useState} from "react"
import { FaArrowCircleUp, FaArrowAltCircleDown, FaArrowAltCircleRight} from "react-icons/fa";
import "./BasicChart.css"


const BasicChart = ({assetObj}) =>{
   

    const [timeFrame, setTimeFrame] = useState("3 Months")
    let priceArrSixMonths = []
    let priceArrThreeMonths = []
    let priceArrOneMonth = []
    let counter = 0

    
    let priceChange = (assetObj["price_data"][assetObj["price_data"].length-1]["c"]/assetObj["price_data"][assetObj["price_data"].length-14]["c"])*100  
    let priceInformationText = {
        increasing : ["Price Increased over last 14 days"], 
        steady : ["Price stagnated over last 14 days"], 
        declining: ["Price decreased over last 14 days"]
    }

    assetObj["price_data"].map((entry)=>{
        priceArrSixMonths = priceArrSixMonths.concat(entry["c"])
        if(counter >=  assetObj["price_data"].length - 21){
            priceArrOneMonth = priceArrOneMonth.concat(entry["c"])
        }
        if(counter >= assetObj["price_data"].length - 63){
            priceArrThreeMonths = priceArrThreeMonths.concat(entry["c"])
        }
        counter++
    })
    
    const options = {

        chart: {
            // height: (8 / 16 * 100) + '%',
            // width: 800         
        },

        title : {
            text: "Price Chart - " + assetObj["name"],
            style: {
                fontWeight: 'bold'
            }
        }, 
        

        xAxis : {
            // categories: categories, 
            labels: {
                enabled: false
            },
            gridLineWidth: 0, 
            gridLineWidth: 0, 
            plotBands: [],

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

       
        series: [{
            type: 'area',
            
            showInLegend: false, 
            data : timeFrame=="1 Month" ? priceArrOneMonth : (timeFrame=="3 Months" ? priceArrThreeMonths : priceArrSixMonths),
            
            fillColor: {
            linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1
            },
            stops: [
                [0, Highcharts.getOptions().colors[0]],
                [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
            ]
            },
           

        }], 

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


    //add plot band 
    if(timeFrame=="3 Months"){
        options.xAxis.plotBands.push({
            color: 'rgba(95, 158, 160, 0.1)', // gray color with opacity 0.2
            from: 49, // starting x-axis value for plot band
            to: 62, // ending x-axis value for plot band
        })
    }if(timeFrame=="6 Months"){
        options.xAxis.plotBands.push({
            color: 'rgba(95, 158, 160, 0.1)', // gray color with opacity 0.2
            from: 111, // starting x-axis value for plot band
            to: 125, // ending x-axis value for plot band
        })
    }
    


    return(
        <div className="basicChartContainer" style={{marginBottom:"10%"}}>
            <HighchartsReact highcharts={Highcharts} options={options} className="highchart"/>
            <div className="timeframeFilter" >
                <p onClick={()=>setTimeFrame("1 Month")} style={{padding: "0.1rem",backgroundColor: timeFrame ==="1 Month" ? "#d2d2d2" : "inherit", }}>1 M</p>
                <p onClick={()=>setTimeFrame("3 Months")} style={{padding: "0.1rem",backgroundColor: timeFrame ==="3 Months" ? "#d2d2d2" : "inherit"}}>3 M</p>
                <p onClick={()=>setTimeFrame("6 Months")} style={{padding: "0.1rem",backgroundColor: timeFrame ==="6 Months" ? "#d2d2d2" : "inherit"}}>6 M</p>
            </div>
            <div className="priceInformation" >
                
                {priceChange>102?<FaArrowCircleUp style={{fontSize: "x-large", color: "green"}}/>:priceChange<98?<FaArrowAltCircleDown style={{fontSize: "x-large", color: "red"}}/>:<FaArrowAltCircleRight style={{fontSize: "x-large", color: "orange"}}/>}

                {priceChange>102?<p>{priceInformationText["increasing"]}</p>:priceChange<98?<p>{priceInformationText["declining"]}</p>:<p>{priceInformationText["steady"]}</p>}
            </div>
            
        </div>
    )
}

export default BasicChart