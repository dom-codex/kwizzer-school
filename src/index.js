import React from "react";
import ReactDOM from "react-dom";
import { Route, BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import ModeProvider from "./context/mode";
import * as serviceWorker from "./serviceWorker";

import Layout from "./components/sub-components/layout";
import Examiner from "./screens/examiner";
const routing = (
  <Router>
    <ModeProvider>
      <Layout>
        <div className="routes">
          <Route component={Examiner} />
        </div>
      </Layout>
    </ModeProvider>
  </Router>
);
ReactDOM.render(routing, document.getElementById("root"));
/*ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);*/

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
