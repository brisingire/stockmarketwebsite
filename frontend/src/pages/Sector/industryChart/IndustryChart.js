import "./IndustryChart.css"
import {useEffect, useState} from "react"
import HighchartsReact from "highcharts-react-official"
import Highcharts, { theme } from "highcharts/highstock";

const IndustryChart = ({assetObj}) =>{

    const [industryObjArr, setIndustryObjArr] = useState([])
    let assetPriceArr = []

    const fetchData = async()=>{
        let arr = assetObj.industries.split(" ")
        for (let i = 0; i < arr.length; i++) {
            arr[i] = parseInt(arr[i]); // convert each element to an integer
        }
        arr.pop()
        
        const newIndustryObjArr = await Promise.all(
            
            arr.map(async (industryId) => {
              const url = `${process.env.REACT_APP_BACKEND_URL_DEV}/api/industries/${industryId}`;
              const response = await fetch(url);
              const data = await response.json();
              return data;
            })
        );
        setIndustryObjArr(newIndustryObjArr);
        
        
    }

    useEffect(()=>{
    
        fetchData()
        
    },[window.location.pathname])

    assetObj["price_data"].map((entry)=>{
        assetPriceArr = assetPriceArr.concat(entry["c"])
    })


    const options = {

        chart: {
            // height: '50%',
            height: 500,
            // width: 800
          },

        title : {
            text: "Price Chart - Related Industries", 
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
        
        ],

        plotOptions: {
            series: {
              marker: {
                enabled: false,
                states: {
                  hover: {
                    enabled: false,
                  },
                },
              },
            },
        },
        
        tooltip: { enabled: false },
            
        credits: {
            enabled: false
        },     
        
    }


    if (industryObjArr.length >= 1) {
        industryObjArr.forEach((industry) => {
          const industryPriceArr = industry.price_data.flatMap((entry) => entry.c);
      
          options.series.push({
            type: 'line',
            name: industry.name,
            data: industryPriceArr,
            lineWidth: 0.9,
            opacity: 1,
            events: {
                legendItemClick: () => {
                    window.location.href = `/industry/${industry.id}`;
                    return false; // Prevent the default behavior of hiding the line
                },
                
            },
          });
        });
    }


    return (
        <div style={{marginTop: "2rem"}}>
            <HighchartsReact highcharts={Highcharts} options={options} className="highchart"/>
        </div>
        
    )
}

export default IndustryChart