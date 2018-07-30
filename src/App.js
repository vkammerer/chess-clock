import React, { Component } from "react";
import Clock from "./Clock";

class App extends Component {
  render() {
    return (
      <div className="app">
        <Clock
          player1TotalDuration={100000}
          player2TotalDuration={100000}
          refreshPeriod={200}
        />
      </div>
    );
  }
}

export default App;
