import React, { Component } from "react";
import Clock from "./Clock";

const defaultPlayer = {
  total: 5 * 60 * 1000,
};
const defaultPlayers = [
  {
    ...defaultPlayer,
    name: "Player 1",
  },
  {
    ...defaultPlayer,
    name: "Player 2",
  },
];

const getHtmlClassName = playersLength => {
  if (playersLength > 9) return "players_10";
  if (playersLength > 6) return "players_7";
  return "";
};
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: defaultPlayers,
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleMinutesChange = this.handleMinutesChange.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
  }
  handleNameChange(index, name) {
    const players = [...this.state.players];
    players[index].name = name;
    this.setState({ players });
  }
  handleMinutesChange(index, delta) {
    const players = [...this.state.players];
    players[index].total = players[index].total + delta * 60 * 1000;
    this.setState({ players });
  }
  addPlayer() {
    const players = [
      ...this.state.players,
      { ...defaultPlayer, name: `player ${this.state.players.length + 1}` },
    ];
    const htmlClassName = getHtmlClassName(players.length);
    this.setState({ players }, () => {
      document.querySelector("html").className = htmlClassName;
    });
  }
  render() {
    return (
      <div className="app">
        <Clock
          players={this.state.players}
          refreshPeriod={1000}
          increment={5000}
          handleNameChange={this.handleNameChange}
          handleMinutesChange={this.handleMinutesChange}
          addPlayer={this.addPlayer}
        />
      </div>
    );
  }
}

export default App;
