import "./SectorChart.css"
import {useState, useEffect} from "react"
import HighchartsReact from "highcharts-react-official"
import Highcharts from "highcharts/highstock";
import { FaArrowCircleUp, FaArrowAltCircleDown, FaArrowAltCircleRight} from "react-icons/fa";

const SectorChart = ({assetObj}) =>{

    const [sectorObj, setSectorObj] = useState()
    let sectorPriceArr = []
    let assetPriceArr = []

    const fetchData = async(url)=>{
        const response = await fetch(url)
        const data = await response.json()
        setSectorObj(data)
       
    }

    useEffect(()=>{
        const url = `${process.env.REACT_APP_BACKEND_URL_DEV}/api/`+"sectors/"+assetObj["sector"]
        fetchData(url)
    },[])

    // add price data from sector and other asset to price arrays 
    if(sectorObj){
        sectorObj["price_data"].map((entry)=>{
            sectorPriceArr = sectorPriceArr.concat(entry["c"])
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
            text: "Price Chart - Related Sector", 
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
            name: sectorObj?sectorObj.name:"Sector",
            data : sectorPriceArr,
            events: {
                legendItemClick: () => {
                    window.location.href = `/sector/${sectorObj.id}`;
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

    if(sectorObj){
        const sectorPriceMove = (sectorPriceArr[sectorPriceArr.length-1]/sectorPriceArr[100])*100
        const assetPriceMove = (assetPriceArr[assetPriceArr.length-1]/assetPriceArr[100])*100
        let sectorInformationIcon = 0
        let sectorInformationText = "Stock aligns with sector over last 20 days"
        if(((sectorPriceMove/assetPriceMove)<0.90)){
            // || (sectorPriceMove<100 && assetPriceMove>100)
            sectorInformationIcon = 1
            sectorInformationText = "Stock outperforms related sector over last 20 days"
        }else if(((sectorPriceMove/assetPriceMove)>1.1)){
            //|| (sectorPriceMove>100 && assetPriceMove<100)
            sectorInformationIcon = -1
            sectorInformationText = "Stock trails related sector over last 20 days"
        }
        
        return(
            <div className="sectorChartContainer">
                
                <HighchartsReact highcharts={Highcharts} options={options} className="highchart"/>
                <div className="SectorPriceInformation" >
                    {sectorInformationIcon==1?<FaArrowCircleUp style={{fontSize: "x-large", color: "green"}}/>:sectorInformationIcon==-1?<FaArrowAltCircleDown style={{fontSize: "x-large", color: "red"}}/>:<FaArrowAltCircleRight style={{fontSize: "x-large", color: "orange"}}/>}
                    <p>{sectorInformationText}</p>
                </div>
            </div>
        )
    }
}

export default SectorChart