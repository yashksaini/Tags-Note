import React from "react";
import { Link } from "react-router-dom";
import styles from "./home.module.scss";
const Home = () => {
  return (
    <div className={styles.home}>
      <div className={styles.topBox}>
        <div className={styles.logo}>
          <img src="./images/logo.png" alt="" />
        </div>

        <div className={styles.loginBox}>
          <Link to="/login" className={styles.loginBtn}>
            Login
          </Link>
        </div>
        <div className={styles.title}>
          <h1>#Tagsnote</h1>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.leftBox}>
          <div className={styles.bigContent}>
            <h1>
              <span>Create.</span>
              <span>
                <i>Organize.</i>
              </span>
            </h1>
            <h1>
              <span>Tags.</span>
              <span>Easy</span>
            </h1>
          </div>
          <div className={styles.smallContent}>
            <p>Inspiration strikes anywhere.</p>
            <p>
              Notes are the best place to write down thoughts or to save time.
            </p>
            <p>Tagsnote lets you organize your notes across any device.</p>
            <Link to="/signup" className={styles.signupBtn}>
              Create Account
            </Link>
          </div>
        </div>
        <div className={styles.rightBox}>
          <img src="./images/home.png" alt="" />
          <p>
            Developed By ~ <b>Yash Kumar Saini</b> <br />© 2022 (22.7.15.16)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
