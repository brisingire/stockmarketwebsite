import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import "./SectorListElement.css"

const SectorListElement = ({ sectorObj }) => {
  let counter = 0;
  let priceArrThreeMonths = [];
  const url = "/Sector/" + sectorObj.id;

  sectorObj["price_data"].map((entry) => {
    if (counter >= sectorObj["price_data"].length - 63) {
      priceArrThreeMonths = priceArrThreeMonths.concat(entry["c"]);
    }
    counter++;
  });


  const options = {
    chart: {
      height: 70,
      width: 150,
      backgroundColor: null,
      plotBorderColor: "transparent",
    },

    title: {
      text: null,
      style: {
        fontWeight: "bold",
      },
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

    yAxis: {
      labels: {
        enabled: false,
      },
      title: {
        text: null,
      },
      gridLineColor: "transparent",
    },

    plotOptions: {
      series: {
        marker: {
          enabled: false,
        },
      },
    },

    series: [
      {
        type: "line",
        data: priceArrThreeMonths,
        showInLegend: false,
      },
    ],

    tooltip: { enabled: false },

    credits: {
      enabled: false,
    },
  };

  return (
    <>
      <tr>
        <td className="sectorListElement-name">
          <p>
            <a href={url}  rel="noreferrer">
              {sectorObj.name}
            </a>
          </p>
        </td>
        <td className="sectorListElement-attribute">
          <p style={{ color: sectorObj.one_month_volatility >= 0 ? "green" : "red" }}>{sectorObj.one_month_volatility.toFixed(2)}</p>
        </td>
        <td className="sectorListElement-attribute">
          <p style={{ color: sectorObj.three_month_volatility >= 0 ? "green" : "red" }}>{sectorObj.three_month_volatility.toFixed(2)}</p>
        </td>
        <td className="sectorListElement-attribute">
          <p style={{ color: sectorObj.six_month_volatility >= 0 ? "green" : "red" }}>{sectorObj.six_month_volatility.toFixed(2)}</p>
        </td>
        <td className="sectorListElement-highchart">
            <HighchartsReact highcharts={Highcharts} options={options} className="highchart" />
        </td>
      </tr>
    </>
  );
};

export default SectorListElement;
