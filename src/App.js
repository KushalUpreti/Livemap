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
    NAME: {
      filterType: "text",
      value: "a",
      searchType: "endsWith",
    },
    LONGITUDE: {
      filterType: "minmax",
      min: 20,
      max: 50,
    },
    Point: {
      filterType: "boolean",
      value: true,
    },
  };

  const { loadMore, loadMoreVisible, paginationData } = usePagination(
    filterDataFunction(data.features, filterParameters)
  );

  function filterDataFunction(data, query) {
    const filteredData = data.filter((item) => {
      let result = true;
      for (let key in query) {
        const object = query[key];
        switch (object.filterType) {
          case "text":
            let text = item.properties[key];
            result = result && text[object.searchType](object.value);
            break;

          case "boolean":
            let geoType = item.geometry.type;
            result = result && object.value ? geoType === key : geoType !== key;
            break;

          case "minmax":
            if (object["min"] !== null) {
              result = result && item.properties[key] > object["min"];
            }
            if (object["max"] !== null) {
              result = result && item.properties[key] < object["max"];
            }
            break;

          default:
            break;
        }
      }
      return result;
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
