import React, { Component } from "react";
class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hours: parseInt(this.props.time.hr),
      minutes: parseInt(this.props.time.min),
      seconds: parseInt(this.props.time.sec),
    };
  }
  timer = setInterval(() => {
    if (
      this.state.minutes === 0 &&
      this.state.hours === 0 &&
      this.state.seconds === 0
    ) {
      clearInterval(this.timer);
      this.props.submit(this.timer);
      return;
    }
    if (this.state.seconds === 0) {
      if (this.state.minutes >= 1) {
        this.setState((state) => ({
          seconds: 59,
          minutes: state.minutes - 1,
        }));
      } else if (this.state.hours > 0 && this.state.minutes === 0) {
        this.setState((state) => ({
          seconds: 59,
          hours: state.hours - 1,
          minutes: 59,
        }));
      } else {
        this.setState((state) => ({
          seconds: 59,
        }));
      }
    } /*else if (this.state.minutes === 1 && this.state.hours <= 0) {
      this.setState((state) => ({
        seconds: 59,
        minutes: state.minutes - 1,
      }));
    }*/
    //block which executes when none of the condition is met
    else {
      this.setState((state) => ({
        seconds: state.seconds - 1,
      }));
    }
  }, 1000);
  doubleZero1 = () => {
    if (this.state.seconds <= 9) return "0";
    else return "";
  };
  doubleZero2 = () => {
    if (this.state.minutes <= 9) return "0";
    else return "";
  };
  doubleZero3 = () => {
    if (this.state.hours <= 9) return "0";
    else return "";
  };
  render() {
    return (
      <div className="timer-cont">
        <button
          className="submitExam"
          onClick={() => this.props.submit(this.timer)}
        >
          submit
        </button>
        <p>
          {this.doubleZero3() + this.state.hours} :{" "}
          {this.doubleZero2() + this.state.minutes} :{" "}
          {this.doubleZero1() + this.state.seconds}
        </p>
      </div>
    );
  }
}
export default Timer;
