import "./StockListElement.css";
import HighchartsReact from "highcharts-react-official"
import Highcharts from "highcharts/highstock";

const StockListElement = ({ stockObj }) => {
    let counter = 0
    let priceArrThreeMonths = []
    const url = "/"+stockObj.id

    try{

      stockObj["price_data"].map((entry)=>{
        
        if(counter >= stockObj["price_data"].length - 63){
            priceArrThreeMonths = priceArrThreeMonths.concat(entry["c"])
        }
        counter++
      })

    }catch(error){
      console.log("An error occurred:", error)
    }
   

    const options = {

        chart: {
            height: 70,
            width: 150, 
            backgroundColor: 'rgba(0, 0, 0, 0)',
            plotBorderColor: 'transparent',

     
        },

        title : {
            text: "",
            style: {
                fontWeight: 'bold'
            }
        }, 
        

        xAxis: {
          visible: false,
          labels: {
            enabled: false
          },
          gridLineWidth: 0,
          minorGridLineWidth: 0,
          lineWidth: 0,
          tickWidth: 0
        },
        
        yAxis : {
            // categories: categories, 
            
            labels: {
                enabled: false
            },
            title: {
                text: null
              },
            gridLineColor: 'transparent'


        }, 

        plotOptions: {
            series: {
              marker: {
                enabled: false
              }
            }
        },
       
        series: [{
            type: 'line',
            data:priceArrThreeMonths,
            showInLegend: false, 

        }], 

          
        tooltip: { enabled: false },
            
        credits: {
            enabled: false
        },     
        
    }

  return (
    <>
      <tr>
        <td className="stockListElement-name">
          <p><a href={url} target="_blank">{stockObj.ticker}</a></p>
          <p style={{ color: "gray" }}>{stockObj.name}</p>
        </td>
        <td className="stockListElement-performance">
          <p style={{ color: stockObj.one_month_volatility >= 0 ? "green" : "red" }}>{stockObj.one_month_volatility.toFixed(2)}</p>
        </td>
        <td className="stockListElement-performance">
          <p style={{ color: stockObj.three_month_volatility >= 0 ? "green" : "red" }}>{stockObj.three_month_volatility.toFixed(2)}</p>
        </td>
        <td className="stockListElement-performance">
          <p style={{ color: stockObj.six_month_volatility >= 0 ? "green" : "red" }}>{stockObj.six_month_volatility.toFixed(2)}</p>
        </td>
        <td className="stockListElement-performance-chart">
            <HighchartsReact highcharts={Highcharts} options={options} className="highchart"/>
        </td>
      </tr>
    </>
  );
};

export default StockListElement;
