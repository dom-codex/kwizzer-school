import React from "react";
import "../../css/jumbo.css";
function Jumbo(props) {
  return (
    <div className="jumbo-greeting">
      <div className="user-name">
        <h1>{props.title}</h1>
      </div>
    </div>
  );
}
export default Jumbo;
