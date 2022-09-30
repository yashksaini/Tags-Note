import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import {
  doc,
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import styles from "./profile.module.scss";

const Eachnote = () => {
  const [noteTags, setNoteTags] = useState([]);
  const [labelTags, setLabelTags] = useState([]);
  const [labelCount, setLabelCount] = useState(0);
  const { id } = useParams();
  const userId = useContext(UserContext);
  // For Updating Note
  const [noteTitle, setNoteTitle] = useState("");
  const [noteDesc, setNoteDesc] = useState("");
  const [noteLink, setNoteLink] = useState("");
  const [message, setMessage] = useState("");
  const [valid, setValid] = useState(false);

  // Use to refresh comoponent when necessary
  const [stateChange, setStateChange] = useState(true);

  // For Models
  const [showModel, setShowModel] = useState(false);
  const [showModel1, setShowModel1] = useState(false);

  const [noteData, setNoteData] = useState({
    title: "",
    desc: "",
    link: "",
    noteId: "",
    userId: "",
    labelOn: "",
    imageUrl: "",
    labelId: "",
    tags: [],
    pinned: false,
  });
  let note = {};
  let label = {};
  // For Getting note Data
  async function getNoteData() {
    const firestore = getFirestore();
    let labelId = "";
    const q = query(
      collection(firestore, "notes"),
      where("userId", "==", userId),
      where("noteId", "==", id)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      note = doc.data();
      let date = note.labelOn.toDate().toDateString();
      let data = {
        title: note.title,
        desc: note.desc,
        link: note.link,
        noteId: note.noteId,
        userId: note.userId,
        labelOn: date,
        imageUrl: note.imageUrl,
        labelId: note.labelId,
        tags: note.tags,
        pinned: note.pinned,
      };
      setNoteData(data);
      setNoteTitle(data.title);
      setNoteTags(data.tags);
      setNoteDesc(data.desc);
      setNoteLink(data.link);
      labelId = data.labelId;
    });
    const q2 = query(
      collection(firestore, "labels"),
      where("userId", "==", userId),
      where("labelId", "==", labelId)
    );
    const querySnapshot1 = await getDocs(q2);
    querySnapshot1.forEach((doc) => {
      label = doc.data();
      setLabelTags(label.tags);
      setLabelCount(label.notesCount);
    });
  }
  async function updateNote() {
    const firestore = getFirestore();
    const labelRef = doc(firestore, "notes", id);
    await updateDoc(labelRef, {
      title: noteTitle,
      tags: noteTags,
      desc: noteDesc.replace(/\n/g, "<br/>"),
      link: noteLink,
    });
    setMessage("Updated successfully");
    getNoteData();
    setTimeout(() => {
      setMessage("");
      setShowModel(false);
    }, 1500);
  }
  async function removeNote() {
    const firestore = getFirestore();
    const noteRef = doc(firestore, "notes", id);
    await deleteDoc(noteRef);
    updateNotesCount();
    setShowModel1(false);
    let data = {
      title: "",
      desc: "",
      link: "",
      noteId: "",
      userId: "",
      labelOn: "",
      imageUrl: "",
      labelId: "",
      tags: [],
      pinned: false,
    };
    setNoteData(data);
    getNoteData();
  }
  async function updateNotesCount() {
    const firestore = getFirestore();
    const labelRef = doc(firestore, "labels", noteData.labelId);
    let count = labelCount - parseInt(1);
    await updateDoc(labelRef, {
      notesCount: count,
    });
  }
  const addTag = (tag) => {
    let arr = noteTags;
    arr.push(tag);
    setNoteTags(arr);
    let change = !stateChange;
    setStateChange(change);
  };
  const removeTag = (tag) => {
    let arr = noteTags;
    arr.splice(arr.indexOf(tag), 1);
    setNoteTags(arr);
    let change = !stateChange;
    setStateChange(change);
  };

  useEffect(() => {
    if (noteTitle.length > 4 && noteDesc.length > 4) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [noteTitle, noteDesc, noteLink]);
  useEffect(() => {
    getNoteData();
  }, [id]);
  return (
    <>
      <div
        className={
          noteData.title.length > 0 ? `${styles.profileBox}` : `${styles.hide}`
        }
      >
        <div className={styles.profileTop}>
          <div className={styles.imgBox}>
            <img src="../images/note.png" alt="" />
          </div>
          <div className={styles.contentBox}>
            <h1>{noteData.title}</h1>
            <h2>{noteData.labelOn}</h2>
            <div className={styles.showTags}>
              {noteData.tags.map((tag) => {
                return (
                  <span>
                    <b>#</b> {tag}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
        <div className={styles.hr}></div>
        <div
          className={
            noteData.link.length > 0 ? `${styles.showTags}` : `${styles.hide}`
          }
        >
          <p>
            Note Link:{" "}
            <a href={noteData.link} target="_blank">
              <i className="fas fa-link"></i> Link
            </a>
          </p>
        </div>
        <div className={styles.hr}></div>
        <div className={styles.showTags}>
          <p dangerouslySetInnerHTML={{ __html: noteData.desc }}></p>
        </div>
        <div className={styles.hr}></div>
        <div className={styles.editBox}>
          <button
            className={styles.btn2}
            onClick={() => {
              setShowModel1(true);
            }}
          >
            Remove
          </button>
          <button
            className={styles.btn2}
            onClick={() => {
              setShowModel(true);
            }}
          >
            Edit Note
          </button>
        </div>
        {/* Modal for adding note */}
        <div className={showModel ? `${styles.modal}` : `${styles.hide}`}>
          <div className={styles.addLabel}>
            <p>
              <i
                className="fas fa-times"
                onClick={() => {
                  setShowModel(false);
                }}
              ></i>
            </p>
            <h2>Update Note</h2>
            <div className={styles.inputBox}>
              <span>Note Title *</span>
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => {
                  setNoteTitle(e.target.value);
                }}
              ></input>
            </div>
            <div className={styles.inputBox2}>
              <p>Added Tags</p>
              <div className={styles.tagsDiv}>
                {noteTags.map((tag, index) => {
                  return (
                    <span
                      className={styles.selectedTag}
                      key={index}
                      onClick={() => {
                        removeTag(tag);
                      }}
                    >
                      <b>#</b> {tag} &nbsp;
                    </span>
                  );
                })}
                {labelTags.map((tag, index) => {
                  if (noteTags.indexOf(tag) === -1) {
                    return (
                      <span
                        key={index}
                        onClick={() => {
                          addTag(tag);
                        }}
                      >
                        {tag} &nbsp;
                      </span>
                    );
                  } else {
                    return null;
                  }
                })}
              </div>
            </div>

            <div className={styles.inputBox1}>
              <span>Description *</span>
              <textarea
                value={noteDesc.replace(/<br\/>/g, "\n")}
                onChange={(e) => {
                  setNoteDesc(e.target.value);
                }}
              ></textarea>
            </div>
            <div className={styles.inputBox}>
              <span>Any Link</span>
              <input
                type="url"
                value={noteLink}
                onChange={(e) => {
                  setNoteLink(e.target.value);
                }}
              ></input>
            </div>
            <button
              className={styles.btn}
              disabled={!valid}
              onClick={updateNote}
            >
              Update{" "}
            </button>
            <h5 className={message.length > 0 ? null : `${styles.hide}`}>
              {message}
            </h5>
          </div>
        </div>
        {/* Modal for removing note */}
        <div className={showModel1 ? `${styles.modal}` : `${styles.hide}`}>
          <div className={styles.addLabel}>
            <p>
              <i
                className="fas fa-times"
                onClick={() => {
                  setShowModel1(false);
                }}
              ></i>
            </p>
            <h2>Remove Note</h2>
            <h4>
              Do you really want to remove note.? This action cannot be
              reverted.
            </h4>
            <div className={styles.editBox}>
              <button
                className={styles.btn3}
                onClick={() => {
                  setShowModel1(false);
                }}
              >
                No
              </button>
              <button className={styles.btn3} onClick={removeNote}>
                Yes{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={
          noteData.title.length === 0
            ? `${styles.profileBox}`
            : `${styles.hide}`
        }
      >
        <div className={styles.contentBox}>
          <h1>404 Error</h1>
          <h2>Page not found.</h2>
          <Link to="/labels">
            <button className={styles.btn1}>Back</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Eachnote;
