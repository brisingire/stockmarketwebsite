import {useState, useEffect} from "react"
import HighchartsReact from "highcharts-react-official"
import Highcharts, { theme } from "highcharts/highstock";
import { FaArrowCircleUp, FaArrowAltCircleDown, FaArrowAltCircleRight} from "react-icons/fa";
import "./SectorChart.css"

const SectorChart = ({assetObj}) =>{
    
    const [sectorObjArr, setSectorObjArr] = useState([])
    let assetPriceArr = []

    const fetchData = async()=>{
        
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL_DEV}/api/sectors`)
        const data = await response.json()
        setSectorObjArr(data)
        
        
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
            // width: 800         
        },

        title : {
            text: "Price Chart - Related Sectors", 
            style: {
                fontWeight: 'bold', 
            },
            
            
        }, 
        colors : [
            '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', 
            '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf', 
            '#aec7e8', '#ffbb78', '#98df8a', '#ff9896', '#c5b0d5', 
            '#c49c94', '#f7b6d2', '#c7c7c7', '#dbdb8d', '#9edae5'
          ],

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
            lineWidth: 3,
            
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
    
    //push sector data into the series 
    if(sectorObjArr.length>=1){
        
        //add themes to themeList 
        sectorObjArr.map((sector)=>{
            if(sector.name != assetObj.name){
                let sectorPriceArr = []

                sector["price_data"].map((entry)=>{
                    sectorPriceArr = sectorPriceArr.concat(entry["c"])
                })

                options.series.push({
                    type: 'line',
                    name: sector.name,
                    data: sectorPriceArr,
                    opacity: 1,
                    lineWidth: 0.8,
                    events: {
                        legendItemClick: () => {
                            window.location.href = `/sector/${sector.id}`;
                            return false; // Prevent the default behavior of hiding the line
                        },
                    },
                })
            }
            
            
        })

        //calculating price information
        let totalSectorPrice = 0
        let avgSectorPrice = 0
        
        
        sectorObjArr.map((sector)=>{
            let sectorPriceArr = []

            sector["price_data"].map((entry)=>{
                sectorPriceArr = sectorPriceArr.concat(entry["c"])
            })

            totalSectorPrice = totalSectorPrice + (sectorPriceArr[sectorPriceArr.length-1]/sectorPriceArr[100])*100
                    })
        
        
        const sectorPriceMove = totalSectorPrice / sectorObjArr.length
        const assetPriceMove = (assetPriceArr[assetPriceArr.length-1]/assetPriceArr[100])*100
        let sectorInformationIcon = 0
        let sectorInformationText = "Sector aligns with related sectors over last 20 days"
        if(((sectorPriceMove/assetPriceMove)<0.96)){
            // || (themePriceMove<100 && assetPriceMove>100)
            sectorInformationIcon = 1
            sectorInformationText = "Sector outperforms related sectors over last 20 days"
        }else if(((sectorPriceMove/assetPriceMove)>1.04)){
            // || (themePriceMove>100 && assetPriceMove<100)
            sectorInformationIcon = -1
            sectorInformationText = "Sector trails related industry over last 20 days"
        }
    


        return(
            <div style={{marginTop: "2rem"}}>
                <HighchartsReact highcharts={Highcharts} options={options} className="highchart"/>
                <div className="sectorPriceInformation" >
                    {sectorInformationIcon==1?<FaArrowCircleUp style={{fontSize: "x-large", color: "green"}}/>:sectorInformationIcon==-1?<FaArrowAltCircleDown style={{fontSize: "x-large", color: "red"}}/>:<FaArrowAltCircleRight style={{fontSize: "x-large", color: "orange"}}/>}
                    <p>{sectorInformationText}</p>
                </div>
                
            </div>
            

        )
    }
}

export default SectorChart