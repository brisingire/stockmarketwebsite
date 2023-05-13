
import "./searchResult.css"

const SearchResult = ({query})=>{
    

    return(
        <div className="Searchresult" style={{boxShadow: query.length>2? "5px 5px 5px 0 rgb(221, 216, 216)":"None"}}>
            <ul>
                
                {
                    query.map((q)=>{      
                        let link = ""
                        if(q.type == "Stock"){
                            link = "/"+q.id
                        }if(q.type == "Sector"){
                            link = "/sector/"+q.id
                        }if(q.type == "Industry"){
                            link = "/industry/"+q.id
                        }if(q.type == "Theme"){
                            link = "/theme/"+q.id
                        }
                        return (
                            <a href={link}>
                                <li key={link}>
                                    <p style={{margin: "0.1rem",color: q.type==="Stock" ? "black" : q.type==="Sector" ? "#42a5f5" : q.type==="Industry" ? "#007f4f" : "#fbaf08"}}>{q.name} ({q.type})</p>      
                                </li> 
                            </a>  
                        )
                    })
                }
                
            </ul>
        </div>
    )
 
    
}

export default SearchResult