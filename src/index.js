import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { initializeApp } from "firebase/app";
import UserContextProvider from "./UserContext";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const firebaseConfig = {
  apiKey: "apiKey",
  authDomain: "tags-note.firebaseapp.com",
  projectId: "tags-note",
  storageBucket: "tags-note.appspot.com",
  messagingSenderId: "messagingSenderId",
  appId: "appId",
  measurementId: "measurementId",
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
