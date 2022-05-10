import { useEffect, useRef, useState } from "react";
import { traverseObject, groupBy } from "../utils/utilityFunctions";
import classes from "../styles/Barchar.module.css";
import randomColor from "randomcolor";

export default function BarChart({ data }) {
  const countriesRef = useRef(groupBy("properties.ISO_A2", data));
  const [selectedOption, setSelectedOption] = useState(
    Object.keys(countriesRef.current)[0]
  );
  const [barData, setBarData] = useState({ upperLimit: 100 });

  useEffect(() => {
    let maxPopn = findMaxPopulation(selectedOption);
    let upperPopulation = roundToNearest100(maxPopn);
    setBarData((prev) => {
      return { ...prev, upperLimit: upperPopulation };
    });
  }, [selectedOption]);

  function findMaxPopulation(key) {
    let max = 0;
    countriesRef.current[key].forEach((item) => {
      let population = traverseObject("properties.POP_MAX", item);
      if (population > max) {
        max = population;
      }
    });
    return max;
  }

  function roundToNearest100(num) {
    return Math.ceil(num / 100) * 100;
  }

  return (
    <>
      <form action="" style={{ marginTop: "30px" }}>
        <h3>Choose a country</h3>
        <select
          name="country_code"
          value={selectedOption}
          onChange={(e) => {
            setSelectedOption(e.target.value);
          }}
        >
          {Object.keys(countriesRef.current).map((item) => {
            return (
              <option key={item} value={item}>
                {item}
              </option>
            );
          })}
        </select>
      </form>

      <div className={classes.bar_wrapper}>
        <h1>Bar Chart</h1>
        <div className={classes.bar_container}>
          <div className={classes.population}>
            <p>{barData.upperLimit}</p>
            <p>{0}</p>
          </div>
          <div className={classes.bar_line_wrapper}>
            {countriesRef.current[selectedOption].map((item) => {
              let currentPopn = traverseObject("properties.POP_MAX", item);
              return (
                <div className={classes.bar_line_container}>
                  <p>{currentPopn}</p>
                  <div
                    style={{
                      height: `${(currentPopn / barData.upperLimit) * 100}%`,
                      backgroundColor: randomColor(),
                    }}
                  >
                    <p className={classes.city_name}>
                      {traverseObject("properties.NAME", item)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
