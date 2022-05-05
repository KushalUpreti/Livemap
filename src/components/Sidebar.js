import { useEffect, useRef, useState } from "react";
import classes from "../styles/Sidebar.module.css";
import DataItem from "../components/DataItem";

export default function Sidebar({
  paginationData,
  loadMore,
  loadMoreVisible,
  render,
}) {
  return (
    <aside className={classes.sidebar}>
      <div className={classes.data_wrapper}>
        {paginationData.map((item, index) => {
          return render(item);
        })}
        {loadMoreVisible && (
          <button className={classes.pagination_button} onClick={loadMore}>
            Load More
          </button>
        )}
      </div>
    </aside>
  );
}
