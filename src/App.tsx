import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./features/Home";
import Login from "./features/Login";
import store from "./stores";
import { Provider } from "react-redux";

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
}
