import React from "react";
import { Link } from "react-router-dom";
import styles from "../parts/labelbox.module.scss";
const LabelBox = (props) => {
  let { data, getLabelId, getRemoveId } = props;
  return (
    <div className={styles.labelBox}>
      <span
        className={styles.editBtn}
        onClick={() => {
          getLabelId(data.labelId, data.name);
        }}
      >
        <i className="fas fa-ellipsis-v"></i>
      </span>
      <h1>{data.name}</h1>
      <h2>{data.notesCount} notes</h2>
      <div className={styles.bottomBox}>
        <span
          onClick={() => {
            getRemoveId(data.labelId, data.name);
          }}
        >
          <i className="fas fa-trash"></i>
        </span>
        <Link to={`label/${data.labelId}`}>View notes</Link>
      </div>
    </div>
  );
};

export default LabelBox;
