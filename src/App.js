import { useEffect, useRef, useState } from "react";
import Map from "./components/Map";
import Sidebar from "./components/Sidebar";
import classes from "./styles/App.module.css";
import data from "./utils/map2.json";

function App() {
  const [geoData, setGeoData] = useState(data);
  const [paginationData, setPaginationData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [loadMoreVisible, setLoadMoreVisible] = useState(true);
  const page_size = 3;

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
    <main className={classes.app}>
      <Map paginationData={paginationData} />
      <Sidebar
        paginationData={paginationData}
        loadMoreVisible={loadMoreVisible}
        loadMore={loadMore}
      />
    </main>
  );
}

export default App;
