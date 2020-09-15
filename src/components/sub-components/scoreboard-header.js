import React from "react";
import "../../css/scoreboardHeader.css";
const ScoreBoardHeader = (props) => {
  const { forStud } = props;
  return (
    <div>
      <h3 className="quiz-topic">{props.title}</h3>
      <div class="score-board-details">
        <div>
          <p>{forStud ? "status: approved" : "Total candidates: 50"}</p>
        </div>
        <div class="release-btn">
          <button>{forStud ? "view details" : "release result"}</button>
        </div>
      </div>
    </div>
  );
};
export default ScoreBoardHeader;
