import { useState, useMemo, useEffect } from "react";
import ThemeListElement from "./ThemeListElement";
import "./ThemeList.css";
import ReactPaginate from "react-paginate";
import "./Pagination.css";

const ThemeList = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const [sorting, setSorting] = useState({ column: "", order: "asc" });
  const themesPerPage = 10;
  const [themesData, setThemesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchThemesData = async () => {
    const response = await fetch("http://localhost:8000/api/themes");
    const themesData = await response.json();
    setThemesData(themesData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchThemesData();
  }, []);

  const handleHeaderClick = (column) => {
    setSorting((prevSorting) => ({
      column,
      order: prevSorting.column === column && prevSorting.order === "asc" ? "desc" : "asc",
    }));
  };

  const sortedThemeList = useMemo(() => {
    if (!sorting.column) return themesData;
    const sorted = [...themesData];
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
  }, [themesData, sorting]);

  const displayThemes = useMemo(() => {
    const pagesVisited = pageNumber * themesPerPage;
    return sortedThemeList
      .slice(pagesVisited, pagesVisited + themesPerPage)
      .map((entry) => <ThemeListElement key={entry.id} themeObj={entry} />);
  }, [sortedThemeList, pageNumber]);

  const pageCount = Math.ceil(themesData.length / themesPerPage);

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
          <tbody>{displayThemes}</tbody>
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

export default ThemeList;
