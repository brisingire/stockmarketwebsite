import {Link} from "react-router-dom"
import "./Header.css"
import SearchField from "../Search/SearchField"

const Header = () =>{
    
    return(
        <div className="headerContainer">
            <div className="subHeaderContainer">
                <a href="/">
                    <div className="headline">
                        <span className="mainTitle">Stockmarket.industries</span>
                        <span className="betaLabel">BETA</span>
                    </div>
                </a>
                <div className="sub-header">
                    <a href="/Sector" style={{color: "#42a5f5"}}>Sectors</a>
                    <a href="/Industry" style={{color: "#007f4f"}}>Industries</a>
                    <a href="/Theme" style={{color: "#fbaf08"}}>Themes</a>
                </div>
            </div>
            
            <SearchField/>
            
        </div>    
    )
}

export default Header
