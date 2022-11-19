import "../App.css";
import { Switch, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Messages from "./Messages";

function App() {
  return (
    <div className="App">
      <Switch>
        <Dashboard />
      </Switch>
    </div>
  );
}

export default App;
