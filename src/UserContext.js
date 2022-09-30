import React, { createContext, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
export const UserContext = createContext();
const UserContextProvider = (props) => {
  const auth = getAuth();
  const [userId, setUserId] = useState("");
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserId(user.uid);
    } else {
      setUserId("");
    }
  });
  return (
    <UserContext.Provider value={userId}>{props.children}</UserContext.Provider>
  );
};

export default UserContextProvider;
