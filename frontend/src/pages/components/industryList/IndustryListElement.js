import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import "./IndustryListElement.css"

const IndustryListElement = ({ industryObj }) => {
  let counter = 0;
  let priceArrThreeMonths = [];
  const url = "/Industry/" + industryObj.id;

  industryObj["price_data"].map((entry) => {
    if (counter >= industryObj["price_data"].length - 63) {
      priceArrThreeMonths = priceArrThreeMonths.concat(entry["c"]);
    }
    counter++;
  });

  const options = {
    chart: {
      height: 70,
      width: 150,
      backgroundColor: "rgba(0, 0, 0, 0)",
      plotBorderColor: "transparent",
    },

    title: {
      text: "",
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
        <td className="industryListElement-name">
          <p>
            <a href={url} rel="noreferrer">
              {industryObj.name}
            </a>
          </p>
        </td>
        <td className="industryListElement-attribute">
          <p style={{ color: industryObj.one_month_volatility >= 0 ? "green" : "red" }}>{industryObj.one_month_volatility.toFixed(2)}</p>
        </td>
        <td className="industryListElement-attribute">
          <p style={{ color: industryObj.three_month_volatility >= 0 ? "green" : "red" }}>{industryObj.three_month_volatility.toFixed(2)}</p>
        </td>
        <td className="industryListElement-attribute">
          <p style={{ color: industryObj.six_month_volatility >= 0 ? "green" : "red" }}>{industryObj.six_month_volatility.toFixed(2)}</p>
        </td>
        <td className="industryListElement-highchart">
            <HighchartsReact highcharts={Highcharts} options={options} className="highchart" />
        </td>
      </tr>
    </>
  );
};

export default IndustryListElement;
