import classes from "./styles/App.module.css";
import data from "./utils/map2.json";
import Map from "./components/Map";
import Sidebar from "./components/Sidebar";
import usePagination from "./hooks/usePagination";
import FormikForm from "./components/FormikForm";
import Form from "./components/Form";
import ReactHookForm from "./components/ReactHookForm";
import formSchema from "./utils/filterFormSchema.json";
import { useRef } from "react";
import useFilter from "./hooks/useFilter";

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

  return (
    <main className={classes.app}>
      {/* <FormikForm />
      <Form /> */}
      <ReactHookForm jsonSchema={formSchema} onFormSubmit={initiateFilter} />
      {/* <Sidebar
        paginationData={paginationData}
        loadMoreVisible={loadMoreVisible}
        loadMore={loadMore}
        render={(item) => <CustomDataItem item={item} />}
        CustomDataItem={CustomDataItem}
      /> */}

      <Map paginationData={paginationData} />
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
