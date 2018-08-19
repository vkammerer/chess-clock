import React, { Component } from "react";
import Clock from "./Clock";

const defaultPlayer = {
  total: 5 * 60 * 1000,
  increment: 0,
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
  if (playersLength > 1) return "players_2";
  return "";
};
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: defaultPlayers,
      settingsHarmony: false
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleMinutesChange = this.handleMinutesChange.bind(this);
    this.handleIncrementSelection = this.handleIncrementSelection.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
    this.removePlayer = this.removePlayer.bind(this);
    this.toggleSettingsHarmony = this.toggleSettingsHarmony.bind(this);
  }
  componentDidMount() {
    const htmlClassName = getHtmlClassName(this.state.players.length);
    document.querySelector("html").className = htmlClassName;
  }
  handleNameChange(index, name) {
    const players = [...this.state.players];
    players[index].name = name;
    this.setState({ players });
  }
  handleMinutesChange(index, delta) {
    let players = [...this.state.players];
    const total = players[index].total + delta * 60 * 1000;
    if (this.state.settingsHarmony) {
      players = this.state.players.map(p => ({
        ...p,
        total
      }));
    }
    else {
      players[index].total = total;
    }
    this.setState({ players });
  }
  handleIncrementSelection(index, increment) {
    let players;
    if (this.state.settingsHarmony) {
      players = this.state.players.map(p => ({
        ...p,
        increment: increment
      }));
    }
    else {
      players = [...this.state.players];
      players[index].increment = increment;
    }
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

  removePlayer() {
    const players = this.state.players.slice(0, -1);
    const htmlClassName = getHtmlClassName(players.length);
    this.setState({ players }, () => {
      document.querySelector("html").className = htmlClassName;
    });
  }

  toggleSettingsHarmony() {
    this.setState({ settingsHarmony: !this.state.settingsHarmony });
  }

  render() {
    return (
      <div className="app">
        <Clock
          players={this.state.players}
          refreshPeriod={1000}
          handleNameChange={this.handleNameChange}
          handleMinutesChange={this.handleMinutesChange}
          handleIncrementSelection={this.handleIncrementSelection}
          addPlayer={this.addPlayer}
          removePlayer={this.removePlayer}
          settingsHarmony={this.state.settingsHarmony}
          toggleSettingsHarmony={this.toggleSettingsHarmony}
        />
      </div>
    );
  }
}

export default App;
