import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../parts/note.module.scss";
const Note = (props) => {
  let { data, bookmarkNote } = props;
  const [book, setBook] = useState("far fa-bookmark");
  const [tagData, setTagData] = useState();
  useEffect(() => {
    let arr = [];
    for (let i = 0; i < data.tags.length; i++) {
      arr.push(
        <span key={i}>
          <b>#</b>
          {data.tags[i]}
        </span>
      );
    }
    setTagData(arr);
    if (data.pinned) {
      setBook("fas fa-bookmark");
    }
  }, [data]);
  return (
    <div className={styles.noteBox}>
      <div className={styles.topBox}>
        <h1>{data.title.substring(0, 22)} ...</h1>
        <span
          onClick={() => {
            bookmarkNote(data.noteId, data.pinned);
          }}
        >
          <i className={book}></i>
        </span>
      </div>
      <h2>{data.desc.replace(/<br\/>/g, "\n").substring(0, 120)} ...</h2>
      <div className={styles.tags}>{tagData}</div>
      <Link to={`../note/${data.noteId}`}>Full note</Link>
    </div>
  );
};

export default Note;
