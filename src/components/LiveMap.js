import { useEffect, useRef, useState } from "react";
import Map from "./Map";
import Sidebar from "./Sidebar";

export default function LiveMap({ data }) {
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
    <>
      <Map paginationData={paginationData} />
      <Sidebar
        paginationData={paginationData}
        loadMoreVisible={loadMoreVisible}
        loadMore={loadMore}
        CustomDataItem={CustomDataItem}
      />
    </>
  );
}

function CustomDataItem({ item }) {
  return (
    <div style={{ border: "1px solid red" }}>
      <p>Country: {item.properties.NAME}</p>
      <p>Timezone: {item.properties.TIMEZONE}</p>
    </div>
  );
}
