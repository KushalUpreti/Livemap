import classes from "../styles/Map.module.css";
import DataItem from "./DataItem";

export default function Map({ geoData, paginationData }) {
  return (
    <section className={classes.map_section}>
      <div className={classes.map_wrapper}>
        {paginationData.map((item, index) => {
          return <DataItem key={index} item={item} />;
        })}
      </div>
    </section>
  );
}
