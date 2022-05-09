import { useEffect, useRef, useState } from "react";

export default function usePagination(data) {
  // const [geoData, setGeoData] = useState(data);
  const [paginationData, setPaginationData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [loadMoreVisible, setLoadMoreVisible] = useState(true);
  const resetRef = useRef(true);
  const page_size = 3;

  useEffect(() => {
    resetRef.current = true;
    setPageNumber(1);
  }, [data]);

  useEffect(() => {
    setPaginationData((prev) => {
      let array = [];
      if (!resetRef.current) {
        array = [...prev];
      }
      let newData = paginate(data, 3, pageNumber);
      return [...array, ...newData];
    });
    setLoadMoreVisible(data.length - pageNumber * page_size > 0);
  }, [pageNumber, data]);

  function paginate(array, page_size, page_number) {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  }

  function loadMore() {
    resetRef.current = false;
    setPageNumber((prev) => ++prev);
  }
  return { paginationData, loadMoreVisible, loadMore };
}
