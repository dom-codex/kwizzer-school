import React from "react";

const Optionlabel = (props) => {
  return (
    <div>
      {props.i + 1 === 1
        ? "A"
        : props.i + 1 === 2
        ? "B"
        : props.i + 1 === 3
        ? "C"
        : props.i + 1 === 4
        ? "D"
        : props.i + 1 === 5
        ? "E"
        : "F"}
    </div>
  );
};

export default Optionlabel;
