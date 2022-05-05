import data from "./utils/map2.json";
import classes from "./styles/App.module.css";
import Map from "./components/Map";
import Sidebar from "./components/Sidebar";
import { useState } from "react";

function App() {
  const [geoData, setGeoData] = useState(data);

  return (
    <main className={classes.app}>
      <Map geoData={geoData} />
      <Sidebar geoData={geoData} page_size={3} />
    </main>
  );
}

export default App;
