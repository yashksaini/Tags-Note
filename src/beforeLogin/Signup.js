import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./signup.module.scss";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc, getFirestore, serverTimestamp } from "firebase/firestore";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [valid, setValid] = useState(false);
  const [message, setMessage] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const submitForm = () => {
    setMessage("Signing up . . .");
    let auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        // If User is created successfully.
        sendEmailVerification(auth.currentUser)
          .then(() => {
            //  If Email is sent

            alert("Please verify email to login");
            const user = auth.currentUser;
            const firestore = getFirestore();
            // Adding data to database
            setDoc(doc(firestore, "profile", user.uid), {
              name: fullName,
              id: user.uid,
              email: user.email,
              imageUrl: "",
              dateJoined: serverTimestamp(),
            }).then(() => {
              // Data Inserted Successfully
              setMessage("");
              setSuccessMsg("Please verify email to login.");
              signOut(auth)
                .then(() => {
                  setEmail("");
                  setPassword("");
                  setFullName("");
                  setValid(false);
                  window.location.reload();
                })
                .catch((error) => {
                  console.log(error);
                });
            });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        setMessage(error.message);
      });
  };

  useEffect(() => {
    if (fullName.length > 2 && password.length > 5 && email.length > 5) {
      setValid(true);
      setMessage("");
    } else if (password.length > 1 && password.length < 6) {
      setValid(false);
      setMessage("Password should be 6 character's long.");
    } else {
      setMessage("");
      setValid(false);
    }
  }, [fullName, email, password]);
  return (
    <div className={styles.outerBox}>
      <div className={styles.box}>
        <div className={styles.title}>
          <img src="/images/logo.png" alt="" /> <h1>Tagsnote</h1>
        </div>
        <p className={styles.heading}>Create free account</p>
        <div className={styles.inputBox}>
          <span>Email Address</span>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></input>
        </div>
        <div className={styles.inputBox}>
          <span>Full Name</span>
          <input
            type="text"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
            }}
          ></input>
        </div>
        <div className={styles.inputBox}>
          <span>Create Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
        </div>
        <button className={styles.btn} disabled={!valid} onClick={submitForm}>
          Sign Up
        </button>
        <h6 className={message.length > 0 ? null : `${styles.hide}`}>
          {message}
        </h6>
        <h5 className={successMsg.length > 0 ? null : `${styles.hide}`}>
          {successMsg}
        </h5>
        <p>
          Forgot your password? <Link to="/reset">Reset it.</Link>
        </p>
        <p>
          Already have account? <Link to="/login">Log In </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
