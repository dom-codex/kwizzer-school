import React from "react";
import "../../css/menu-tile.css";

const Menutile = (props) => {
  return (
    <div className="tile" onClick={props.action}>
      {props.subtile}
      <div className="tile-icon">
        {/*<img src={Icon} style={{ height: 100 }} />*/}
        <i className="material-icons">{props.icon}</i>
      </div>
      <div className="tile-desc">
        <p>{props.title}</p>
      </div>
    </div>
  );
};
export default Menutile;
