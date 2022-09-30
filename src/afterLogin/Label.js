import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import {
  doc,
  setDoc,
  getFirestore,
  serverTimestamp,
  collection,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import styles from "./profile.module.scss";
import Note from "./parts/Note";
const Label = () => {
  const { id } = useParams();

  const [labelData, setLabelData] = useState({
    name: "",
    notesCount: 0,
    time: "",
    tags: [],
  });
  const [showModel, setShowModel] = useState(false);
  const [showModel1, setShowModel1] = useState(false);
  // Use to refresh comoponent when necessary
  const [stateChange, setStateChange] = useState(true);
  // For Adding Note
  const [noteTitle, setNoteTitle] = useState("");
  const [noteDesc, setNoteDesc] = useState("");
  const [noteLink, setNoteLink] = useState("");
  const [noteTags, setNoteTags] = useState([]);

  //For showing tagged notes
  const [selectedTags, setSelectedTags] = useState([]);
  const [displayNotes, setDisplayNotes] = useState([]);

  // For storing original notes
  const [originalNotes, setOriginalNotes] = useState([]);

  const [message, setMessage] = useState("");
  const [message1, setMessage1] = useState("");
  const [valid, setValid] = useState(false);
  const [tags, setTags] = useState("");
  const userId = useContext(UserContext);
  let label = {};
  let note = {};
  async function getLabelData() {
    const firestore = getFirestore();
    const q = query(
      collection(firestore, "labels"),
      where("userId", "==", userId),
      where("labelId", "==", id)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      label = doc.data();
      let data = {
        name: label.labelName,
        notesCount: label.notesCount,
        time: label.labelOn,
        tags: label.tags,
      };
      setLabelData(data);
      setTags(data.tags.join());
    });
  }
  async function getNotesData() {
    const firestore = getFirestore();
    const q = query(
      collection(firestore, "notes"),
      where("userId", "==", userId),
      where("labelId", "==", id),
      orderBy("labelOn", "desc")
    );
    const querySnapshot = await getDocs(q);
    let arr = [];
    querySnapshot.forEach((doc) => {
      note = doc.data();
      let data = {
        title: note.title,
        desc: note.desc,
        link: note.link,
        noteId: note.noteId,
        userId: note.userId,
        labelOn: note.labelOn,
        imageUrl: note.imageUrl,
        labelId: note.labelId,
        tags: note.tags,
        pinned: note.pinned,
      };
      arr.push(data);
    });
    setOriginalNotes(arr);
    setDisplayNotes(arr);
  }
  async function bookmarkNote(id, value) {
    const firestore = getFirestore();
    const labelRef = doc(firestore, "notes", id);
    await updateDoc(labelRef, {
      pinned: !value,
    });
    await getNotesData();
  }
  async function updateTags() {
    setMessage1("Updating..");
    const allTags = tags.split(",");
    const firestore = getFirestore();
    const labelRef = doc(firestore, "labels", id);
    await updateDoc(labelRef, {
      tags: allTags,
    });
    await getLabelData();
    setMessage1("Updated Successfully");
    setTimeout(() => {
      setMessage1("");
      setShowModel1(false);
    });
  }
  async function updateNotesCount() {
    const firestore = getFirestore();
    const labelRef = doc(firestore, "labels", id);
    let count = labelData.notesCount + parseInt(1);
    await updateDoc(labelRef, {
      notesCount: count,
    });
  }

  const addNote = () => {
    setMessage("");
    const firestore = getFirestore();
    let noteId = Math.random().toString(36).substring(2, 16);
    setDoc(doc(firestore, "notes", noteId), {
      labelId: id,
      userId: userId,
      title: noteTitle,
      desc: noteDesc.replace(/\n/g, "<br/>"),
      link: noteLink,
      tags: noteTags,
      noteId: noteId,
      pinned: false,
      labelOn: serverTimestamp(),
      imageUrl: "",
    }).then(() => {
      setMessage("Note added successfully.");
      updateNotesCount();
      getNotesData();
      getLabelData();
      setTimeout(() => {
        setMessage("");
        setShowModel(false);
      }, 1500);
      setNoteTitle("");
      setNoteDesc("");
      setNoteLink("");
      setNoteTags([]);
      setValid(false);
    });
  };
  useEffect(() => {
    if (noteTitle.length > 4 && noteDesc.length > 4) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [noteTitle, noteDesc, noteLink, noteTags]);

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
  const activeTag = (value) => {
    let arr = selectedTags;
    let index = arr.indexOf(value);
    if (index === -1) {
      arr.push(value);
    } else {
      arr.splice(index, 1);
    }
    setSelectedTags(arr);
    updateDisplay();
  };
  const multipleExist = (values, arr) => {
    return values.every((value) => {
      return arr.indexOf(value) !== -1;
    });
  };
  const updateDisplay = () => {
    let arr = [];
    for (let i = 0; i < originalNotes.length; i++) {
      const tagIn = multipleExist(selectedTags, originalNotes[i].tags);
      if (tagIn) {
        arr.push({
          labelId: originalNotes[i].labelId,
          userId: originalNotes[i].userId,
          title: originalNotes[i].title,
          desc: originalNotes[i].desc,
          link: originalNotes[i].link,
          tags: originalNotes[i].tags,
          noteId: originalNotes[i].noteId,
          pinned: originalNotes[i].pinned,
          labelOn: originalNotes[i].labelOn,
          imageUrl: originalNotes[i].imageUrl,
        });
      }
    }
    setDisplayNotes(arr);
  };
  useEffect(() => {
    getLabelData();
  }, [id]);
  useEffect(() => {
    getNotesData();
  }, [id]);
  return (
    <>
      <div
        className={
          labelData.name.length === 0
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
      <div
        className={
          labelData.name.length > 0 ? `${styles.profileBox}` : `${styles.hide}`
        }
      >
        <div className={styles.profileTop}>
          <div className={styles.imgBox}>
            <img src="../images/tag.png" alt="" />
          </div>
          <div className={styles.contentBox}>
            <h1>{labelData.name}</h1>
            <h2>
              <b>{labelData.notesCount}</b> note in total
            </h2>
            <h2>{labelData.tags.length} tags</h2>
            <button
              className={styles.btn1}
              onClick={() => {
                setShowModel(true);
              }}
            >
              Add Note
            </button>
            <button
              className={styles.btn1}
              onClick={() => {
                setShowModel1(true);
              }}
            >
              Add Tags
            </button>
          </div>
        </div>
        <div className={styles.hr}></div>
        <div className={styles.showTags}>
          {labelData.tags.map((tag) => {
            if (selectedTags.indexOf(tag) !== -1) {
              return (
                <span
                  className={styles.activeTag}
                  key={tag}
                  onClick={() => {
                    activeTag(tag);
                  }}
                >
                  <b>#</b> {tag}
                </span>
              );
            } else {
              return null;
            }
          })}
          {labelData.tags.map((tag) => {
            if (selectedTags.indexOf(tag) === -1) {
              return (
                <span
                  key={tag}
                  onClick={() => {
                    activeTag(tag);
                  }}
                >
                  <b>#</b> {tag}
                </span>
              );
            } else {
              return null;
            }
          })}
        </div>
        <div className={styles.hr}></div>
        <div className={styles.allNotes}>
          {displayNotes.map((note, index) => {
            if (note.pinned) {
              return (
                <Note data={note} bookmarkNote={bookmarkNote} key={index} />
              );
            } else {
              return null;
            }
          })}
          {displayNotes.map((note, index) => {
            if (!note.pinned) {
              return (
                <Note data={note} bookmarkNote={bookmarkNote} key={index} />
              );
            } else {
              return null;
            }
          })}
        </div>
        <div className={styles.hr}></div>

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
            <h2>Add Note</h2>
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
                {labelData.tags.map((tag, index) => {
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
                value={noteDesc}
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
            <button className={styles.btn} disabled={!valid} onClick={addNote}>
              Add{" "}
            </button>
            <h5 className={message.length > 0 ? null : `${styles.hide}`}>
              {message}
            </h5>
          </div>
        </div>
        {/* Model for Updating Tags */}
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
            <h2>Add Tags</h2>
            <small>
              Add each tag with comma separated <br /> (eg. tag1,tag2 )
            </small>
            <div className={styles.inputBox1}>
              <span>All Tags</span>
              <textarea
                value={tags}
                onChange={(e) => {
                  setTags(e.target.value);
                }}
              ></textarea>
            </div>
            <button className={styles.btn} onClick={updateTags}>
              Update Tags
            </button>
            <h5 className={message1.length > 0 ? null : `${styles.hide}`}>
              {message1}
            </h5>
          </div>
        </div>
      </div>
    </>
  );
};

export default Label;
