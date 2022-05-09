import classes from "./styles/App.module.css";
import data from "./utils/map2.json";
import Map from "./components/Map";
import Sidebar from "./components/Sidebar";
import usePagination from "./hooks/usePagination";
import FormikForm from "./components/FormikForm";
import Form from "./components/Form";
import ReactHookForm from "./components/ReactHookForm";
import formSchema from "./utils/filterFormSchema.json";
import { useEffect, useRef, useState } from "react";
import useFilter from "./hooks/useFilter";
import DataItem from "./components/DataItem";
import useSorting from "./hooks/useSorting";

function App() {
  const filterParameters = {
    NAME: {
      filterType: "text",
      value: "",
      searchType: "endsWith",
    },
    LONGITUDE: {
      filterType: "minmax",
      min: 0,
      max: 100,
    },
    Point: {
      filterType: "boolean",
      value: true,
    },
  };

  const { filteredData, initiateFilter } = useFilter(
    data.features,
    filterParameters
  );

  const { loadMore, loadMoreVisible, paginationData } =
    usePagination(filteredData);

  const { sortedData, sort } = useSorting(paginationData, {
    field: "properties.NAME",
    direction: "asc",
  });

  const [selectedItem, setSelectedItem] = useState(null);

  function selectItem(item) {
    setSelectedItem(item);
  }

  useEffect(() => {
    if (!selectedItem) {
      return;
    }
    setSelectedItem(null);
  }, [paginationData]);

  return (
    <main className={classes.app}>
      {/* <FormikForm />
      <Form /> */}
      <ReactHookForm jsonSchema={formSchema} onFormSubmit={initiateFilter} />

      <Map paginationData={sortedData} selectedItem={selectedItem} />
      <Sidebar
        paginationData={sortedData}
        loadMoreVisible={loadMoreVisible}
        loadMore={loadMore}
        selectItem={selectItem}
        selectedItem={selectedItem}
        render={(item, index, selectItem, selectedItem) => (
          <DataItem
            item={item}
            key={index}
            selectItem={selectItem}
            selectedItem={selectedItem}
          />
        )}
      />
    </main>
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

export default App;
