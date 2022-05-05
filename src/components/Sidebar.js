import { useEffect, useRef, useState } from "react";
import classes from "../styles/Sidebar.module.css";

export default function Sidebar({ geoData, page_size }) {
  const [paginationData, setPaginationData] = useState(() => {
    let array = paginate(geoData.features, 3, 1);
    return array;
  });
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [index, setIndex] = useState(0);

  const pageNumber = useRef(1);

  function paginate(array, page_size, page_number) {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  }

  useEffect(() => {
    if (geoData.features.length - index > 3) {
      setShowLoadMore(true);
      return;
    }
    setShowLoadMore(false);
  }, [index]);

  function loadMore() {
    setIndex((prev) => prev + 3);
    pageNumber.current++;
    setPaginationData((prev) => {
      let array = [...prev];
      let newData = paginate(geoData.features, 3, pageNumber.current);
      return [...array, ...newData];
    });
  }

  return (
    <aside className={classes.sidebar}>
      <div className={classes.data_wrapper}>
        {paginationData.map((item, index) => {
          return <DataItem key={index} item={item} />;
        })}
        {showLoadMore && (
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
