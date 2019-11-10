import React, { Component } from "react";
import "./Settings.css";

export default class Settings extends Component {
  render() {
    const btnClassName = this.props.isStart ? "disable" : "";
    console.log(btnClassName);
    return (
      <div className="settings">
        <div className="settings-section">
          <label id="break-label">Break Length</label>
          <div>
            <button
              className={btnClassName}
              id="break-decrement"
              onClick={this.props.onDecreaseBreak}
            >
              -
            </button>
            <span id="break-length">{this.props.breakLength}</span>
            <button
              className={btnClassName}
              id="break-increment"
              onClick={this.props.onIncreaseBreak}
            >
              +
            </button>
          </div>
        </div>
      </div>
    );
  }
}
