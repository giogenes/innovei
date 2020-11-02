import React, { Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Units from "./components/units";
import SideBar from "./components/sidebar/sidebar";
import Header from "./components/header/header";

function App() {
  return (
    <Fragment>
      <Router>
        <div className="grid grid-cols-12 grid-rows-12" style={{ height: "100vh" }}>
          <Header />
          <div className="overscroll-y-scroll col-start-1 col-end-13 md:col-start-4 lg:col-start-3 row-start-2 row-end-13 bg-gray-100 z-10">
            <Switch>
              <Route path="/units">
                <Units />
              </Route>
            </Switch>
          </div>
          <SideBar />
        </div>
      </Router>
    </Fragment>
  );
}

export default App;
