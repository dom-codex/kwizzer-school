import React from "react";
import "../../css/indeterminatePreloader.css";
const IndeterminateIndicator = (props) => {
  return (
    <div className="loader" style={props.style ? props.style : {}}>
      <div className="progress-line"></div>
    </div>
  );
};

export default IndeterminateIndicator;
