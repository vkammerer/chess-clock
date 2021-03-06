import React, { PureComponent } from "react";
import classnames from "classnames";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import "./Player.css";
momentDurationFormatSetup(moment);

const formatTime = duration =>
  moment
    .duration(duration)
    .format("mm:ss", { trim: false })
    .split(":");

class Player extends PureComponent {
  constructor(props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePlusClick = this.handlePlusClick.bind(this);
    this.handleMinusClick = this.handleMinusClick.bind(this);
    this.handleIncrementSelection = this.handleIncrementSelection.bind(this);
  }
  handleNameChange(evt) {
    this.props.handleNameChange(this.props.index, evt.target.value);
  }
  handlePlusClick() {
    this.props.handleMinutesChange(this.props.index, 1);
  }
  handleMinusClick() {
    this.props.handleMinutesChange(this.props.index, -1);
  }
  onNameFocus() {
    setTimeout(() => document.execCommand("selectAll", false, null), 0);
  }
  handleIncrementSelection(event) {
    this.props.handleIncrementSelection(
      this.props.index,
      parseInt(event.target.value, 10),
    );
  }
  render() {
    const playerClassName = classnames("player", {
      active: this.props.active,
      playing: this.props.playing,
      overtime: this.props.bonus - this.props.tickedElapsed > 0,
    });
    const totalMoment = formatTime(this.props.total);
    const tickedRemaining =
      this.props.total + this.props.bonus - this.props.tickedElapsed;
    const tickedRemainingMoment = formatTime(Math.max(0, tickedRemaining));
    const remaining = this.props.total + this.props.bonus - this.props.elapsed;
    const shouldTransitionToNextTick = this.props.active && this.props.playing;
    const progressRemaining = shouldTransitionToNextTick
      ? remaining - this.props.refreshPeriod
      : remaining;
    const progressProportion =
      Math.max(0, Math.min(progressRemaining, this.props.total)) /
      this.props.total;
    const progressTransitionDuration =
      this.props.active && this.props.playing ? this.props.refreshPeriod : 0;
    const progressStyle = {
      transform: `scaleX(${progressProportion})`,
      transitionDuration: `${progressTransitionDuration}ms`,
    };
    return (
      <div className={playerClassName}>
        <input
          type="text"
          className="name"
          value={this.props.name}
          disabled={this.props.playing}
          onChange={this.handleNameChange}
          onFocus={this.onNameFocus}
          tabIndex={this.props.index + 1000}
        />
        <div className="time">
          <div className="timeDisplay">
            <span>{tickedRemainingMoment[0]}</span>
            :
            <span>{tickedRemainingMoment[1]}</span>
          </div>
          <div className="timeControls">
            <div onClick={this.handlePlusClick}>+</div>
            <div onClick={this.handleMinusClick}>-</div>
          </div>
        </div>
        <div className="progress">
          <div className="progressBar">
            <div className="progressBarBg" style={progressStyle} />
          </div>
          <div className="increment">
            <select
              value={this.props.increment}
              onChange={this.handleIncrementSelection}
              tabIndex={this.props.index + 2000}
            >
              <option value={0}>+ 0s / move</option>
              <option value={5000}>+ 5s / move</option>
              <option value={10000}>+ 10s / move</option>
              <option value={20000}>+ 20s / move</option>
              <option value={30000}>+ 30s / move</option>
            </select>
          </div>
          <div className="progressLegend">
            <span>0</span>
            <span>
              {totalMoment[0]}
              :
              {totalMoment[1]}
            </span>
          </div>
        </div>
      </div>
    );
  }
}
export default Player;
