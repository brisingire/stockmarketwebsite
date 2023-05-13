import ThemeList from "../components/themeList/ThemeList"


const ThemeMain = () =>{
    return(
        <div className="homeContainer">
            <h3 style={{textTransform: "uppercase", color: "#4f4f4f", letterSpacing: "0.05rem"}}>Themes</h3>
            <ThemeList/>
           
            
        </div>   
    
    )
}

export default ThemeMain