import React from "react";
import PubTile from "../sub-components/publishedQuizTile";

const QuizCandidate = (props) => {
  return (
    <div className="published-quiz-list">
      {props.published.length &&
        !props.isExam > 0 &&
        props.published.map((pub, i) => {
          return (
            <PubTile
              key={i}
              registered={pub.registered}
              quiz={pub.quiz}
              showList={() => props.ShowList(true)}
              getParam={props.getParam}
              showToast={() => props.setToast(true)}
            />
          );
        })}
    </div>
  );
};

export default QuizCandidate;
