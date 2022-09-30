import { useContext, useEffect, useState } from "react";
import { BrowserRouter, Switch } from "react-router-dom";

import UnprotectedRoute from "./UnprotectedRoute";
import ProtectedRoute from "./ProtectedRoute";
import Signup from "./beforeLogin/Signup";
import Login from "./beforeLogin/Login";
import Home from "./beforeLogin/Home";

import "./App.scss";
import Reset from "./beforeLogin/Reset";
import { UserContext } from "./UserContext";
import Profile from "./afterLogin/Profile";
import Labels from "./afterLogin/Labels";
import Label from "./afterLogin/Label";
import Eachnote from "./afterLogin/Eachnote";
function App() {
  const [isAuth, setIsAuth] = useState(false);
  const userId = useContext(UserContext);

  useEffect(() => {
    if (userId === "") {
      setIsAuth(false);
    } else {
      setIsAuth(true);
    }
  }, [userId]);
  return (
    <BrowserRouter>
      <Switch>
        <UnprotectedRoute exact path="/" component={Home} isAuth={isAuth} />
        <UnprotectedRoute
          exact
          path="/login"
          component={Login}
          isAuth={isAuth}
        />
        <UnprotectedRoute
          exact
          path="/signup"
          component={Signup}
          isAuth={isAuth}
        />
        <UnprotectedRoute
          exact
          path="/reset"
          component={Reset}
          isAuth={isAuth}
        />

        <ProtectedRoute
          exact
          path="/profile"
          component={Profile}
          isAuth={isAuth}
        />
        <ProtectedRoute
          exact
          path="/labels"
          component={Labels}
          isAuth={isAuth}
        />
        <ProtectedRoute
          exact
          path="/label/:id"
          component={Label}
          isAuth={isAuth}
        />
        <ProtectedRoute
          exact
          path="/note/:id"
          component={Eachnote}
          isAuth={isAuth}
        />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
