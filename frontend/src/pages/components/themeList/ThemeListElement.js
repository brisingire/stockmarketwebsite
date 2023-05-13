import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import "./ThemeListElement.css";

const ThemeListElement = ({ themeObj }) => {
  let counter = 0;
  let priceArrThreeMonths = [];
  const url = "/theme/" + themeObj.id;

  themeObj["price_data"].map((entry) => {
    if (counter >= themeObj["price_data"].length - 63) {
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
        <td className="themeListElement-name">
          <p>
            <a href={url} rel="noreferrer">
              {themeObj.name}
            </a>
          </p>
        </td>
        <td className="themeListElement-attribute">
          <p style={{ color: themeObj.one_month_volatility >= 0 ? "green" : "red" }}>{themeObj.one_month_volatility.toFixed(2)}</p>
        </td>
        <td className="themeListElement-attribute">
          <p style={{ color: themeObj.three_month_volatility >= 0 ? "green" : "red" }}>{themeObj.three_month_volatility.toFixed(2)}</p>
        </td>
        <td className="themeListElement-attribute">
          <p style={{ color: themeObj.six_month_volatility >= 0 ? "green" : "red" }}>{themeObj.six_month_volatility.toFixed(2)}</p>
        </td>
        <td className="themeListElement-highchart">
            <HighchartsReact highcharts={Highcharts} options={options} className="highchart" />
        </td>
      </tr>
    </>
  );
};

export default ThemeListElement;
