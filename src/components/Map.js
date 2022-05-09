import classes from "../styles/Map.module.css";
import DataItem from "./DataItem";

export default function Map({ paginationData, selectedItem }) {
  return (
    <section className={classes.map_section}>
      <div className={classes.map_wrapper}>
        {/* {paginationData.map((item, index) => {
          return <DataItem key={index} item={item} />;
        })} */}
        {selectedItem ? (
          <DataItem
            item={selectedItem}
            selectItem={() => {}}
            selectedItem={selectedItem}
          />
        ) : (
          <p>No item selected</p>
        )}
      </div>
    </section>
  );
}
