import {useState, useEffect} from "react"
import HighchartsReact from "highcharts-react-official"
import Highcharts, { theme } from "highcharts/highstock";
import { FaArrowCircleUp, FaArrowAltCircleDown, FaArrowAltCircleRight} from "react-icons/fa";
import "./ThemeChart.css"


const ThemeChart = ({assetObj}) =>{

    
    const [themeObjArr, setThemeObjArr] = useState([])
    let assetPriceArr = []

    const fetchData = async()=>{
        
        let arr = assetObj.themes.split(" ")
        for (let i = 0; i < arr.length; i++) {
            arr[i] = parseInt(arr[i]); // convert each element to an integer
        }
        arr.pop()
        
        
        const newThemeObjArr = await Promise.all(
            arr.map(async (themeId) => {
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
            height: themeObjArr.length >12 ?700 : 500,
            type: 'line',
            
        },
        
        title : {
            text: "Price Chart - Related Themes", 
            style: {
                fontWeight: 'bold', 
            },     
        }, 
        legend: {
            // Other legend options
            margin: 30, // Adjust the margin to give more space between the legend and the chart area
            maxHeight: 100, // Set the maximum height for the legend
            align: 'center',
            verticalAlign: 'bottom',
            layout: 'horizontal',
            itemStyle: {
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
            },
        },
        
        legend: {
            navigation: {
                enabled: true,
                arrowSize: 12,
                style: {
                    fontSize: '12px'
                }
            }
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

    if (themeObjArr.length >= 1) {
        
        themeObjArr.forEach((theme) => {
          const themePriceArr = theme.price_data.flatMap((entry) => entry.c);
      
          options.series.push({
            type: 'line',
            name: theme.name,
            data: themePriceArr,
            lineWidth: 0.9,
            opacity: 1,
            events: {
                legendItemClick: () => {
                    window.location.href = `/theme/${theme.id}`;
                    return false; // Prevent the default behavior of hiding the line
                },
                
            },
          });
        });
    }

    
    if(themeObjArr.length >0){
        return(
            <div className="themeChartContainer" style={{marginTop: "4rem"}}>
                <HighchartsReact highcharts={Highcharts} options={options} className="highchart"/>
            </div>
        )
    }
    

}

export default ThemeChart