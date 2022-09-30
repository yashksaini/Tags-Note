import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./signup.module.scss";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [valid, setValid] = useState(false);
  const [message, setMessage] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  async function submitForm() {
    setMessage("Logging in . . .");
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        let verify = auth.currentUser.emailVerified;
        if (verify) {
          setSuccessMsg("Logged In Successfully");
          setEmail("");
          setPassword("");
          setValid(false);
        } else {
          sendEmailVerification(auth.currentUser).then(() => {
            signOut(auth);
            alert("Please verify email to login");
          });
        }
      })
      .catch((error) => {
        setMessage(error.message);
      });
  }
  useEffect(() => {
    if (password.length > 5 && email.length > 5) {
      setValid(true);
      setMessage("");
    } else {
      setMessage("");
      setValid(false);
    }
  }, [email, password]);
  return (
    <div className={styles.outerBox}>
      <div className={styles.box}>
        <div className={styles.title}>
          <img src="/images/logo.png" alt="" /> <h1>Tagsnote</h1>
        </div>
        <p className={styles.heading}>Log In</p>
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
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
        </div>
        <button className={styles.btn} disabled={!valid} onClick={submitForm}>
          Log In
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
          No account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
