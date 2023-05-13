import "./filter.css"
import { FaFilter } from "react-icons/fa";

const Filter = ()=>{

    return(
    <div className="filter-container">
        <div className="filter">
            <div className="filterButtonOptions">
                <button>1M</button>
                <button>3M</button>
                <button>6M</button>
            </div>
        </div>
        <div className="results">
            <p>130 Results</p>
        </div>
    </div>
    )
}

export default Filter