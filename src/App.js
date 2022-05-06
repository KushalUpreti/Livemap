import classes from "./styles/App.module.css";
import data from "./utils/map2.json";
import Map from "./components/Map";
import Sidebar from "./components/Sidebar";
import usePagination from "./hooks/usePagination";
import FormikForm from "./components/FormikForm";
import Form from "./components/Form";
import ReactHookForm from "./components/ReactHookForm";
import formSchema from "./utils/formSchema.json";

function App() {
  const filterParameters = {
    NAME: "S",
    TIMEZONE: "Europe",
  };

  const { loadMore, loadMoreVisible, paginationData } = usePagination(
    data,
    filterParameters
  );

  return (
    <main className={classes.app}>
      {/* <FormikForm />
      <Form /> */}
      {/* <ReactHookForm jsonSchema={formSchema} /> */}

      <Map paginationData={paginationData} />
      <Sidebar
        paginationData={paginationData}
        loadMoreVisible={loadMoreVisible}
        loadMore={loadMore}
        render={(item) => <CustomDataItem item={item} />}
        CustomDataItem={CustomDataItem}
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
