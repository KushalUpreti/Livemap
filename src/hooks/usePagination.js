import { useEffect, useRef, useState } from "react";

export default function usePagination(data) {
  const [geoData, setGeoData] = useState(data);
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

  useEffect(() => {
    setPaginationData(data);
    setPageNumber(1);
  }, [data]);

  function paginate(array, page_size, page_number) {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  }

  function loadMore() {
    setPageNumber((prev) => ++prev);
  }
  return { paginationData, loadMoreVisible, loadMore };
}
