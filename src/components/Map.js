import classes from "../styles/Map.module.css";

export default function Map({ geoData }) {
  return (
    <section className={classes.map_section}>
      <div className={classes.map_wrapper}>
        <p>Total data: {geoData.features.length}</p>
      </div>
    </section>
  );
}
