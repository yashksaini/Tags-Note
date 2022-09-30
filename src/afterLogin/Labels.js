import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import { getAuth } from "firebase/auth";
import {
  doc,
  setDoc,
  getFirestore,
  serverTimestamp,
  collection,
  get,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import styles from "./profile.module.scss";
import LabelBox from "./parts/LabelBox";
const Labels = () => {
  const [showModel, setShowModel] = useState(false);
  const [showModel1, setShowModel1] = useState(false);
  const [showModel2, setShowModel2] = useState(false);
  const [labelName, setLabelName] = useState("");
  const [message, setMessage] = useState("");
  const [valid, setValid] = useState(false);
  const [valid1, setValid1] = useState(false);
  const [labelData, setLabelData] = useState([]);
  const [updateLabelName, setUpdateLabelName] = useState("");
  const [currentLabelId, setCurrentLabelId] = useState("");
  const userId = useContext(UserContext);
  const [remId, setRemId] = useState("");
  const [remName, setRemName] = useState("");
  let labels = {};

  const addLabel = () => {
    const firestore = getFirestore();
    let label_id = Math.random().toString(36).substring(2, 12);
    setDoc(doc(firestore, "labels", label_id), {
      labelName: labelName,
      labelId: label_id,
      userId: userId,
      tags: [],
      labelOn: serverTimestamp(),
      notesCount: 0,
    }).then(() => {
      setMessage("Label added.");
      setLabelName("");
      setMessage("");
      setValid(false);
      setTimeout(() => {
        setMessage("");
        setShowModel(false);
      });
      getLabelData();
    });
  };
  useEffect(() => {
    if (labelName.length > 3) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [labelName]);
  useEffect(() => {
    if (updateLabelName.length > 3) {
      setValid1(true);
    } else {
      setValid1(false);
    }
  }, [updateLabelName]);
  const getLabelId = (value, name) => {
    setCurrentLabelId(value);
    setUpdateLabelName(name);
    setShowModel1(true);
  };
  const getRemoveId = (value, name) => {
    setRemId(value);
    setRemName(name);
    setShowModel2(true);
  };
  async function updateLabel() {
    const firestore = getFirestore();
    const labelRef = doc(firestore, "labels", currentLabelId);
    await updateDoc(labelRef, {
      labelName: updateLabelName,
    });
    setMessage("Updated successfully");
    setTimeout(() => {
      setMessage("");
      setShowModel1(false);
    }, 1500);
    getLabelData();
  }
  async function removeLabel() {
    const firestore = getFirestore();
    let note = {};
    const labelRef = doc(firestore, "labels", remId);
    await deleteDoc(labelRef);
    let q = query(
      collection(firestore, "notes"),
      where("labelId", "==", remId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc1) => {
      note = doc1.data();
      const noteRef = doc(firestore, "notes", note.noteId);
      deleteDoc(noteRef);
    });
    getLabelData();
    setShowModel2(false);
  }
  async function getLabelData() {
    const firestore = getFirestore();
    const q = query(
      collection(firestore, "labels"),
      where("userId", "==", userId),
      orderBy("labelOn", "desc")
    );
    const querySnapshot = await getDocs(q);
    let arr = [];
    querySnapshot.forEach((doc) => {
      labels = doc.data();
      let data = {
        name: labels.labelName,
        notesCount: labels.notesCount,
        labelId: labels.labelId,
      };
      arr.push(data);
    });
    setLabelData(arr);
  }
  useEffect(() => {
    getLabelData();
  }, []);
  return (
    <div className={styles.profileBox}>
      <div className={styles.profileTop}>
        <div className={styles.imgBox}>
          <img src="images/label.png" alt="" />
        </div>
        <div className={styles.contentBox}>
          <h1>Labels</h1>
          <h2>
            <b>{labelData.length} labels</b> in total
          </h2>
          <button
            className={styles.btn1}
            onClick={() => {
              setShowModel(true);
            }}
          >
            Add Label
          </button>
        </div>
      </div>
      <div className={styles.hr}></div>
      <div className={styles.allLabels}>
        {labelData.map((data, index) => {
          return (
            <LabelBox
              data={data}
              key={index}
              getLabelId={getLabelId}
              getRemoveId={getRemoveId}
            />
          );
        })}
      </div>

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
          <h2>Add label</h2>
          <div className={styles.inputBox}>
            <span>Label name</span>
            <input
              type="text"
              value={labelName}
              onChange={(e) => {
                setLabelName(e.target.value);
              }}
            ></input>
          </div>
          <button className={styles.btn} disabled={!valid} onClick={addLabel}>
            Add{" "}
          </button>
          <h5 className={message.length > 0 ? null : `${styles.hide}`}>
            {message}
          </h5>
        </div>
      </div>
      {/* Modal for label Update */}
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
          <h2>Update label</h2>
          <div className={styles.inputBox}>
            <span>Label name</span>
            <input
              type="text"
              value={updateLabelName}
              onChange={(e) => {
                setUpdateLabelName(e.target.value);
              }}
            ></input>
          </div>
          <button
            className={styles.btn}
            disabled={!valid1}
            onClick={updateLabel}
          >
            Update{" "}
          </button>
          <h5 className={message.length > 0 ? null : `${styles.hide}`}>
            {message}
          </h5>
        </div>
      </div>
      {/* Modal for label Removal */}
      <div className={showModel2 ? `${styles.modal}` : `${styles.hide}`}>
        <div className={styles.addLabel}>
          <p>
            <i
              className="fas fa-times"
              onClick={() => {
                setShowModel2(false);
              }}
            ></i>
          </p>
          <h2>Remove label</h2>
          <div className={styles.inputBox}>
            <span>Label name</span>
            <input disabled="true" type="text" value={remName}></input>
          </div>
          <h4>Removing label also remove the notes in this label.</h4>

          <button className={styles.btn} onClick={removeLabel}>
            Remove{" "}
          </button>
          <button
            className={styles.btn4}
            onClick={() => {
              setShowModel2(false);
            }}
          >
            Cancel{" "}
          </button>
          <h5 className={message.length > 0 ? null : `${styles.hide}`}>
            {message}
          </h5>
        </div>
      </div>
    </div>
  );
};

export default Labels;
