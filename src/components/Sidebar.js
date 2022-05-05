import { useEffect, useRef, useState } from "react";
import classes from "../styles/Sidebar.module.css";
import DataItem from "../components/DataItem";

export default function Sidebar({
  geoData,
  page_size,
  paginationData,
  setPaginationData,
}) {
  const [pageNumber, setPageNumber] = useState(1);
  const [loadMoreVisible, setLoadMoreVisible] = useState(true);

  useEffect(() => {
    setPaginationData((prev) => {
      let array = [...prev];
      let newData = paginate(geoData.features, 3, pageNumber);
      return [...array, ...newData];
    });
    setLoadMoreVisible(geoData.features.length - pageNumber * page_size > 0);
  }, [pageNumber]);

  function paginate(array, page_size, page_number) {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  }

  function loadMore() {
    setPageNumber((prev) => ++prev);
  }

  return (
    <aside className={classes.sidebar}>
      <div className={classes.data_wrapper}>
        {paginationData.map((item, index) => {
          return <DataItem key={index} item={item} />;
        })}
        {loadMoreVisible && (
          <button className={classes.pagination_button} onClick={loadMore}>
            Load More
          </button>
        )}
      </div>
    </aside>
  );
}
