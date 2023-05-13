import "./PerformanceInformation.css"


const PerformanceInformation = ({assetObj}) =>{
    return(
        <div className="performanceInformationContainer">
            
        <div className="box">
            <p>1 Month</p>
            <h2 style={{color: assetObj.one_month_volatility<0?"red": "green"}}>{assetObj.one_month_volatility.toFixed(1)}%</h2>
        </div>
        <div className="box">
            <p>3 Month</p>
            <h2 style={{color: assetObj.three_month_volatility<0?"red": "green"}}>{assetObj.three_month_volatility.toFixed(1)}%</h2>
        </div>
        <div className="box boxEnd">
            <p>6 Month</p>
            <h2 style={{color: assetObj.six_month_volatility<0?"red": "green"}}>{assetObj.six_month_volatility.toFixed(1)}%</h2>
        </div>
        
    </div>
    )  
}

export default PerformanceInformation