import React from "react";
import UploadPage from "./components/UploadPage";
import "./App.css";
import DownloadPage from "./components/DownloadPage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path={"/download/:file_name"} component={DownloadPage} />
        <Route exact path={"/"} component={UploadPage} />
      </Switch>
    </Router>
  );
};

export default App;
