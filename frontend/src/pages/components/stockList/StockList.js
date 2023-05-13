import { useState, useMemo, useEffect } from "react";
import StockListElement from "./StockListElement";
import "./Stocklist.css";
import ReactPaginate from "react-paginate";
import "./Pagination.css";

const StockList = ({ assetObj }) => {
  const stockList = useMemo(() => assetObj.stocks.split(" ").map((entry) => parseInt(entry)), [assetObj]);
 

  const [pageNumber, setPageNumber] = useState(0);
  const [sorting, setSorting] = useState({ column: "", order: "asc" });
  const stocksPerPage = 10;
  const [stocksData, setStocksData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // add loading state


  const fetchStocksData = async () => {
        stockList.pop()
      const promises = stockList.map(async (stockId) => {
        const response = await fetch(`http://localhost:8000/api/stocks/${stockId}`);
        
        return await response.json();
      });
      
      const stocksData = await Promise.all(promises);
     
    
      
      
      setStocksData(stocksData);
      setIsLoading(false); // set loading state to false when data is loaded

    };
    
  useEffect(() => {
    fetchStocksData();
  }, [stockList]);

 

  const handleHeaderClick = (column) => {
    setSorting((prevSorting) => ({
      column,
      order: prevSorting.column === column && prevSorting.order === "asc" ? "desc" : "asc",
    }));
  };
  

  const sortedStockList = useMemo(() => {
    if (!sorting.column) return stocksData;
    const sorted = [...stocksData];
    sorted.sort((a, b) => {
      if (sorting.column === "name") {
        // For sorting by name (strings)
        if (sorting.order === "asc") {
          return a[sorting.column].localeCompare(b[sorting.column]);
        } else {
          return b[sorting.column].localeCompare(a[sorting.column]);
        }
      } else {
        // For sorting by numerical columns
        if (sorting.order === "asc") {
          return a[sorting.column] - b[sorting.column];
        } else {
          return b[sorting.column] - a[sorting.column];
        }
      }
    });
    return sorted;
  }, [stocksData, sorting]);


  const displayStocks = useMemo(() => {
    const pagesVisited = pageNumber * stocksPerPage;
    return sortedStockList
      .slice(pagesVisited, pagesVisited + stocksPerPage)
      .map((entry) => <StockListElement key={entry.id} stockObj={entry} />);
  }, [sortedStockList, pageNumber]);

  const pageCount = Math.ceil(stockList.length / stocksPerPage);



  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div className="stockListContainer">
      {isLoading ? ( // show loading component when data is loading
        <div>Loading...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th onClick={() => handleHeaderClick("name")}>Ticker / Name</th>
              <th onClick={() => handleHeaderClick("one_month_volatility")}>One Month</th>
              <th onClick={() => handleHeaderClick("three_month_volatility")}>Three Month</th>
              <th onClick={() => handleHeaderClick("six_month_volatility")}>Six Month</th>
            </tr>
          </thead>
          <tbody>{displayStocks}</tbody>
        </table>
      )}
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={pageCount}
        onPageChange={changePage}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName={"active"}
        containerClassName={"pagination"}
      />
    </div>
  );
  
};

export default StockList;
