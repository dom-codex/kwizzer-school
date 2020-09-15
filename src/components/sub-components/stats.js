import React from "react";
import "../../css/stats.css";
const StatsCard = (props) => {
  return (
    <div className="stats">
      <div className="stats-card">
        <div className="stats-details">
          <p>{props.label}</p>
          <p>{props.value}</p>
        </div>
        <div className="stats-icons"></div>
      </div>
    </div>
  );
};

export default StatsCard;
