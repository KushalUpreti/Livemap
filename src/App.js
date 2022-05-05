import classes from "./styles/App.module.css";
import data from "./utils/map2.json";
import LiveMap from "./components/LiveMap";

function App() {
  return (
    <main className={classes.app}>
      <LiveMap data={data} />
    </main>
  );
}

export default App;
