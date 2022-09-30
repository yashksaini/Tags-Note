import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { initializeApp } from "firebase/app";
import UserContextProvider from "./UserContext";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const firebaseConfig = {
  apiKey: "AIzaSyASb6McR0qmzANIee7CXICfjt0y7jT84mY",
  authDomain: "tags-note.firebaseapp.com",
  projectId: "tags-note",
  storageBucket: "tags-note.appspot.com",
  messagingSenderId: "103734559495",
  appId: "1:103734559495:web:42d342dcbe8258320a7ba2",
  measurementId: "G-054N5P9CYW",
};
// Initialize Firebase
initializeApp(firebaseConfig);
ReactDOM.render(
  <UserContextProvider>
    <App />
  </UserContextProvider>,
  document.getElementById("root")
);

serviceWorkerRegistration.register();
