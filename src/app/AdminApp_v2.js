import "../styles/AdminApp.css";
import ListEditor from "../components/ListEditor";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function App() {
  const [countries, setCountries] = useState([]);

  const countrySchema = {
    name: "N/A",
    population: 0,
    language: "",
    cities: [{ name: "N/A", population: 0, language: "" }],
  };

  function createObject() {
    const id = uuidv4();
    const newCountry = { ...countrySchema, id };
    setCountries((prev) => {
      const object = [...prev];
      object.push(newCountry);
      return object;
    });
  }

  return (
    <main className="main">
      <ListEditor
        data={countries}
        createObject={createObject}
        setObjects={setCountries}
        title="Country"
      />
    </main>
  );
}
