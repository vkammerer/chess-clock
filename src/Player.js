import React, { Component } from "react";
import classnames from "classnames";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
momentDurationFormatSetup(moment);

class Player extends Component {
  constructor(props) {
    super();
  }
  render() {
    const timeLeft = this.props.totalDuration - this.props.spentDuration + 50;
    const momentLeft = moment
      .duration(timeLeft)
      .format("mm:ss", { trim: false });
    const proportion = timeLeft / this.props.totalDuration;
    const playerClassName = classnames("player", {
      active: this.props.active,
    });
    return (
      <div className={playerClassName}>
        <div className="name">{this.props.name}</div>
        <div className="time">{momentLeft}</div>
        <div className="progressContainer">
          <div
            className="progress"
            style={{
              transform: `scaleX(${proportion})`,
              transitionDuration: `${this.props.refreshPeriod}ms`,
            }}
          />
        </div>
      </div>
    );
  }
}
export default Player;
