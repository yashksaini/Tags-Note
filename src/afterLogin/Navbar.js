import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import styles from "./leftnavbar.module.scss";
const Navbar = () => {
  const [labelData, setLabelData] = useState([]);
  const [navOpen, setNavOpen] = useState(false);
  const userId = useContext(UserContext);
  let labels = {};
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
    <div className={navOpen ? `${styles.navbarOutNew}` : `${styles.navbarOut}`}>
      <div className={styles.topNav}>
        <p>
          <img src="images/logo.png" alt="" />
        </p>
        <span>
          <b>Tagsnote</b>
        </span>
        <p
          onClick={() => {
            let current = !navOpen;
            setNavOpen(current);
          }}
          className={styles.menu}
        >
          <i className="fas fa-bars"></i>
        </p>
      </div>
      <div className={navOpen ? `${styles.activeNav}` : `${styles.navbar}`}>
        <Link
          className={styles.eachNav}
          to="/profile"
          onClick={() => {
            setNavOpen(false);
          }}
        >
          <span>
            <i className="fas fa-user"></i>
          </span>
          <span>Profile</span>
        </Link>
        <Link
          className={styles.eachNav}
          to="/labels"
          onClick={() => {
            setNavOpen(false);
          }}
        >
          <span>
            <i className="fas fa-tag"></i>
          </span>
          <span>Labels</span>
        </Link>
        {labelData.map((data, index) => {
          return (
            <Link
              className={styles.eachNav}
              to={`../label/${data.labelId}`}
              key={index}
              onClick={() => {
                setNavOpen(false);
              }}
            >
              <span>
                <i className="fab fa-tumblr"></i>
              </span>
              <span>{data.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Navbar;
