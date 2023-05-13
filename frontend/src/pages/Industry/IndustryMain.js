import IndustryList from "../components/industryList/IndustryList"


const IndustryMain = () =>{
    return(
        <div className="homeContainer">
            <h3 style={{textTransform: "uppercase", color: "#4f4f4f", letterSpacing: "0.05rem"}}>Industries</h3>
            <IndustryList/>
            
        </div>   
    
    )
}

export default IndustryMain