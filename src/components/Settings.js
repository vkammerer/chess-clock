import React, { Component } from "react";
// import classnames from "classnames";
import "./Settings.css";

class Settings extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="settings">
        <div className="setting">
          <label>Changing settings apply to all players</label>
          <div className="settingAction">
            <input
              type="checkbox"
              checked={this.props.settingsHarmony}
              onChange={this.props.toggleSettingsHarmony}
            />
          </div>
        </div>
        <div className="setting">
          <label>Number of players: {this.props.players.length}</label>
          <div className="settingAction">
            <button tabIndex={5} onClick={this.props.addPlayer}>
              +
            </button>
            <button tabIndex={6} onClick={this.props.removePlayer}>
              -
            </button>
          </div>
        </div>
      </div>
    );
  }
}
export default Settings;
