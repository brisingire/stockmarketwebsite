import { useState, useMemo, useEffect } from "react";
import SectorListElement from "./SectorListElement";
import "./SectorList.css";
import "./Pagination.css";

const SectorList = () => {
  const [sorting, setSorting] = useState({ column: "", order: "asc" });
  const [sectorsData, setSectorsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSectorsData = async () => {
    const response = await fetch("http://localhost:8000/api/sectors");
    const sectorsData = await response.json();
    setSectorsData(sectorsData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSectorsData();
  }, []);

  const handleHeaderClick = (column) => {
    setSorting((prevSorting) => ({
      column,
      order: prevSorting.column === column && prevSorting.order === "asc" ? "desc" : "asc",
    }));
  };

  const sortedSectorList = useMemo(() => {
    if (!sorting.column) return sectorsData;
    const sorted = [...sectorsData];
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
  }, [sectorsData, sorting]);

  const displaySectors = useMemo(() => {
    return sortedSectorList.map((entry) => <SectorListElement key={entry.id} sectorObj={entry} />);
  }, [sortedSectorList]);

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
          <tbody>{displaySectors}</tbody>
        </table>
      )}
    </>
  );
};

export default SectorList;

