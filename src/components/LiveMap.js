import usePagination from "../hooks/usePagination";
import Map from "./Map";
import Sidebar from "./Sidebar";

export default function LiveMap({ data }) {
  const { loadMore, loadMoreVisible, paginationData } = usePagination(data);

  return (
    <>
      <Map paginationData={paginationData} />
      <Sidebar
        paginationData={paginationData}
        loadMoreVisible={loadMoreVisible}
        loadMore={loadMore}
        render={(item) => <CustomDataItem item={item} />}
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
