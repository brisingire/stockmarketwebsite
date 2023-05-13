import { useState, useMemo, useEffect } from "react";
import IndustryListElement from "./IndustryListElement";
import "./IndustryList.css";
import ReactPaginate from "react-paginate";
import "./Pagination.css";

const IndustryList = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const industriesPerPage = 10;
  const [sorting, setSorting] = useState({ column: "", order: "asc" });
  const [industriesData, setIndustriesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchIndustriesData = async () => {
    const response = await fetch("http://localhost:8000/api/industries");
    const industriesData = await response.json();
    setIndustriesData(industriesData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchIndustriesData();
  }, []);

  const handleHeaderClick = (column) => {
    setSorting((prevSorting) => ({
      column,
      order: prevSorting.column === column && prevSorting.order === "asc" ? "desc" : "asc",
    }));
  };

  const sortedIndustryList = useMemo(() => {
    if (!sorting.column) return industriesData;
    const sorted = [...industriesData];
    sorted.sort((a, b) => {
      if (sorting.column === 'name') {
        if (sorting.order === 'asc') {
          return a[sorting.column].localeCompare(b[sorting.column]);
        } else {
          return b[sorting.column].localeCompare(a[sorting.column]);
        }
      } else {
        if (sorting.order === "asc") {
          return a[sorting.column] - b[sorting.column];
        } else {
          return b[sorting.column] - a[sorting.column];
        }
      }
    });
    return sorted;
  }, [industriesData, sorting]);

  const displayIndustries = useMemo(() => {
    const pagesVisited = pageNumber * industriesPerPage;
    return sortedIndustryList
      .slice(pagesVisited, pagesVisited + industriesPerPage)
      .map((entry) => <IndustryListElement key={entry.id} industryObj={entry} />);
  }, [sortedIndustryList, pageNumber]);

  const pageCount = Math.ceil(industriesData.length / industriesPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th onClick={() => handleHeaderClick("name")}>Name</th>
              <th onClick={() => handleHeaderClick("one_month_volatility")}>One Month</th>
              <th onClick={() => handleHeaderClick("three_month_volatility")}>Three Month</th>
              <th onClick={() => handleHeaderClick("six_month_volatility")}>Six Month</th>
            </tr>
          </thead>
          <tbody>{displayIndustries}</tbody>
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
    </>
  );
};

export default IndustryList;
