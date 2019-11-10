/* global chrome */
/* global iframe */
/* global div */
import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Folk from "./Folk";
import Settings from "./Settings";
import Times from "./Times";
import Controller from "./Controller";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.audioBeep = React.createRef();
    this.state = {
      domain: "",
      breakLength: Number.parseInt(this.props.defaultBreakLength, 10),
      timeLabel: "Break",
      timeLeftInSecond: Number.parseInt(this.props.defaultBreakLength, 10),
      isStart: false,
      timerInterval: null
    };
    this.onIncreaseBreak = this.onIncreaseBreak.bind(this);
    this.onDecreaseBreak = this.onDecreaseBreak.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onStartStop = this.onStartStop.bind(this);
    this.decreaseTimer = this.decreaseTimer.bind(this);
    this.phaseControl = this.phaseControl.bind(this);
  }

  componentDidMount() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const url = new URL(tabs[0].url);
      const domain = url.hostname;
      this.setState({
        domain: domain
      });
    });
    window.addEventListener("message", function(event) {
      var size = JSON.parse(event.data);
      iframe.style.height = div.style.height = size.height + "250px";
      // iframe.style.width = div.style.width = size.width + "500px";
    });
  }

  onIncreaseBreak() {
    if (this.state.breakLength < 60 && !this.state.isStart) {
      this.setState({
        breakLength: this.state.breakLength + 1,
        timeLeftInSecond: this.state.breakLength + 1
      });
    }
  }

  onDecreaseBreak() {
    if (this.state.breakLength > 1 && !this.state.isStart) {
      this.setState({
        breakLength: this.state.breakLength - 1,
        timeLeftInSecond: this.state.breakLength - 1
      });
    }
  }

  onReset() {
    this.setState({
      breakLength: Number.parseInt(this.props.defaultBreakLength, 10),
      timeLabel: "Break",
      timeLeftInSecond: Number.parseInt(this.props.defaultBreakLength, 10),
      isStart: false,
      timerInterval: null
    });

    this.audioBeep.current.pause();
    this.audioBeep.current.currentTime = 0;
    this.state.timerInterval && clearInterval(this.state.timerInterval);
  }

  onStartStop() {
    if (!this.state.isStart) {
      this.setState({
        isStart: !this.state.isStart,
        timerInterval: setInterval(() => {
          this.decreaseTimer();
          this.phaseControl();
        }, 1000)
      });
    } else {
      this.audioBeep.current.pause();
      this.audioBeep.current.currentTime = 0;
      this.state.timerInterval && clearInterval(this.state.timerInterval);
      this.setState({
        isStart: !this.state.isStart,
        timerInterval: null
      });
    }
  }

  decreaseTimer() {
    this.setState({
      timeLeftInSecond: this.state.timeLeftInSecond - 1
    });
  }

  phaseControl() {
    if (this.state.timeLeftInSecond === 0) {
      this.audioBeep.current.play();
      // chrome.tabs.getCurrent(function(tab) {
      //   alert("Time's up!");
      //   chrome.tabs.remove(tab.id, function() {});
      // });
      // chrome.tabs.query.addListener(function(tabId, changeInfo, tab) {
      //   if (changeInfo.status === "complete") {
      //     alert("Time's up!");
      //     chrome.tabs.remove(tabId);
      //   }
      // });
      chrome.tabs.getSelected(null, function(tab) {
        alert("Time's up!");
        chrome.tabs.remove(tab.id);
      });
    } else if (this.state.timeLeftInSecond === -1) {
      this.setState({
        timeLabel: "Break",
        timeLeftInSecond: this.state.breakLength * 60
      });
    }
  }

  render() {
    return (
      <div className="whole-thing">
        <div className="pomodoro-clock">
          <div className="pomodoro-clock-header">
            <h1 className="pomodoro-clock-header-name">
              Aww, You Must Be Bored!
            </h1>
          </div>

          <Settings
            breakLength={this.state.breakLength}
            isStart={this.state.isStart}
            onDecreaseBreak={this.onDecreaseBreak}
            onIncreaseBreak={this.onIncreaseBreak}
          />

          <Times
            timeLabel={this.state.timeLabel}
            timeLeftInSecond={this.state.timeLeftInSecond}
          />

          <Controller
            onReset={this.onReset}
            onStartStop={this.onStartStop}
            isStart={this.state.isStart}
          />

          <audio
            id="beep"
            preload="auto"
            src="https://goo.gl/65cBl1"
            ref={this.audioBeep}
          />

          <Folk
            targetURL={this.props.githubURL}
            color="#4c4d4e"
            backgroundColor="#fff"
            position="right"
            size="120px"
            ariaLabel="View source on Github"
          />
        </div>
        <div className="App">
          <h3 className="App-title">
            You're currently on {this.state.domain}, here's a list of other
            sites:
          </h3>
          <p>
            <button
              type="submit"
              onClick={() => {
                window.open("https://www.bored.com/");
              }}
            >
              Bored.com
            </button>
          </p>
          <p>
            <button
              type="submit"
              onClick={() => {
                window.open("https://www.nytimes.com/");
              }}
            >
              Nytimes.com
            </button>
          </p>
          <p>
            <button
              type="submit"
              onClick={() => {
                window.open("https://www.reddit.com/");
              }}
            >
              Reddit.com
            </button>
          </p>
          <p>
            <button
              type="submit"
              onClick={() => {
                window.open("https://littlealchemy.com/");
              }}
            >
              Littlealchemy.com
            </button>
          </p>
        </div>
      </div>
    );
  }
}

export default App;
