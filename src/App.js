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
    NAME: "A",
    TIMEZONE: "Europe",
    LONGITUDE: {
      min: 20,
      max: 30,
    },
    LATITUDE: {
      min: 1,
      max: null,
    },
  };

  const { loadMore, loadMoreVisible, paginationData } = usePagination(
    filterDataFunction(data.features, filterParameters)
  );

  function filterDataFunction(data, query) {
    const keysWithMinMax = ["LONGITUDE", "LATITUDE"];
    const filteredData = data.filter((item) => {
      for (let key in query) {
        if (item.properties[key] === undefined) {
          return false;
        } else if (keysWithMinMax.includes(key)) {
          if (
            query[key]["min"] !== null &&
            item.properties[key] < query[key]["min"]
          ) {
            return false;
          }
          if (
            query[key]["max"] !== null &&
            item.properties[key] > query[key]["max"]
          ) {
            return false;
          }
        } else if (!item.properties[key].includes(query[key])) {
          return false;
        }
      }
      return true;
    });
    return filteredData;
  }

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
