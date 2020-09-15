import React from "react";
import "../../css/toggle.css";

const Switch = (props) => {
  const { toggle, isResult, setToggle } = props;
  return (
    <div className="switch">
      <input
        type="checkbox"
        id={props.forRetry ? "retry" : "switch"}
        className="checkbox"
        checked={toggle ? true : false}
        onChange={() => {
          if (props.isExam) {
            setToggle();
            return;
          } else if (isResult) {
            setToggle(!toggle);
            return;
          }
          setToggle((prev) => {
            props.handleInput({ target: { value: !prev } }, "retry");
            return !prev;
          });
        }}
      />
      <label
        htmlFor={props.forRetry ? "retry" : "switch"}
        className="toggle"
      ></label>
    </div>
  );
};

export default Switch;
