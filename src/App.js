import { useRef, useState } from "react";
import Map from "./components/Map";
import Sidebar from "./components/Sidebar";
import classes from "./styles/App.module.css";
import data from "./utils/map2.json";

function App() {
  const [geoData, setGeoData] = useState(data);
  const [paginationData, setPaginationData] = useState([]);

  return (
    <main className={classes.app}>
      <Map geoData={geoData} paginationData={paginationData} />
      <Sidebar
        geoData={geoData}
        page_size={3}
        paginationData={paginationData}
        setPaginationData={setPaginationData}
      />
    </main>
  );
}

export default App;
