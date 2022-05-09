import classes from "../styles/Sidebar.module.css";

export default function DataItem({ item, selectItem, selectedItem }) {
  return (
    <div
      className={`${classes.data_item} ${
        selectedItem !== null &&
        selectedItem.properties.NAME === item.properties.NAME
          ? classes.data_item_selected
          : ""
      }`}
      onClick={() => {
        selectItem(item);
      }}
    >
      <p>Country: {item.properties.NAME}</p>
      <p>Timezone: {item.properties.TIMEZONE}</p>
      <p>Longitude: {item.geometry.coordinates[0]}</p>
      <p>Latitude: {item.geometry.coordinates[1]}</p>
    </div>
  );
}
