import classes from "../styles/Sidebar.module.css";

export default function Sidebar({ geoData }) {
  return (
    <aside className={classes.sidebar}>
      <div className={classes.data_wrapper}>
        {geoData.features.map((item, index) => {
          return <DataItem key={index} item={item} />;
        })}
      </div>
    </aside>
  );
}

function DataItem({ item }) {
  return (
    <div className={classes.data_item}>
      <p>Type: {item.type}</p>
      <p>Geometry type: {item.geometry.type}</p>
    </div>
  );
}
