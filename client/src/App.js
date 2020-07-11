import React from "react";
import { AppContextProvider } from "./context/AppContext";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "./components/HomePage.jsx";
import Trivia from "./pages/Trivia.jsx";

function App() {
  return (
    <Router>
      <AppContextProvider>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/trivia" component={Trivia} />
        </Switch>
      </AppContextProvider>
    </Router>
  );
}

export default App;
