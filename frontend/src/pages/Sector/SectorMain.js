import SectorList from "../components/sectorList/SectorList"


const SectorMain = () =>{
    return(
        <div className="homeContainer" >
            <h3 style={{textTransform: "uppercase", color: "#4f4f4f", letterSpacing: "0.05rem"}}>Sectors</h3>
             <SectorList/>
        </div>   
    
    )
}

export default SectorMain