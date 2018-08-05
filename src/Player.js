import React, { PureComponent } from "react";
import classnames from "classnames";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import ContentEditable from "react-contenteditable";
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
        <ContentEditable
          className="name"
          html={this.props.name}
          disabled={this.props.playing}
          onChange={this.handleNameChange}
          onFocus={this.onNameFocus}
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
        <div className="progressContainer">
          <div className="progress">
            <div className="progressBar" style={progressStyle} />
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
      </div>
    );
  }
}
export default Player;
