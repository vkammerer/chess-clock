import React, { Component } from "react";
import Player from "./Player";

const defaultState = {
  moves: [],
  currentPlayer: 1,
  currentStart: null,
  player1Elapsed: 0,
  player2Elapsed: 0,
};

const getMovesDuration = (moves, player) =>
  moves
    .filter(p => p.player === player)
    .reduce((acc, p) => acc + p.end - p.start, 0);

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
    this.reset = this.reset.bind(this);
    this.tick = this.tick.bind(this);
    this.switch = this.switch.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.togglePausePlay = this.togglePausePlay.bind(this);
    this.getSpentTime = this.getSpentTime.bind(this);
    this.getNextTickDelay = this.getNextTickDelay.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }
  reset() {
    clearTimeout(this.tickTimeout);
    this.setState(defaultState);
  }
  getSpentTime(now) {
    if (!this.state.currentStart) return 0;
    const movesDuration = getMovesDuration(
      this.state.moves,
      this.state.currentPlayer,
    );
    return now - this.state.currentStart + movesDuration;
  }
  getNextTickDelay(spentTime) {
    return this.props.refreshPeriod - (spentTime % this.props.refreshPeriod);
  }
  tick() {
    clearTimeout(this.tickTimeout);
    const now = Date.now();
    const spentTime = this.getSpentTime(now);
    const nextTickDelay = this.getNextTickDelay(spentTime);
    this.tickTimeout = setTimeout(this.tick, nextTickDelay);
    const playerElapsed =
      this.state.currentPlayer === 1 ? "player1Elapsed" : "player2Elapsed";
    this.setState({ [playerElapsed]: spentTime });
  }
  play() {
    clearTimeout(this.tickTimeout);
    const now = Date.now();
    const spentTime = this.getSpentTime(now);
    const nextTickDelay = this.getNextTickDelay(spentTime);
    this.tickTimeout = setTimeout(this.tick, nextTickDelay);
    this.setState({
      currentStart: now,
    });
  }
  pause() {
    clearTimeout(this.tickTimeout);
    const now = Date.now();
    const moves = [
      ...this.state.moves,
      {
        player: this.state.currentPlayer,
        start: this.state.currentStart,
        end: now,
      },
    ];
    this.setState({
      moves,
      currentStart: null,
    });
  }
  togglePausePlay() {
    if (this.state.currentStart) this.pause();
    else this.play();
  }
  switch() {
    clearTimeout(this.tickTimeout);
    const now = Date.now();
    const moves = !this.state.currentStart
      ? this.state.moves
      : [
          ...this.state.moves,
          {
            player: this.state.currentPlayer,
            start: this.state.currentStart,
            end: now,
          },
        ];
    const currentPlayer = this.state.currentPlayer === 1 ? 2 : 1;
    const spentTime = getMovesDuration(moves, currentPlayer);
    const nextTickDelay = this.getNextTickDelay(spentTime);
    this.tickTimeout = setTimeout(this.tick, nextTickDelay);
    this.setState({
      moves,
      currentPlayer,
      currentStart: now,
    });
  }
  handleKeyPress(event) {
    const keyCode = event.keyCode;
    if (keyCode === 32) this.switch();
    if (keyCode === 112) this.togglePausePlay();
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
            totalDuration={this.props.player1TotalDuration}
            spentDuration={this.state.player1Elapsed}
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
            totalDuration={this.props.player2TotalDuration}
            spentDuration={this.state.player2Elapsed}
            refreshPeriod={this.props.refreshPeriod}
            active={this.state.currentPlayer === 2}
          />
          <div />
        </main>
        <footer>
          <div className="buttons">
            <div onClick={this.togglePausePlay}>
              {this.state.currentStart ? "Pause" : "Play"} (P)
            </div>
            <div onClick={this.reset}>Reset (R)</div>
          </div>
        </footer>
      </div>
    );
  }
}

export default Clock;
