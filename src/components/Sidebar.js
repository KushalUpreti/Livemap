import { useEffect, useRef, useState } from "react";
import classes from "../styles/Sidebar.module.css";

export default function Sidebar({ geoData, page_size }) {
  const [paginationData, setPaginationData] = useState([]);
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

function DataItem({ item }) {
  return (
    <div className={classes.data_item}>
      <p>Country: {item.properties.NAME}</p>
      <p>Timezone: {item.properties.TIMEZONE}</p>
      <p>Longitude: {item.geometry.coordinates[0]}</p>
      <p>Latitude: {item.geometry.coordinates[1]}</p>
    </div>
  );
}
