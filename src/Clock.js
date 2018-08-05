import React, { Component } from "react";
import Player from "./Player";

const defaultState = {
  currentPlayer: 0,
  over: false,
  now: null,
  currentMoveStart: null,
};

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...defaultState,
      players: props.players.map(() => ({
        moves: [],
        pendingMoves: [],
        turns: 0,
      })),
    };
    this.reset = this.reset.bind(this);
    this.tick = this.tick.bind(this);
    this.switch = this.switch.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.togglePlayPause = this.togglePlayPause.bind(this);
    this.getTurns = this.getTurns.bind(this);
    this.getBonus = this.getBonus.bind(this);
    this.getElapsed = this.getElapsed.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }
  reset() {
    clearTimeout(this.tickTimeout);
    this.setState({
      ...defaultState,
      players: this.props.players.map(() => ({
        moves: [],
        pendingMoves: [],
        turns: 0,
      })),
    });
  }
  static getDerivedStateFromProps(props, state) {
    if (props.players.length !== state.players.length)
      return {
        ...state,
        players: props.players.map((p, i) => {
          if (state.players[i]) return state.players[i];
          return {
            moves: [],
            pendingMoves: [],
            turns: 0,
          };
        }),
      };
    return {};
  }
  tick() {
    const now = Date.now();
    const total = this.getTotal(this.state.currentPlayer);
    const bonus = this.getBonus(this.state.currentPlayer);
    const elapsed =
      this.getElapsed(this.state.currentPlayer, true) +
      now -
      this.state.currentMoveStart;
    const over = total + bonus - elapsed < 0;
    const players = [...this.state.players];
    const player = players[this.state.currentPlayer];
    player.moves = [
      ...player.moves,
      ...player.pendingMoves,
      {
        start: this.state.currentMoveStart,
        end: now,
      },
    ];
    player.pendingMoves = [];
    this.setState({
      players,
      over,
      now,
      currentMoveStart: now,
    });
  }
  play() {
    const now = Date.now();
    this.setState({
      now,
      currentMoveStart: now,
    });
  }
  pause() {
    clearTimeout(this.tickTimeout);
    const now = Date.now();
    const players = [...this.state.players];
    const player = players[this.state.currentPlayer];
    player.pendingMoves = [
      ...player.pendingMoves,
      {
        start: this.state.currentMoveStart,
        end: now,
      },
    ];
    this.setState({
      players,
      currentMoveStart: null,
    });
  }
  togglePlayPause() {
    if (this.state.currentMoveStart) this.pause();
    else this.play();
  }
  switch() {
    clearTimeout(this.tickTimeout);
    const currentPlayer =
      this.state.currentPlayer + 1 < this.state.players.length
        ? this.state.currentPlayer + 1
        : 0;
    if (!this.state.currentMoveStart) return this.setState({ currentPlayer });
    const now = Date.now();
    const players = [...this.state.players];
    const player = players[this.state.currentPlayer];
    player.pendingMoves = [
      ...player.pendingMoves,
      {
        start: this.state.currentMoveStart,
        end: now,
      },
    ];
    player.turns = player.turns + 1;
    this.setState({
      players,
      currentPlayer,
      currentMoveStart: now,
      now,
    });
  }
  getTurns(playerIndex) {
    return this.state.players[playerIndex].turns;
  }
  getTotal(playerIndex) {
    return this.props.players[playerIndex].total;
  }
  getBonus(playerIndex) {
    return (
      this.getTurns(playerIndex) * this.props.players[playerIndex].increment
    );
  }
  getElapsed(playerIndex, includePending) {
    const moves = includePending
      ? [
          ...this.state.players[playerIndex].moves,
          ...this.state.players[playerIndex].pendingMoves,
        ]
      : this.state.players[playerIndex].moves;
    const movesElapsed = moves.reduce((acc, p) => acc + p.end - p.start, 0);
    return movesElapsed;
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      !this.state.over &&
      this.state.now &&
      prevState.now !== this.state.now
    ) {
      const movesElapsed = this.getElapsed(this.state.currentPlayer, true);
      const delay = movesElapsed + this.state.now - this.state.currentMoveStart;
      const nextTickDelay =
        this.props.refreshPeriod - (delay % this.props.refreshPeriod);
      this.tickTimeout = setTimeout(this.tick, nextTickDelay);
    }
  }
  handleKeyPress(event) {
    if (event.target.contentEditable === "true") return;
    const keyCode = event.keyCode;
    if (keyCode === 32) this.switch();
    if (keyCode === 112) this.togglePlayPause();
    if (keyCode === 114) this.reset();
  }
  componentDidMount() {
    document.addEventListener("keypress", this.handleKeyPress);
  }
  componentWillUnmount() {
    document.removeEventListener("keypress", this.handleKeyPress);
  }
  render() {
    return (
      <div className="clock">
        <header>
          <div className="settings buttons">
            <div onClick={this.props.addPlayer}>Add player</div>
          </div>
        </header>
        <main>
          {this.props.players.map((p, i) => (
            <Player
              name={p.name}
              index={i}
              key={i}
              total={p.total}
              increment={p.increment}
              bonus={this.getBonus(i)}
              elapsed={this.getElapsed(i, true)}
              tickedElapsed={this.getElapsed(i)}
              refreshPeriod={this.props.refreshPeriod}
              active={this.state.currentPlayer === i}
              playing={this.state.currentMoveStart !== null}
              handleNameChange={this.props.handleNameChange}
              handleMinutesChange={this.props.handleMinutesChange}
              handleIncrementSelection={this.props.handleIncrementSelection}
            />
          ))}
        </main>
        <footer>
          <div className="actions buttons">
            <div onClick={this.togglePlayPause}>
              {this.state.currentMoveStart ? "Pause" : "Play"} (P)
            </div>
            <div onClick={this.switch}>Next (Space)</div>
            <div onClick={this.reset}>Reset (R)</div>
          </div>
        </footer>
      </div>
    );
  }
}

export default Clock;
