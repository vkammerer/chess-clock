import React, { Component } from "react";
import Player from "./Player";

const defaultState = {
  moves: [],
  currentPlayer: 1,
  currentMoveStart: null,
};

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
    this.reset = this.reset.bind(this);
    this.tick = this.tick.bind(this);
    this.switch = this.switch.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.togglePlayPause = this.togglePlayPause.bind(this);
    this.getTurns = this.getTurns.bind(this);
    this.getDuration = this.getDuration.bind(this);
    this.getElapsed = this.getElapsed.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }
  reset() {
    clearTimeout(this.tickTimeout);
    this.setState(defaultState);
  }
  tick() {
    this.setState({ now: Date.now() });
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
    this.setState({
      moves: [
        ...this.state.moves,
        {
          player: this.state.currentPlayer,
          start: this.state.currentMoveStart,
          end: Date.now(),
        },
      ],
      currentMoveStart: null,
    });
  }
  togglePlayPause() {
    if (this.state.currentMoveStart) this.pause();
    else this.play();
  }
  getTurns(player) {
    return this.state.moves.filter((m, index) => {
      const nextMove = this.state.moves[index + 1];
      return (
        m.player === player &&
        ((nextMove && nextMove.player !== player) ||
          (!nextMove && this.state.currentPlayer !== player))
      );
    }).length;
  }
  getDuration(player) {
    const playerDuration = player === 1 ? "player1Duration" : "player2Duration";
    return (
      this.props[playerDuration] + this.getTurns(player) * this.props.increment
    );
  }
  isMoving(player) {
    return this.state.currentMoveStart && this.state.currentPlayer === player;
  }
  getElapsed(player) {
    const movesDuration = this.state.moves
      .filter(p => p.player === player)
      .reduce((acc, p) => acc + p.end - p.start, 0);
    if (this.isMoving(player))
      return movesDuration + this.state.now - this.state.currentMoveStart;
    return movesDuration;
  }
  switch() {
    clearTimeout(this.tickTimeout);
    const now = Date.now();
    const moves = !this.state.currentMoveStart
      ? this.state.moves
      : [
          ...this.state.moves,
          {
            player: this.state.currentPlayer,
            start: this.state.currentMoveStart,
            end: now,
          },
        ];
    const currentPlayer = this.state.currentPlayer === 1 ? 2 : 1;
    this.setState({
      moves,
      currentPlayer,
      now,
      currentMoveStart: now,
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.now !== this.state.now) {
      const elapsed = this.getElapsed(this.state.currentPlayer);
      const nextTickDelay =
        this.props.refreshPeriod - (elapsed % this.props.refreshPeriod);
      clearTimeout(this.tickTimeout);
      this.tickTimeout = setTimeout(this.tick, nextTickDelay);
    }
  }
  handleKeyPress(event) {
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
        <main>
          <div />
          <Player
            name="Vincent"
            originalDuration={this.props.player1Duration}
            duration={this.getDuration(1)}
            elapsed={this.getElapsed(1)}
            refreshPeriod={this.props.refreshPeriod}
            active={this.state.currentPlayer === 1}
          />
          <div className="switch">
            <div className="buttons">
              <div onClick={this.switch}>Switch (Space)</div>
            </div>
          </div>
          <Player
            name="Didier"
            originalDuration={this.props.player2Duration}
            duration={this.getDuration(2)}
            elapsed={this.getElapsed(2)}
            refreshPeriod={this.props.refreshPeriod}
            active={this.state.currentPlayer === 2}
          />
          <div />
        </main>
        <footer>
          <div className="buttons">
            <div onClick={this.togglePlayPause}>
              {this.state.currentMoveStart ? "Pause" : "Play"} (P)
            </div>
            <div onClick={this.reset}>Reset (R)</div>
          </div>
        </footer>
      </div>
    );
  }
}

export default Clock;
