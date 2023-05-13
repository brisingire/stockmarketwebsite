import "./IndustryChart.css"
import {useState, useEffect} from "react"
import HighchartsReact from "highcharts-react-official"
import Highcharts from "highcharts/highstock";
import { FaArrowCircleUp, FaArrowAltCircleDown, FaArrowAltCircleRight} from "react-icons/fa";

const IndustryChart = ({assetObj}) =>{

    const [industryObj, setIndustryObj] = useState()
    let industryPriceArr = []
    let assetPriceArr = []

    const fetchData = async(url)=>{
        const response = await fetch(url)
        const data = await response.json()
        setIndustryObj(data)
       
    }

    useEffect(()=>{
        const url = `${process.env.REACT_APP_BACKEND_URL_DEV}/api/`+"industries/"+assetObj["industry"]
        fetchData(url)
    },[])

    // add price data from sector and other asset to price arrays 
    if(industryObj){
        industryObj["price_data"].map((entry)=>{
            industryPriceArr = industryPriceArr.concat(entry["c"])
        })
    }
    
    assetObj["price_data"].map((entry)=>{
        assetPriceArr = assetPriceArr.concat(entry["c"])
    })

    

    const options = {

        chart: {
            // height: (8 / 16 * 100) + '%',
            // width: 800         
        },

        title : {
            text: "Price Chart - Related Industry", 
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
            },
            {
                type: 'line',
                name: industryObj?industryObj.name:"Industry",
                data : industryPriceArr, 
                events: {
                    legendItemClick: () => {
                        window.location.href = `/industry/${industryObj.id}`;
                        return false; // Prevent the default behavior of hiding the line
                    },
                    
                },             
            },
                
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
    

    if(industryObj){
        //add function to click industryObj to open 
        


        const industryPriceMove = (industryPriceArr[industryPriceArr.length-1]/industryPriceArr[100])*100
        const assetPriceMove = (assetPriceArr[assetPriceArr.length-1]/assetPriceArr[100])*100
        let industryInformationIcon = 0
        let industryInformationText = "Stock aligns with related industry over last 20 days"
        if(((industryPriceMove/assetPriceMove)<0.90)){
            // || (industryPriceMove<100 && assetPriceMove>100)
            industryInformationIcon = 1
            industryInformationText = "Stock outperforms related industry over last 20 days"
        }else if(((industryPriceMove/assetPriceMove)>1.1)){
            // || (industryPriceMove>100 && assetPriceMove<100)
            industryInformationIcon = -1
            industryInformationText = "Stock trails related industry over last 20 days"
        }
        return(
            <div className="industryChartContainer">
                
                <HighchartsReact highcharts={Highcharts} options={options} className="highchart"/>
                <div className="industryPriceInformation" >
                {industryInformationIcon==1?<FaArrowCircleUp style={{fontSize: "x-large", color: "green"}}/>:industryInformationIcon==-1?<FaArrowAltCircleDown style={{fontSize: "x-large", color: "red"}}/>:<FaArrowAltCircleRight style={{fontSize: "x-large", color: "orange"}}/>}
                    {industryPriceMove/assetPriceMove>1.05}
                    <p>{industryInformationText}</p>
                </div>
            </div>
        )
    }
}

export default IndustryChart