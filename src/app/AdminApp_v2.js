import "../styles/AdminApp.css";
import ListEditor from "../components/ListEditor";
import { useState } from "react";

export default function App() {
  const [countries, setCountries] = useState([]);

  const objectSchema = {
    name: "N/A",
    population: 0,
    language: "",
    cities: [],
  };

  const listPropSchema = {
    cities: {
      name: "N/A",
      population: 0,
      language: "",
    },
  };

  return (
    <main className="main">
      <ListEditor
        data={countries}
        objectSchema={objectSchema}
        listPropSchema={listPropSchema}
        setObjects={setCountries}
        title="Country"
      />
    </main>
  );
}
