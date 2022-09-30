import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import styles from "./signup.module.scss";

const Reset = () => {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (email.length > 4) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [email]);

  async function resetPassword() {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setMessage("Password reset email sent!");
      })
      .catch((error) => {
        console.log(error.message);
      });
  }
  return (
    <div className={styles.outerBox}>
      <div className={styles.box}>
        <div className={styles.title}>
          <img src="/images/logo.png" alt="" /> <h1>Tagsnote</h1>
        </div>
        <p className={styles.heading}>Reset Password</p>
        <div className={styles.inputBox}>
          <span>Email Address</span>
          <input
            type="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></input>
        </div>

        <button
          className={styles.btn}
          disabled={!isValid}
          onClick={resetPassword}
        >
          Reset
        </button>
        <h5 className={message.length > 0 ? null : `${styles.hide}`}>
          {message}
        </h5>
        <p>
          Know your password? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Reset;
