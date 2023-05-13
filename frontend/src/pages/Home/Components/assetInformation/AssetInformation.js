import "./AssetInformation.css"

const AssetInformation = ({assetObj}) =>{

    function abbreviateNumber(number) {
        // list of units
        var units = ["", "K", "M", "B","T"];
        var unitIndex = 0;
        // divide the number by 1000 until it's less than 1000
        while (number >= 1000) {
            number /= 1000;
            unitIndex++;
        }
        // round the number to one decimal place
        number = Math.round(number * 10) / 10;
        // return the number followed by the appropriate unit
        return number + units[unitIndex];
    }


    return(
        <div className="stocksAssetInformationContainer">
            
            <div className="box">
                {assetObj.type === "Stock" ?<p>Stock Ticker</p> : <p></p>}
                {assetObj.type === "Stock" ?<h4>{assetObj.ticker}</h4> : <h4></h4>}
            </div>
            <div className="box">
                <p>Market Cap</p>
                <h4>{abbreviateNumber(assetObj.market_cap)}</h4>
            </div>
            <div className="box">
                <p>Average Volume</p>
                <h4>{assetObj.avg_volume}</h4>
            </div>
            <div className="box boxEnd">
                <p>Asset Type</p>
                <h4>{assetObj.type}</h4>
            </div>
        </div>
    )
}

export default AssetInformation