import { useEffect, useRef, useState } from "react";

export default function usePagination(data, filterParameters) {
  const [geoData, setGeoData] = useState(() => {
    return filterData(data.features, filterParameters);
  });
  const [paginationData, setPaginationData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [loadMoreVisible, setLoadMoreVisible] = useState(true);
  const page_size = 3;

  useEffect(() => {
    setPaginationData((prev) => {
      let array = [...prev];
      let newData = paginate(geoData, 3, pageNumber);
      return [...array, ...newData];
    });
    setLoadMoreVisible(geoData.length - pageNumber * page_size > 0);
  }, [pageNumber]);

  function paginate(array, page_size, page_number) {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  }

  function filterData(data, parameters) {
    let array = [...data];
    for (const key in parameters) {
      const value = parameters[key];
      array = array.filter((item) => {
        if (!item.properties[key]) {
          return;
        }
        return item.properties[key].includes(value);
      });
    }
    return array;
  }

  function loadMore() {
    setPageNumber((prev) => ++prev);
  }
  return { paginationData, loadMoreVisible, loadMore };
}
