import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import styles from "./profile.module.scss";
import Note from "./parts/Note";
const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imgLink, setImageLink] = useState("");
  const [displayNotes, setDisplayNotes] = useState([]);
  const userId = useContext(UserContext);
  let profile = {};
  let note = {};
  async function logOutUser() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  }
  async function getUserData() {
    const firestore = getFirestore();
    const q = query(
      collection(firestore, "profile"),
      where("id", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      profile = doc.data();
      setName(profile.name);
      setEmail(profile.email);
      setImageLink(profile.imageUrl);
    });
  }
  async function bookmarkNote(id, value) {
    const firestore = getFirestore();
    const labelRef = doc(firestore, "notes", id);
    await updateDoc(labelRef, {
      pinned: !value,
    });
    await getNotesData();
  }
  async function getNotesData() {
    const firestore = getFirestore();
    const q = query(
      collection(firestore, "notes"),
      where("userId", "==", userId),
      where("pinned", "==", true),
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
    setDisplayNotes(arr);
  }
  useEffect(() => {
    getUserData();
    getNotesData();
  }, []);
  return (
    <div className={styles.profileBox}>
      <div className={styles.profileTop}>
        <div className={styles.imgBox}>
          <img src="../images/user.png" alt="" />
        </div>
        <div className={styles.contentBox}>
          <h1>{name}</h1>
          <h2>{email}</h2>
          <button className={styles.btn1} onClick={logOutUser}>
            Log Out
          </button>
        </div>
      </div>
      <div className={styles.hr}></div>
      <div className={styles.profileTop}>
        <p>Bookmarked Notes</p>
      </div>

      <div className={styles.hr}></div>
      <div className={styles.allNotes}>
        {displayNotes.map((note, index) => {
          return <Note data={note} bookmarkNote={bookmarkNote} key={index} />;
        })}
      </div>
      <div className={styles.hr}></div>
    </div>
  );
};

export default Profile;
