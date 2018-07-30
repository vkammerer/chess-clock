import React, { Component } from "react";
import Clock from "./Clock";

class App extends Component {
  render() {
    return (
      <div className="app">
        <Clock
          player1Duration={100000}
          player2Duration={100000}
          refreshPeriod={200}
          increment={10000}
        />
      </div>
    );
  }
}

export default App;
